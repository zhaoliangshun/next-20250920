"use client";

/* eslint-disable indent */
/* eslint-disable no-fallthrough */
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

/**
 * Sticky 组件 - React 粘性定位组件
 *
 * 该组件实现了类似 CSS position: sticky 的功能，但提供了更多的控制和兼容性。
 * 组件可以在滚动时保持元素固定在视口的指定位置，支持三种状态：
 * - ORIGINAL: 原始位置
 * - RELEASED: 释放状态，元素在文档中但不在默认位置
 * - FIXED: 固定状态，元素固定在屏幕顶部或底部
 *
 * 主要特性：
 * - 支持顶部偏移量（top）和底部边界（bottomBoundary）
 * - 支持通过选择器指定偏移量和边界
 * - 支持启用/禁用粘性功能
 * - 支持使用 CSS transform 提升性能
 * - 响应窗口大小变化和滚动事件
 */

"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { subscribe } from "subscribe-ui-event";
import classNames from "classnames";
import shallowEqual from "shallowequal";

// ==================== 常量定义 ====================
/**
 * 状态常量：原始位置状态
 * 元素位于其原始文档位置
 */
const STATUS_ORIGINAL = 0;

/**
 * 状态常量：释放状态
 * 元素已从原始位置移动，但未固定在视口
 */
const STATUS_RELEASED = 1;

/**
 * 状态常量：固定状态
 * 元素固定在视口的顶部或底部
 */
const STATUS_FIXED = 2;

/**
 * CSS transform 属性名
 * 根据浏览器支持情况，可能是 'transform' 或带前缀的版本（如 '-webkit-transform'）
 */
let TRANSFORM_PROP = "transform";

// ==================== 全局变量 ====================
/**
 * 全局变量，所有 Sticky 实例共享
 * 这些变量在第一个实例挂载时初始化，避免重复初始化
 */
let doc; // document 对象
let docBody; // document.body 对象
let docEl; // document.documentElement 对象
/**
 * 是否可以使用 CSS transform
 * 默认 true，如果没有 Modernizr 检测，低端浏览器可能无法使用 Sticky
 */
let canEnableTransforms = true;
let M; // Modernizr 对象（如果存在）
let scrollDelta = 0; // 滚动增量，用于判断滚动方向
let win; // window 对象
let winHeight = -1; // 窗口高度

/**
 * Sticky 组件类
 * 实现粘性定位功能的 React 组件
 */
class Sticky extends Component {
  /**
   * 构造函数
   * @param {Object} props - 组件属性
   * @param {Object} context - React 上下文
   */
  constructor(props, context) {
    super(props, context);

    // 绑定事件处理函数
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollStart = this.handleScrollStart.bind(this);

    // 实例变量初始化
    this.delta = 0; // 当前滚动增量
    this.stickyTop = 0; // 粘性元素的顶部位置
    this.stickyBottom = 0; // 粘性元素的底部位置
    this.frozen = false; // 是否冻结更新（由 shouldFreeze 控制）
    this.skipNextScrollEvent = false; // 是否跳过下一次滚动事件
    this.scrollTop = -1; // 当前滚动位置

    // DOM 元素引用
    this.bottomBoundaryTarget; // 底部边界目标元素
    this.topTarget; // 顶部偏移目标元素
    this.subscribers; // 事件订阅者数组

    // 组件状态初始化
    this.state = {
      top: 0, // 从视口顶部开始的顶部偏移量，当向上滚动时元素会固定在此位置
      bottom: 0, // 从视口顶部开始的底部偏移量，当向下滚动时元素会固定在此位置
      width: 0, // Sticky 元素的宽度
      height: 0, // Sticky 元素的高度
      x: 0, // Sticky 元素的原始 x 坐标（相对于文档）
      y: 0, // Sticky 元素的原始 y 坐标（相对于文档）
      topBoundary: 0, // 文档上的顶部边界，当元素到达此位置时恢复原始状态
      bottomBoundary: Infinity, // 文档上的底部边界，当元素到达此位置时进入释放状态
      status: STATUS_ORIGINAL, // Sticky 的当前状态（ORIGINAL/RELEASED/FIXED）
      pos: 0, // 实际渲染时的 y 轴偏移量，用于 position-fixed 和 position-relative
      activated: false, // 激活标志，挂载后浏览器信息可用时变为 true，避免校验和错误
    };
  }

  /**
   * 获取目标元素的高度
   * @param {HTMLElement} target - 目标 DOM 元素
   * @returns {number} 元素高度，如果元素不存在则返回 0
   */
  getTargetHeight(target) {
    return (target && target.offsetHeight) || 0;
  }

  /**
   * 获取顶部偏移位置
   * 支持数字（像素值）或字符串（CSS 选择器）
   * 如果是选择器，会查找对应元素并使用其高度作为偏移量
   * @param {string|number} top - 可选的顶部偏移值，用于覆盖从 props 读取的值
   * @returns {number} 顶部偏移量（像素）
   */
  getTopPosition(top) {
    // 如果提供了 top 参数则使用它，否则从 props 读取，最后默认为 0
    top = top || this.props.top || 0;

    // 如果 top 是字符串，则作为 CSS 选择器使用
    if (typeof top === "string") {
      // 缓存查询结果，避免重复查询
      if (!this.topTarget) {
        this.topTarget = doc.querySelector(top);
      }
      // 使用目标元素的高度作为偏移量
      top = this.getTargetHeight(this.topTarget);
    }
    return top;
  }

  /**
   * 获取目标元素的底部位置（相对于文档）
   * @param {HTMLElement} target - 目标 DOM 元素
   * @returns {number} 元素底部在文档中的位置，如果元素不存在则返回 -1
   */
  getTargetBottom(target) {
    if (!target) {
      return -1;
    }
    const rect = target.getBoundingClientRect();
    // 将视口坐标转换为文档坐标
    return this.scrollTop + rect.bottom;
  }

  /**
   * 获取底部边界值
   * 支持数字（像素值）、字符串（CSS 选择器）或对象（已废弃）
   * 如果是选择器，会查找对应元素并使用其底部位置作为边界
   * @param {string|number|Object} bottomBoundary - 可选的底部边界值，用于覆盖从 props 读取的值
   * @returns {number} 底部边界值（像素），如果无效则返回 Infinity
   */
  getBottomBoundary(bottomBoundary) {
    // 如果提供了 bottomBoundary 参数则使用它，否则从 props 读取
    let boundary = bottomBoundary || this.props.bottomBoundary;

    // TODO: bottomBoundary 曾经是对象类型，后续版本将废弃此支持
    if (typeof boundary === "object") {
      boundary = boundary.value || boundary.target || 0;
    }

    // 如果 boundary 是字符串，则作为 CSS 选择器使用
    if (typeof boundary === "string") {
      // 缓存查询结果，避免重复查询
      if (!this.bottomBoundaryTarget) {
        this.bottomBoundaryTarget = doc.querySelector(boundary);
      }
      // 使用目标元素的底部位置作为边界
      boundary = this.getTargetBottom(this.bottomBoundaryTarget);
    }

    // 返回有效的边界值，如果无效则返回 Infinity（表示无边界限制）
    return boundary && boundary > 0 ? boundary : Infinity;
  }

  /**
   * 重置元素到原始位置
   * 将状态设置为 ORIGINAL，位置偏移量设为 0
   */
  reset() {
    this.setState({
      status: STATUS_ORIGINAL,
      pos: 0,
    });
  }

  /**
   * 释放元素（进入 RELEASED 状态）
   * 元素从原始位置移动，但未固定在视口
   * @param {number} pos - 目标位置（相对于文档的 y 坐标）
   */
  release(pos) {
    this.setState({
      status: STATUS_RELEASED,
      // 计算相对于原始位置的偏移量
      pos: pos - this.state.y,
    });
  }

  /**
   * 固定元素（进入 FIXED 状态）
   * 元素固定在视口的指定位置
   * @param {number} pos - 固定位置（相对于视口的 y 坐标）
   */
  fix(pos) {
    this.setState({
      status: STATUS_FIXED,
      pos: pos,
    });
  }

  /**
   * 更新初始位置、宽度和高度
   * 当子元素内容发生变化时应该调用此方法
   * @param {Object} options - 可选参数对象，包含新的 top 和 bottomBoundary 值
   */
  updateInitialDimension(options) {
    options = options || {};

    // 如果 DOM 元素引用不存在，则无法更新
    if (!this.outerElement || !this.innerElement) {
      return;
    }

    // 获取外层和内层元素的边界矩形
    const outerRect = this.outerElement.getBoundingClientRect();
    const innerRect = this.innerElement.getBoundingClientRect();

    // 计算宽度和高度（兼容不同浏览器）
    const width = outerRect.width || outerRect.right - outerRect.left;
    const height = innerRect.height || innerRect.bottom - innerRect.top;

    // 计算外层元素在文档中的 y 坐标
    const outerY = outerRect.top + this.scrollTop;

    // 更新状态
    this.setState({
      top: this.getTopPosition(options.top), // 顶部偏移量
      bottom: Math.min(this.state.top + height, winHeight), // 底部偏移量，不超过窗口高度
      width, // 元素宽度
      height, // 元素高度
      x: outerRect.left, // 原始 x 坐标
      y: outerY, // 原始 y 坐标（相对于文档）
      bottomBoundary: this.getBottomBoundary(options.bottomBoundary), // 底部边界
      topBoundary: outerY, // 顶部边界（即原始位置）
    });
  }

  /**
   * 处理窗口大小变化事件
   * 当窗口大小改变时，更新窗口高度并重新计算元素尺寸和位置
   * @param {Event} e - 事件对象
   * @param {Object} ae - 事件附加信息，包含 resize.height
   */
  handleResize(e, ae) {
    // 如果组件被冻结，则不处理
    if (this.props.shouldFreeze()) {
      return;
    }

    // 更新全局窗口高度
    winHeight = ae.resize.height;
    // 更新元素尺寸
    this.updateInitialDimension();
    // 更新元素位置
    this.update();
  }

  /**
   * 处理滚动开始事件
   * 在滚动开始时检查是否需要更新初始尺寸
   * @param {Event} e - 事件对象
   * @param {Object} ae - 事件附加信息，包含 scroll.top
   */
  handleScrollStart(e, ae) {
    // 检查是否应该冻结更新
    this.frozen = this.props.shouldFreeze();

    if (this.frozen) {
      return;
    }

    // 如果滚动位置没有变化，标记跳过下一次滚动事件
    if (this.scrollTop === ae.scroll.top) {
      // 滚动位置未改变，无需处理
      this.skipNextScrollEvent = true;
    } else {
      // 更新滚动位置并重新计算初始尺寸
      this.scrollTop = ae.scroll.top;
      this.updateInitialDimension();
    }
  }

  /**
   * 处理滚动事件
   * 更新滚动增量和位置，然后更新元素状态
   * @param {Event} e - 事件对象
   * @param {Object} ae - 事件附加信息，包含 scroll.delta 和 scroll.top
   */
  handleScroll(e, ae) {
    // 如果标记为跳过，则直接返回
    if (this.skipNextScrollEvent) {
      this.skipNextScrollEvent = false;
      return;
    }

    // 更新全局滚动增量（用于判断滚动方向）
    scrollDelta = ae.scroll.delta;
    // 更新当前滚动位置
    this.scrollTop = ae.scroll.top;
    // 更新元素位置和状态
    this.update();
  }

  /**
   * 更新 Sticky 元素的位置和状态
   * 这是组件的核心方法，根据当前滚动位置和元素状态决定元素应该处于什么状态
   * 以及应该显示在什么位置
   */
  update() {
    // 检查是否应该禁用粘性功能
    // 禁用条件：
    // 1. enabled 属性为 false
    // 2. 可用空间（底部边界 - 顶部边界）小于等于元素高度
    // 3. 元素尺寸为 0（未初始化）
    var disabled =
      !this.props.enabled ||
      this.state.bottomBoundary - this.state.topBoundary <= this.state.height ||
      (this.state.width === 0 && this.state.height === 0);

    // 如果禁用，则重置到原始状态
    if (disabled) {
      if (this.state.status !== STATUS_ORIGINAL) {
        this.reset();
      }
      return;
    }

    // 获取滚动增量（正数表示向下滚动，负数表示向上滚动）
    var delta = scrollDelta;

    // 计算 top 和 bottom 在文档中的投影位置
    // 这些位置是 this.state.top 和 this.state.bottom 从视口坐标转换为文档坐标
    var top = this.scrollTop + this.state.top;
    var bottom = this.scrollTop + this.state.bottom;

    // 确保 Sticky 不会出错的 2 个原则：
    // 1. 当 "top" <= topBoundary 时，重置 Sticky 到原始位置
    // 2. 当 "bottom" >= bottomBoundary 时，释放 Sticky 到底部边界
    if (top <= this.state.topBoundary) {
      // 原则 1：元素已回到原始位置上方，重置到原始状态
      this.reset();
    } else if (bottom >= this.state.bottomBoundary) {
      // 原则 2：元素已到达或超过底部边界，释放到底部边界位置
      this.stickyBottom = this.state.bottomBoundary;
      this.stickyTop = this.stickyBottom - this.state.height;
      this.release(this.stickyTop);
    } else {
      // 元素在顶部边界和底部边界之间
      // 根据元素高度与视口的关系，采用不同的处理策略

      if (this.state.height > winHeight - this.state.top) {
        // 情况 A：元素高度大于视口高度减去顶部偏移量
        // 这种情况下，元素可能无法完全显示在视口中，需要更复杂的状态管理

        switch (this.state.status) {
          case STATUS_ORIGINAL:
            // 从原始状态开始，释放元素并设置粘性边界
            this.release(this.state.y);
            this.stickyTop = this.state.y;
            this.stickyBottom = this.stickyTop + this.state.height;
          // 注意：这里故意不写 break，因为调用 window.scrollTo() 时
          // 可能直接从 ORIGINAL 状态转换到 FIXED 状态

          case STATUS_RELEASED:
            // 释放状态：如果 "top" 和 "bottom" 在 stickyTop 和 stickyBottom 之间，
            // 则保持 RELEASED 状态。否则，根据滚动方向转换到 FIXED 状态：
            // - 向下滚动且 bottom > stickyBottom：底部固定到视口底部
            // - 向上滚动且 top < stickyTop：顶部固定到视口顶部
            this.stickyBottom = this.stickyTop + this.state.height;

            if (delta > 0 && bottom > this.stickyBottom) {
              // 向下滚动，底部超出粘性底部边界，固定到底部
              this.fix(this.state.bottom - this.state.height);
            } else if (delta < 0 && top < this.stickyTop) {
              // 向上滚动，顶部超出粘性顶部边界，固定到顶部
              this.fix(this.state.top);
            }
            break;

          case STATUS_FIXED:
            // 固定状态：需要判断是否应该释放
            // 在正常情况下，FIXED 状态时：
            // 1. 顶部固定到屏幕顶部（向下滚动时）
            // 2. 底部固定到屏幕底部（向上滚动时）
            // 3. 如果以上都不是，则可能是高度发生了变化
            var toRelease = true;
            var pos = this.state.pos;
            var height = this.state.height;

            if (delta > 0 && pos === this.state.top) {
              // 情况 1：向下滚动，且顶部固定到视口顶部
              this.stickyTop = top - delta;
              this.stickyBottom = this.stickyTop + height;
            } else if (delta < 0 && pos === this.state.bottom - height) {
              // 情况 2：向上滚动，且底部固定到视口底部
              this.stickyBottom = bottom - delta;
              this.stickyTop = this.stickyBottom - height;
            } else if (
              pos !== this.state.bottom - height &&
              pos !== this.state.top
            ) {
              // 情况 3：位置不在顶部或底部，可能是高度发生了变化
              // 这种情况只发生在 Sticky 的底部固定到屏幕底部且高度发生变化时
              // 应该进入 RELEASE 状态，并通过计算高度变化量来更新粘性底部位置
              const deltaHeight = pos + height - this.state.bottom;
              this.stickyBottom = bottom - delta + deltaHeight;
              this.stickyTop = this.stickyBottom - height;
            } else {
              // 其他情况，不需要释放
              toRelease = false;
            }

            // 如果需要释放，则转换到 RELEASED 状态
            if (toRelease) {
              this.release(this.stickyTop);
            }
            break;
        }
      } else {
        // 情况 B：元素高度小于等于视口高度减去顶部偏移量
        // 这种情况下，元素总是可以完全显示，直接固定到顶部偏移位置
        this.fix(this.state.top);
      }
    }

    // 保存当前滚动增量
    this.delta = delta;
  }

  /**
   * 组件更新后的生命周期方法
   * 处理状态变化回调和属性变化
   * @param {Object} prevProps - 之前的属性
   * @param {Object} prevState - 之前的状态
   */
  componentDidUpdate(prevProps, prevState) {
    // 如果状态发生变化，触发回调
    if (prevState.status !== this.state.status && this.props.onStateChange) {
      this.props.onStateChange({ status: this.state.status });
    }

    // 检查是否需要更新（在滚动恢复等情况下触发）
    if (this.state.top !== prevState.top) {
      this.updateInitialDimension();
      this.update();
    }

    // 检查属性是否发生变化
    const arePropsChanged = !shallowEqual(this.props, prevProps);
    if (arePropsChanged) {
      // 如果 enabled 属性被切换，根据当前值触发更新或重置
      if (prevProps.enabled !== this.props.enabled) {
        if (this.props.enabled) {
          // 启用：激活组件并更新
          this.setState({ activated: true }, () => {
            this.updateInitialDimension();
            this.update();
          });
        } else {
          // 禁用：停用组件并重置
          this.setState({ activated: false }, () => {
            this.reset();
          });
        }
      }
      // 如果 top 或 bottomBoundary 属性发生变化，触发更新
      else if (
        prevProps.top !== this.props.top ||
        prevProps.bottomBoundary !== this.props.bottomBoundary
      ) {
        this.updateInitialDimension();
        this.update();
      }
    }
  }

  /**
   * 组件卸载前的生命周期方法
   * 清理所有事件订阅，避免内存泄漏
   */
  componentWillUnmount() {
    const subscribers = this.subscribers || [];
    // 从后往前遍历并取消订阅
    for (var i = subscribers.length - 1; i >= 0; i--) {
      this.subscribers[i].unsubscribe();
    }
  }

  /**
   * 组件挂载后的生命周期方法
   * 初始化全局变量、设置初始状态、订阅事件
   */
  componentDidMount() {
    // 只在第一次挂载时初始化全局变量
    // 这样可以避免多个实例重复初始化
    if (!win) {
      win = window;
      doc = document;
      docEl = doc.documentElement;
      docBody = doc.body;
      winHeight = win.innerHeight || docEl.clientHeight;
      M = window.Modernizr;

      // 如果没有 Modernizr，低端浏览器可能无法使用 Sticky
      if (M && M.prefixed) {
        // 检查是否支持 CSS 3D transforms
        canEnableTransforms = M.csstransforms3d;
        // 获取带前缀的 transform 属性名（如 -webkit-transform）
        TRANSFORM_PROP = M.prefixed("transform");
      }
    }

    // 挂载时，滚动位置不一定在顶部，需要获取当前滚动位置
    this.scrollTop = docBody.scrollTop + docEl.scrollTop;

    // 如果初始启用，则激活组件并更新
    if (this.props.enabled) {
      this.setState({ activated: true });
      this.updateInitialDimension();
      this.update();
    }

    // 无论初始是否启用，都绑定事件监听器
    // 这样允许组件在运行时切换粘性功能
    this.subscribers = [
      // 订阅滚动开始事件，使用 requestAnimationFrame 优化性能
      subscribe("scrollStart", this.handleScrollStart.bind(this), {
        useRAF: true,
      }),
      // 订阅滚动事件，启用滚动信息以获取 delta 和 top
      subscribe("scroll", this.handleScroll.bind(this), {
        useRAF: true,
        enableScrollInfo: true,
      }),
      // 订阅窗口大小变化事件，启用尺寸信息以获取新高度
      subscribe("resize", this.handleResize.bind(this), {
        enableResizeInfo: true,
      }),
    ];
  }

  /**
   * 应用位置变换
   * 根据浏览器支持情况，使用 CSS transform 或 top 属性来定位元素
   * transform 性能更好，因为它不会触发重排（reflow）
   * @param {Object} style - 样式对象，会被修改
   * @param {number} pos - 位置偏移量（像素）
   */
  translate(style, pos) {
    // 检查是否应该使用 transform
    // 需要同时满足：浏览器支持、props 启用、组件已激活
    const enableTransforms = canEnableTransforms && this.props.enableTransforms;

    if (enableTransforms && this.state.activated) {
      // 使用 translate3d 启用硬件加速，提升性能
      style[TRANSFORM_PROP] = "translate3d(0," + Math.round(pos) + "px,0)";
    } else {
      // 降级使用 top 属性
      style.top = pos + "px";
    }
  }

  /**
   * 决定组件是否应该更新
   * 如果组件被冻结或 props/state 没有变化，则不更新
   * @param {Object} nextProps - 下一个属性
   * @param {Object} nextState - 下一个状态
   * @returns {boolean} 是否应该更新
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      // 如果组件未被冻结
      !this.props.shouldFreeze() &&
      // 且 props 或 state 发生了变化
      !(
        shallowEqual(this.props, nextProps) &&
        shallowEqual(this.state, nextState)
      )
    );
  }

  /**
   * 渲染组件
   * 返回包含外层和内层 div 的结构
   * @returns {React.Element} React 元素
   */
  render() {
    // TODO: "overflow: auto" 会阻止高度塌陷，需要更好的方法获取子元素高度

    // 内层样式：根据状态设置 position 和 top
    const innerStyle = {
      position: this.state.status === STATUS_FIXED ? "fixed" : "relative",
      top: this.state.status === STATUS_FIXED ? "0px" : "",
      zIndex: this.props.innerZ,
    };

    // 外层样式：用于保持布局空间
    const outerStyle = {};

    // 始终使用 translate3d 来提升性能
    this.translate(innerStyle, this.state.pos);

    // 如果不在原始状态，需要设置宽度和高度以保持布局
    if (this.state.status !== STATUS_ORIGINAL) {
      innerStyle.width = this.state.width + "px";
      outerStyle.height = this.state.height + "px";
    }

    // 外层元素的类名
    const outerClasses = classNames(
      "sticky-outer-wrapper", // 默认类名
      this.props.className, // 用户自定义类名
      {
        // 根据状态添加动态类名
        [this.props.activeClass]: this.state.status === STATUS_FIXED,
        [this.props.releasedClass]: this.state.status === STATUS_RELEASED,
      }
    );

    // 内层元素的类名
    const innerClasses = classNames(
      "sticky-inner-wrapper", // 默认类名
      this.props.innerClass, // 用户自定义类名
      {
        // 根据状态添加动态类名
        [this.props.innerActiveClass]: this.state.status === STATUS_FIXED,
      }
    );

    const children = this.props.children;

    return (
      <div
        ref={(outer) => {
          this.outerElement = outer;
        }}
        className={outerClasses}
        style={outerStyle}
      >
        <div
          ref={(inner) => {
            this.innerElement = inner;
          }}
          className={innerClasses}
          style={innerStyle}
        >
          {/* 支持函数式 children，可以接收状态信息 */}
          {typeof children === "function"
            ? children({ status: this.state.status })
            : children}
        </div>
      </div>
    );
  }
}

// 设置组件显示名称，用于 React DevTools
Sticky.displayName = "Sticky";

/**
 * 默认属性值
 */
Sticky.defaultProps = {
  /**
   * 是否应该冻结更新
   * 返回 true 时，组件不会响应滚动和调整大小事件
   * @returns {boolean} 是否冻结
   */
  shouldFreeze: function () {
    return false;
  },
  enabled: true, // 是否启用粘性功能
  top: 0, // 顶部偏移量（像素）或 CSS 选择器
  bottomBoundary: 0, // 底部边界（像素）或 CSS 选择器
  enableTransforms: true, // 是否启用 CSS transform（性能更好）
  activeClass: "active", // 固定状态时的 CSS 类名
  releasedClass: "released", // 释放状态时的 CSS 类名
  onStateChange: null, // 状态变化时的回调函数
  innerClass: "", // 内层元素的自定义 CSS 类名
  innerActiveClass: "", // 内层元素在固定状态时的 CSS 类名
};

/**
 * 组件属性类型定义
 *
 * @param {boolean} enabled - 开关，用于启用或禁用 Sticky 功能
 * @param {string|number} top - Sticky 的顶部偏移量（像素）。
 *                              可以是选择器字符串，表示一个节点，其高度将作为顶部偏移量
 * @param {string|number|Object} bottomBoundary - 文档上的底部边界（像素），Sticky 将在此处停止。
 *                                                 可以是选择器字符串，表示一个节点，其底部将作为底部边界
 * @param {React.Element|Function} children - 子元素，可以是 React 元素或函数
 *                                            函数形式：children({ status }) => React.Element
 * @param {boolean} enableTransforms - 是否启用 CSS transform（默认 true，性能更好）
 * @param {string} activeClass - 固定状态时添加到外层元素的 CSS 类名
 * @param {string} releasedClass - 释放状态时添加到外层元素的 CSS 类名
 * @param {string} innerClass - 添加到内层元素的自定义 CSS 类名
 * @param {string} innerActiveClass - 固定状态时添加到内层元素的 CSS 类名
 * @param {string} className - 添加到外层元素的自定义 CSS 类名
 * @param {Function} onStateChange - 状态变化时的回调函数，接收 { status } 参数
 * @param {Function} shouldFreeze - 判断是否应该冻结更新的函数，返回 boolean
 * @param {string|number} innerZ - 内层元素的 z-index 值
 */
Sticky.propTypes = {
  children: PropTypes.element, // 子元素（实际也支持函数形式，但 PropTypes 定义为此）
  enabled: PropTypes.bool, // 是否启用
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 顶部偏移量
  bottomBoundary: PropTypes.oneOfType([
    PropTypes.object, // TODO: 可能在未来版本中移除
    PropTypes.string, // CSS 选择器
    PropTypes.number, // 像素值
  ]), // 底部边界
  enableTransforms: PropTypes.bool, // 是否启用 transform
  activeClass: PropTypes.string, // 固定状态的类名
  releasedClass: PropTypes.string, // 释放状态的类名
  innerClass: PropTypes.string, // 内层元素类名
  innerActiveClass: PropTypes.string, // 内层元素激活状态类名
  className: PropTypes.string, // 外层元素类名
  onStateChange: PropTypes.func, // 状态变化回调
  shouldFreeze: PropTypes.func, // 冻结判断函数
  innerZ: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 内层 z-index
};

/**
 * 导出状态常量，供外部使用
 * 例如：Sticky.STATUS_FIXED
 */
Sticky.STATUS_ORIGINAL = STATUS_ORIGINAL; // 原始状态
Sticky.STATUS_RELEASED = STATUS_RELEASED; // 释放状态
Sticky.STATUS_FIXED = STATUS_FIXED; // 固定状态

export default Sticky;

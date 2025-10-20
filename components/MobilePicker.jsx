"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./MobilePicker.module.css";

/**
 * 移动端选择器组件
 * 支持滑动选择，选中项高亮，远离选中项颜色渐变
 */
const MobilePicker = ({
  options = [],
  value,
  defaultValue,
  onChange,
  visibleCount = 5,
  visibleCountAbove,
  visibleCountBelow,
  itemHeight = 44,
  className = "",
  style = {},
  disabled = false,
  placeholder = "请选择",
  symmetricStyles, // 对称样式配置
  labelWidth,
  labelAlign = "center", // left, center, right
}) => {
  // 当前选中的索引
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (value !== undefined) {
      const index = options.findIndex((opt) => opt.value === value);
      return index >= 0 ? index : 0;
    }
    if (defaultValue !== undefined) {
      const index = options.findIndex((opt) => opt.value === defaultValue);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  // 滚动偏移量
  const [scrollOffset, setScrollOffset] = useState(0);

  // 是否正在拖动
  const [isDragging, setIsDragging] = useState(false);

  // 引用
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const lastMoveYRef = useRef(0);
  const animationFrameRef = useRef(null);
  const isClickRef = useRef(true); // 添加这个引用来跟踪是否是点击事件
  const moveThreshold = 5; // 移动阈值，超过此值认为是拖动

  // 计算上下显示数量
  const countAbove = visibleCountAbove !== undefined ? visibleCountAbove : Math.floor(visibleCount / 2);
  const countBelow = visibleCountBelow !== undefined ? visibleCountBelow : Math.floor(visibleCount / 2);
  const totalVisible = countAbove + 1 + countBelow; // 上面 + 选中项 + 下面

  // 计算容器高度
  const containerHeight = totalVisible * itemHeight;


  // 更新外部受控值
  useEffect(() => {
    if (value !== undefined) {
      const index = options.findIndex((opt) => opt.value === value);
      if (index >= 0 && index !== selectedIndex) {
        setSelectedIndex(index);
        setScrollOffset(-index * itemHeight);
      }
    }
  }, [value, options, itemHeight, selectedIndex]);

  // 滚动到指定索引
  const scrollToIndex = useCallback(
    (index, animated = true) => {
      const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
      const targetOffset = -clampedIndex * itemHeight;

      if (animated) {
        // 平滑滚动动画
        const startOffset = scrollOffset;
        const distance = targetOffset - startOffset;
        const duration = 300;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // 使用缓动函数
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentOffset = startOffset + distance * easeOut;

          setScrollOffset(currentOffset);

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            setScrollOffset(targetOffset);
            setSelectedIndex(clampedIndex);
            onChange?.(options[clampedIndex]);
          }
        };

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animate();
      } else {
        setScrollOffset(targetOffset);
        setSelectedIndex(clampedIndex);
        onChange?.(options[clampedIndex]);
      }
    },
    [scrollOffset, itemHeight, options, onChange]
  );

  // 处理触摸/鼠标开始
  const handleStart = useCallback(
    (clientY) => {
      if (disabled) return;

      setIsDragging(true);
      isClickRef.current = true; // 开始时认为是点击事件
      startYRef.current = clientY;
      startOffsetRef.current = scrollOffset;
      velocityRef.current = 0;
      lastMoveTimeRef.current = Date.now();
      lastMoveYRef.current = clientY;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [disabled, scrollOffset]
  );

  // 处理触摸/鼠标移动
  const handleMove = useCallback(
    (clientY) => {
      if (!isDragging) return;

      const deltaY = clientY - startYRef.current;
      // 如果移动距离超过一定阈值，则认为是拖动而不是点击
      if (Math.abs(deltaY) > moveThreshold) {
        isClickRef.current = false;
      }
      const newOffset = startOffsetRef.current + deltaY;

      // 计算速度
      const now = Date.now();
      const timeDelta = now - lastMoveTimeRef.current;
      if (timeDelta > 0) {
        velocityRef.current = (clientY - lastMoveYRef.current) / timeDelta;
      }
      lastMoveTimeRef.current = now;
      lastMoveYRef.current = clientY;

      // 添加边界阻尼效果
      const maxOffset = 0;
      const minOffset = -(options.length - 1) * itemHeight;

      let finalOffset = newOffset;
      if (newOffset > maxOffset) {
        finalOffset = maxOffset + (newOffset - maxOffset) * 0.3;
      } else if (newOffset < minOffset) {
        finalOffset = minOffset + (newOffset - minOffset) * 0.3;
      }

      setScrollOffset(finalOffset);
    },
    [isDragging, itemHeight, options.length]
  );

  // 处理触摸/鼠标结束
  const handleEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    // 不再这里重置 isClickRef，而是在下一个事件循环中重置
    // 这样可以确保 onClick 事件能正确读取到 isClickRef 的值
    setTimeout(() => {
      isClickRef.current = true;
    }, 0);

    // 计算最终位置（考虑惯性）
    const momentum = velocityRef.current * 200;
    let finalOffset = scrollOffset + momentum;

    // 限制范围
    const maxOffset = 0;
    const minOffset = -(options.length - 1) * itemHeight;
    finalOffset = Math.max(minOffset, Math.min(maxOffset, finalOffset));

    // 对齐到最近的项
    const targetIndex = Math.round(-finalOffset / itemHeight);
    scrollToIndex(targetIndex, true);
  }, [isDragging, scrollOffset, itemHeight, options.length, scrollToIndex]);

  // 鼠标事件处理
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientY);
  };

  const handleMouseMove = useCallback(
    (e) => {
      handleMove(e.clientY);
    },
    [handleMove]
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // 触摸事件处理
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientY);
  };

  const handleTouchMove = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
      }
      handleMove(e.touches[0].clientY);
    },
    [isDragging, handleMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // 添加全局事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // 清理动画帧
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 计算每个选项的透明度和缩放
  const getItemStyle = (index) => {
    const currentPosition = scrollOffset / itemHeight;
    const distance = Math.abs(index + currentPosition);

    // 如果有对称样式配置，使用它
    if (symmetricStyles && symmetricStyles.length > 0) {
      const distanceLevel = Math.round(distance);

      // 查找匹配的样式配置
      const styleConfig = symmetricStyles.find(s => s.distance === distanceLevel);

      if (styleConfig) {
        return {
          color: styleConfig.color || "#000000",
          fontSize: styleConfig.fontSize || "16px",
          fontWeight: styleConfig.fontWeight || (distanceLevel === 0 ? 600 : 400),
          opacity: styleConfig.opacity !== undefined ? styleConfig.opacity : 1,
          transform: styleConfig.scale ? `scale(${styleConfig.scale})` : "scale(1)",
        };
      }

      // 如果没有找到匹配的，使用最后一个样式（默认样式）
      const defaultStyle = symmetricStyles[symmetricStyles.length - 1];
      return {
        color: defaultStyle.color || "#666666",
        fontSize: defaultStyle.fontSize || "16px",
        fontWeight: defaultStyle.fontWeight || 400,
        opacity: defaultStyle.opacity !== undefined ? defaultStyle.opacity : 0.5,
        transform: defaultStyle.scale ? `scale(${defaultStyle.scale})` : "scale(0.92)",
      };
    }

    // 默认样式（没有对称配置时）
    let opacity = 1;
    if (distance > 0) {
      opacity = Math.max(0.5, 1 - distance * 0.08);
    }

    const scale = distance === 0 ? 1 : Math.max(0.92, 1 - distance * 0.04);
    const fontWeight = distance < 0.5 ? 700 : 500;
    const color = distance < 0.5 ? "#000000" : "#666666";

    return {
      opacity,
      transform: `scale(${scale})`,
      fontWeight,
      color,
    };
  };

  // 渲染选项列表
  const renderOptions = () => {
    return options.map((option, index) => {
      const isSelected = index === selectedIndex && !isDragging;

      // 检查是否有自定义样式配置
      const hasCustomStyle = option.customStyle !== undefined;
      const hasCustomColor = option.color !== undefined;
      const hasCustomFontSize = option.fontSize !== undefined;

      // 如果有任何自定义配置，则不应用默认的渐变效果
      let finalStyle;
      if (hasCustomStyle || hasCustomColor || hasCustomFontSize) {
        // 使用自定义样式，不计算 opacity 和 scale
        finalStyle = {
          height: `${itemHeight}px`,
          lineHeight: `${itemHeight}px`,
          color: option.color,
          fontSize: option.fontSize,
          fontWeight: isSelected ? 700 : 500,
          ...option.customStyle,
        };
      } else {
        // 使用默认的渐变样式
        const itemStyle = getItemStyle(index);
        finalStyle = {
          height: `${itemHeight}px`,
          lineHeight: `${itemHeight}px`,
          ...itemStyle,
        };
      }

      return (
        <div
          key={option.value}
          className={`${styles.pickerItem} ${isSelected ? styles.pickerItemSelected : ""}`}
          style={finalStyle}
          onClick={() => !disabled && isClickRef.current && scrollToIndex(index)}
        >
          <span style={{ width: labelWidth ? labelWidth : null, display: 'inline-block', textAlign: labelAlign }}>
            {option.label}
          </span>
        </div>
      );
    });
  };

  return (
    <div
      className={`${styles.pickerContainer} ${disabled ? styles.pickerDisabled : ""} ${className}`}
      style={{ height: `${containerHeight}px`, ...style }}
    >
      {/* 选中指示器 */}
      <div
        className={styles.pickerIndicator}
        style={{
          top: `${countAbove * itemHeight}px`,
          height: `${itemHeight}px`,
        }}
      />

      {/* 选项列表 */}
      <div
        ref={containerRef}
        className={styles.pickerList}
        style={{
          transform: `translate3d(0, ${scrollOffset + countAbove * itemHeight}px, 0)`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {options.length > 0 ? renderOptions() : (
          <div className={styles.pickerPlaceholder} style={{ height: `${itemHeight}px` }}>
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

MobilePicker.propTypes = {
  // 选项列表 [{ label: string, value: any, color?: string, fontSize?: string, customStyle?: object }]
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      value: PropTypes.any.isRequired,
      color: PropTypes.string,
      fontSize: PropTypes.string,
      customStyle: PropTypes.object,
    })
  ).isRequired,

  // 对称样式配置：以选中项为中心，上下对称位置具有相同样式
  symmetricStyles: PropTypes.arrayOf(
    PropTypes.shape({
      distance: PropTypes.number.isRequired, // 距离选中项的距离（0=选中项）
      color: PropTypes.string,
      fontSize: PropTypes.string,
      fontWeight: PropTypes.number,
      opacity: PropTypes.number,
      scale: PropTypes.number,
    })
  ),

  // 当前值（受控）
  value: PropTypes.any,

  // 默认值（非受控）
  defaultValue: PropTypes.any,

  // 值变化回调
  onChange: PropTypes.func,

  // 可见项数量（默认模式，上下对称）
  visibleCount: PropTypes.number,

  // 上方显示的项数
  visibleCountAbove: PropTypes.number,

  // 下方显示的项数
  visibleCountBelow: PropTypes.number,

  // 每项高度
  itemHeight: PropTypes.number,

  // 自定义类名
  className: PropTypes.string,

  // 自定义样式
  style: PropTypes.object,

  // 是否禁用
  disabled: PropTypes.bool,

  // 占位符
  placeholder: PropTypes.string,
};

MobilePicker.defaultProps = {
  symmetricStyles: null,
};

export default MobilePicker;

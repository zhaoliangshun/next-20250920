"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import styles from "./EnhancedSlider.module.css";

/**
 * 增强型滑块组件
 * 支持单值、范围、步长、标记、区间颜色等功能
 */
const EnhancedSlider = ({
  // 基础配置
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  range = false,

  // 标记配置
  marks = {},

  // 区间颜色配置
  ranges = [],

  // 事件回调
  onChange,
  onChangeComplete,

  // 样式配置
  disabled = false,
  tooltip = true,
  showMarks = true,
  showMarkLabels = true,
  
  // Tooltip 配置（新增，兼容 SegmentedSlider 方案）
  formatTooltip,
  tooltipVisible = 'drag',

  // 值显示配置
  showValueInHandle = false,
  
  // Handle 大小配置
  handleSize = 28,

  trackColor = "#1B3B8C",
  railColor = "#f5f5f5",
  handleColor = "#122C68",
  handleBorder,
  passedColor = "#E0E0E0",
  passedOverlay = false,

  // 分段背景色配置
  segmentedTrack = false,
  segmentedTrackColor,
  hideRailWhenDragging = false,

  // 其他配置
  className = "",
  style = {},
  id,

  // 无障碍配置
  ariaLabel,
  ariaValueText,

  ...props
}) => {
  // 解析range配置
  const rangeConfig = useMemo(() => {
    if (typeof range === "boolean") {
      return {
        enabled: range,
        editable: false,
        draggableTrack: false,
        minCount: 2,
        maxCount: 2,
      };
    }

    return {
      enabled: true,
      editable: range.editable || false,
      draggableTrack: range.draggableTrack || false,
      minCount: range.minCount || 2,
      maxCount: range.maxCount || 2,
    };
  }, [range]);

  // 状态管理
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null);
  const [hoverHandle, setHoverHandle] = useState(null);
  const [hoveredHandle, setHoveredHandle] = useState(null);

  // 计算当前值
  const [currentValue, setCurrentValue] = useState(() => {
    if (rangeConfig.enabled) {
      if (Array.isArray(value)) {
        return [...value].sort((a, b) => a - b);
      }
      if (Array.isArray(defaultValue)) {
        return [...defaultValue].sort((a, b) => a - b);
      }
      return [min, max];
    }

    const singleValue =
      value !== undefined
        ? value
        : defaultValue !== undefined
        ? defaultValue
        : min;
    return [typeof singleValue === "number" ? singleValue : min];
  });

  // 引用
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const moveHandlerRef = useRef(null);
  const upHandlerRef = useRef(null);

  // 更新外部受控值
  useEffect(() => {
    if (value !== undefined) {
      if (rangeConfig.enabled && Array.isArray(value)) {
        setCurrentValue([...value].sort((a, b) => a - b));
      } else if (!rangeConfig.enabled && typeof value === "number") {
        setCurrentValue([value]);
      }
    }
  }, [value, rangeConfig.enabled]);

  // 计算步长值
  const getStepValue = useCallback(
    (rawValue) => {
      if (step === null) {
        return Math.min(max, Math.max(min, rawValue));
      }

      const stepCount = Math.round((rawValue - min) / step);
      return Math.min(max, Math.max(min, min + stepCount * step));
    },
    [min, max, step]
  );

  // 计算百分比
  const getPercentage = useCallback(
    (val) => {
      return ((val - min) / (max - min)) * 100;
    },
    [min, max]
  );

  // 获取鼠标位置对应的值
  const getValueFromPosition = useCallback(
    (clientX, clientY) => {
      if (!sliderRef.current) return min;

      const rect = sliderRef.current.getBoundingClientRect();
      const position = clientX;
      const size = rect.width;
      const offset = rect.left;

      const percentage = Math.max(0, Math.min(1, (position - offset) / size));

      const rawValue = min + percentage * (max - min);
      return getStepValue(rawValue);
    },
    [min, max, getStepValue]
  );

  // 处理鼠标按下
  const handleMouseDown = useCallback(
    (e, handleIndex = null) => {
      if (disabled) return;

      e.preventDefault();
      setIsDragging(true);
      isDraggingRef.current = true;

      if (handleIndex !== null) {
        setActiveHandle(handleIndex);
      }

      // 获取触摸或鼠标位置
      const getEventPosition = (e) => {
        if ("touches" in e && e.touches[0]) {
          return {
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
          };
        }
        return {
          clientX: e.clientX,
          clientY: e.clientY,
        };
      };

      // 创建事件处理函数
      const moveHandler = (e) => {
        if (!isDraggingRef.current) return;

        e.preventDefault();
        const { clientX, clientY } = getEventPosition(e);
        const newValue = getValueFromPosition(clientX, clientY);

        // 更新值
        if (handleIndex !== null) {
          const newValues = [...currentValue];
          newValues[handleIndex] = newValue;

          // 确保范围值的顺序正确
          if (rangeConfig.enabled) {
            if (
              handleIndex > 0 &&
              newValues[handleIndex] < newValues[handleIndex - 1]
            ) {
              newValues[handleIndex] = newValues[handleIndex - 1];
            } else if (
              handleIndex < newValues.length - 1 &&
              newValues[handleIndex] > newValues[handleIndex + 1]
            ) {
              newValues[handleIndex] = newValues[handleIndex + 1];
            }
          }

          setCurrentValue(newValues);
          onChange?.(rangeConfig.enabled ? newValues : newValues[0]);
        }
      };

      const upHandler = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        setActiveHandle(null);

        // 移除事件监听器
        document.removeEventListener("mousemove", moveHandler);
        document.removeEventListener("mouseup", upHandler);
        document.removeEventListener("touchmove", moveHandler);
        document.removeEventListener("touchend", upHandler);

        // 触发 onChangeComplete
        onChangeComplete?.(
          rangeConfig.enabled ? currentValue : currentValue[0]
        );
      };

      // 保存引用以便清理
      moveHandlerRef.current = moveHandler;
      upHandlerRef.current = upHandler;

      // 添加全局事件监听
      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", upHandler);
      document.addEventListener("touchmove", moveHandler, { passive: false });
      document.addEventListener("touchend", upHandler);
    },
    [
      disabled,
      rangeConfig.enabled,
      currentValue,
      getValueFromPosition,
      onChange,
      onChangeComplete,
    ]
  );

  // 处理轨道点击
  const handleTrackClick = useCallback(
    (e) => {
      if (disabled || isDragging) return;

      const newValue = getValueFromPosition(e.clientX, e.clientY);

      if (rangeConfig.enabled) {
        // 找到最近的手柄
        let closestHandleIndex = 0;
        let minDistance = Math.abs(newValue - currentValue[0]);

        for (let i = 1; i < currentValue.length; i++) {
          const distance = Math.abs(newValue - currentValue[i]);
          if (distance < minDistance) {
            minDistance = distance;
            closestHandleIndex = i;
          }
        }

        const newValues = [...currentValue];
        newValues[closestHandleIndex] = newValue;

        // 确保范围值的顺序正确
        if (
          closestHandleIndex > 0 &&
          newValues[closestHandleIndex] < newValues[closestHandleIndex - 1]
        ) {
          newValues[closestHandleIndex] = newValues[closestHandleIndex - 1];
        } else if (
          closestHandleIndex < newValues.length - 1 &&
          newValues[closestHandleIndex] > newValues[closestHandleIndex + 1]
        ) {
          newValues[closestHandleIndex] = newValues[closestHandleIndex + 1];
        }

        setCurrentValue(newValues);
        onChange?.(newValues);
        onChangeComplete?.(newValues);
      } else {
        setCurrentValue([newValue]);
        onChange?.(newValue);
        onChangeComplete?.(newValue);
      }
    },
    [
      disabled,
      isDragging,
      rangeConfig.enabled,
      currentValue,
      getValueFromPosition,
      onChange,
      onChangeComplete,
    ]
  );

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e, handleIndex) => {
      if (disabled) return;

      const stepSize = e.shiftKey ? step * 10 : step;
      const newValues = [...currentValue];

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValues[handleIndex] = Math.max(
            min,
            newValues[handleIndex] - stepSize
          );
          break;
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValues[handleIndex] = Math.min(
            max,
            newValues[handleIndex] + stepSize
          );
          break;
        case "Home":
          e.preventDefault();
          newValues[handleIndex] = min;
          break;
        case "End":
          e.preventDefault();
          newValues[handleIndex] = max;
          break;
        default:
          return;
      }

      // 确保范围值的顺序正确
      if (rangeConfig.enabled) {
        if (
          handleIndex > 0 &&
          newValues[handleIndex] < newValues[handleIndex - 1]
        ) {
          newValues[handleIndex] = newValues[handleIndex - 1];
        } else if (
          handleIndex < newValues.length - 1 &&
          newValues[handleIndex] > newValues[handleIndex + 1]
        ) {
          newValues[handleIndex] = newValues[handleIndex + 1];
        }
      }

      setCurrentValue(newValues);
      onChange?.(rangeConfig.enabled ? newValues : newValues[0]);
      onChangeComplete?.(rangeConfig.enabled ? newValues : newValues[0]);
    },
    [
      disabled,
      currentValue,
      min,
      max,
      step,
      rangeConfig.enabled,
      onChange,
      onChangeComplete,
    ]
  );

  // 处理鼠标悬停
  const handleMouseEnter = useCallback((handleIndex) => {
    setHoverHandle(handleIndex);
    setHoveredHandle(handleIndex);
  }, []);

  const handleMouseLeave = useCallback((handleIndex) => {
    setHoverHandle(null);
    setHoveredHandle(null);
  }, []);

  // 清理事件监听器
  useEffect(() => {
    return () => {
      // 清理事件监听器
      if (moveHandlerRef.current) {
        document.removeEventListener("mousemove", moveHandlerRef.current);
        document.removeEventListener("touchmove", moveHandlerRef.current);
      }
      if (upHandlerRef.current) {
        document.removeEventListener("mouseup", upHandlerRef.current);
        document.removeEventListener("touchend", upHandlerRef.current);
      }
    };
  }, []);

  // 判断是否显示 tooltip（采用 SegmentedSlider 方案）
  const shouldShowTooltip = useCallback((handleIndex) => {
    if (!tooltip) return false;
    
    // 如果是旧的对象配置方式，处理 visible 属性
    if (typeof tooltip === 'object' && tooltip.visible !== undefined) {
      return tooltip.visible;
    }
    
    switch (tooltipVisible) {
      case 'always':
        return true;
      case 'hover':
        return hoveredHandle === handleIndex || activeHandle === handleIndex;
      case 'drag':
        return activeHandle === handleIndex;
      default:
        return activeHandle === handleIndex;
    }
  }, [tooltip, tooltipVisible, hoveredHandle, activeHandle]);

  // 计算 handle 样式配置
  const handleStyleConfig = useMemo(() => {
    if (typeof handleSize === 'number') {
      return {
        width: handleSize,
        height: handleSize,
      };
    }
    return {
      width: handleSize.width || 28,
      height: handleSize.height || 28,
    };
  }, [handleSize]);

  // 计算分段背景色渐变
  const segmentedTrackGradient = useMemo(() => {
    if (!segmentedTrack && !segmentedTrackColor) return null;

    // 优先使用 segmentedTrackColor（直接传递的颜色数组）
    if (segmentedTrackColor && segmentedTrackColor.length > 0) {
      const gradientStops = [];
      const segmentPercentage = 100 / segmentedTrackColor.length;

      for (let i = 0; i < segmentedTrackColor.length; i++) {
        const start = i * segmentPercentage;
        const end = (i + 1) * segmentPercentage;
        const color = segmentedTrackColor[i];

        // 添加两个相同的色标位置，形成硬边效果
        gradientStops.push(`${color} ${start}%`);
        gradientStops.push(`${color} ${end}%`);
      }

      return `linear-gradient(to right, ${gradientStops.join(", ")})`;
    }

    // 使用 segmentedTrack 配置（需要计算）
    if (!segmentedTrack) return null;

    // 解析分段配置
    const segmentConfig =
      typeof segmentedTrack === "boolean"
        ? { segments: 5, startColor: "#e6f7ff", endColor: "#1890ff" }
        : {
            segments: segmentedTrack.segments || 5,
            startColor: segmentedTrack.startColor || "#e6f7ff",
            endColor: segmentedTrack.endColor || "#1890ff",
            colors: segmentedTrack.colors,
            baseColor: segmentedTrack.baseColor,
            useOpacityGradient: segmentedTrack.useOpacityGradient || false,
          };

    // 生成分段颜色
    let segmentColors;

    // 优先使用透明度渐变模式
    if (segmentConfig.useOpacityGradient && segmentConfig.baseColor) {
      segmentColors = Array(segmentConfig.segments)
        .fill(0)
        .map((_, index) => {
          // 透明度从 1/segments 到 1 等分（避免从0开始）
          const opacity = (index + 1) / segmentConfig.segments;

          // 解析基础颜色
          const baseColor = segmentConfig.baseColor;
          let r, g, b;

          // 支持 # 开头的十六进制颜色
          if (baseColor.startsWith("#")) {
            r = parseInt(baseColor.slice(1, 3), 16);
            g = parseInt(baseColor.slice(3, 5), 16);
            b = parseInt(baseColor.slice(5, 7), 16);
          }
          // 支持 rgb() 格式
          else if (baseColor.startsWith("rgb")) {
            const matches = baseColor.match(/\d+/g);
            if (matches && matches.length >= 3) {
              r = parseInt(matches[0]);
              g = parseInt(matches[1]);
              b = parseInt(matches[2]);
            } else {
              // 默认颜色
              r = g = b = 0;
            }
          } else {
            // 默认颜色
            r = g = b = 0;
          }

          return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
        });
    }
    // 使用自定义颜色数组或颜色渐变
    else {
      segmentColors =
        segmentConfig.colors ||
        Array(segmentConfig.segments)
          .fill(0)
          .map((_, index) => {
            const ratio = index / (segmentConfig.segments - 1);

            // 解析颜色
            const startRGB = {
              r: parseInt(segmentConfig.startColor.slice(1, 3), 16),
              g: parseInt(segmentConfig.startColor.slice(3, 5), 16),
              b: parseInt(segmentConfig.startColor.slice(5, 7), 16),
            };

            const endRGB = {
              r: parseInt(segmentConfig.endColor.slice(1, 3), 16),
              g: parseInt(segmentConfig.endColor.slice(3, 5), 16),
              b: parseInt(segmentConfig.endColor.slice(5, 7), 16),
            };

            // 计算渐变色
            const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * ratio);
            const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * ratio);
            const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * ratio);

            return `#${r.toString(16).padStart(2, "0")}${g
              .toString(16)
              .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          });
    }

    // 生成渐变色标
    const gradientStops = [];
    const segmentPercentage = 100 / segmentConfig.segments;

    for (let i = 0; i < segmentConfig.segments; i++) {
      const start = i * segmentPercentage;
      const end = (i + 1) * segmentPercentage;
      const color = segmentColors[i];

      // 添加两个相同的色标位置，形成硬边效果
      gradientStops.push(`${color} ${start}%`);
      gradientStops.push(`${color} ${end}%`);
    }

    return `linear-gradient(to right, ${gradientStops.join(", ")})`;
  }, [segmentedTrack, segmentedTrackColor]);

  // 计算轨道样式
  const trackStyle = useMemo(() => {
    if (rangeConfig.enabled && currentValue.length >= 2) {
      const startPercent = getPercentage(currentValue[0]);
      const endPercent = getPercentage(currentValue[currentValue.length - 1]);

      // 计算区间颜色
      let backgroundColor = trackColor;
      if (ranges.length > 0) {
        const rangeIndex = ranges.findIndex(
          (r) =>
            currentValue[0] >= r.start &&
            currentValue[currentValue.length - 1] <= r.end
        );
        if (rangeIndex !== -1) {
          backgroundColor = ranges[rangeIndex].color;
        }
      }

      return {
        left: `${startPercent}%`,
        width: `${endPercent - startPercent}%`,
        backgroundColor,
      };
    } else {
      const percent = getPercentage(currentValue[0]);

      // 计算区间颜色
      let backgroundColor = trackColor;
      if (ranges.length > 0) {
        const rangeIndex = ranges.findIndex(
          (r) => currentValue[0] >= r.start && currentValue[0] <= r.end
        );
        if (rangeIndex !== -1) {
          backgroundColor = ranges[rangeIndex].color;
        }
      }

      return {
        width: `${percent}%`,
        backgroundColor,
      };
    }
  }, [rangeConfig.enabled, currentValue, getPercentage, trackColor, ranges]);

  // 计算轨道背景样式
  const railStyle = useMemo(() => {
    return {
      backgroundColor: railColor,
      backgroundImage:
        segmentedTrack || segmentedTrackColor
          ? segmentedTrackGradient
          : undefined,
      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",
    };
  }, [railColor, segmentedTrack, segmentedTrackColor, segmentedTrackGradient]);

  // 计算分段模式下的已过遮罩样式
  const passedMasks = useMemo(() => {
    if (!passedOverlay) return null;
    if (!(segmentedTrack || segmentedTrackColor)) return null;

    if (rangeConfig.enabled && currentValue.length >= 2) {
      const startPercent = getPercentage(currentValue[0]);
      const endPercent = getPercentage(currentValue[currentValue.length - 1]);

      return (
        <>
          <div
            className={styles.passedMask}
            style={{ left: 0, width: `${startPercent}%`, backgroundColor: passedColor }}
          />
          <div
            className={styles.passedMask}
            style={{ left: `${endPercent}%`, width: `${100 - endPercent}%`, backgroundColor: passedColor }}
          />
        </>
      );
    } else {
      const percent = getPercentage(currentValue[0]);
      return (
        <div
          className={styles.passedMask}
          style={{ left: 0, width: `${percent}%`, backgroundColor: passedColor }}
        />
      );
    }
  }, [passedOverlay, segmentedTrack, segmentedTrackColor, rangeConfig.enabled, currentValue, getPercentage, passedColor]);

  // 渲染标记
  const renderMarks = () => {
    if (!showMarks || Object.keys(marks).length === 0) return null;

    return Object.entries(marks).map(([markValue, markLabel]) => {
      const percent = getPercentage(Number(markValue));
      const isActive = rangeConfig.enabled
        ? currentValue[0] <= Number(markValue) &&
          Number(markValue) <= currentValue[currentValue.length - 1]
        : currentValue[0] >= Number(markValue);

      // 处理标记标签
      let label;
      let markStyle = {};
      let showLabel = true; // 默认显示 label

      if (
        markLabel &&
        typeof markLabel === "object" &&
        !React.isValidElement(markLabel) &&
        "label" in markLabel
      ) {
        label = markLabel.label;
        markStyle = markLabel.style || {};
        showLabel = markLabel.showLabel !== undefined ? markLabel.showLabel : true;
      } else {
        label = markLabel;
      }

      // 全局开关优先级最高，如果 showMarkLabels 为 false，则不显示任何 label
      const shouldShowLabel = showMarkLabels && showLabel;

      return (
        <div
          key={markValue}
          className={`${styles.mark}`}
          style={{
            left: `${percent}%`,
            transform: "translateX(-50%)",
            ...markStyle,
          }}
        >
          {shouldShowLabel && <span className={styles.markLabel}>{label}</span>}
        </div>
      );
    });
  };

  // 渲染拖拽手柄
  const renderHandles = () => {
    return currentValue.map((val, index) => {
      const percent = getPercentage(val);
      const isActive = activeHandle === index;
      const isHover = hoverHandle === index;

      // 计算值显示配置
      let valueDisplayConfig = { enabled: false, formatter: undefined, style: {} };

      // 处理 showValueInHandle 配置，支持布尔值和对象两种形式
      if (typeof showValueInHandle === "boolean") {
        valueDisplayConfig = {
          enabled: showValueInHandle,
          formatter: undefined,
          style: {},
        };
      } else if (showValueInHandle) {
        valueDisplayConfig = {
          enabled: true,
          formatter: showValueInHandle.formatter,
          style: showValueInHandle.style || {},
        };
      }

      // 计算手柄样式
      const handleStyleObj = {
        left: `${percent}%`,
        backgroundColor: handleColor,
        width: `${handleStyleConfig.width}px`,
        height: `${handleStyleConfig.height}px`,
        border: handleBorder,
      };

      // 计算工具提示内容（支持 formatTooltip）
      let tooltipContent = val;
      if (formatTooltip) {
        tooltipContent = formatTooltip(val);
      } else if (tooltip && typeof tooltip === 'object' && tooltip.formatter) {
        tooltipContent = tooltip.formatter(val);
      }

      // 计算工具提示位置
      let tooltipPlacement = "top";
      if (tooltip && typeof tooltip === 'object' && tooltip.placement) {
        tooltipPlacement = tooltip.placement;
      }

      // 计算工具提示可见性（使用新的 shouldShowTooltip）
      const isTooltipVisible = shouldShowTooltip(index) && !valueDisplayConfig.enabled;

      // 判断 tooltip 的对齐方式（采用 SegmentedSlider 方案）
      let tooltipAlignClass = '';
      if (percent <= 10) {
        tooltipAlignClass = styles.tooltipLeftAlign;
      } else if (percent >= 90) {
        tooltipAlignClass = styles.tooltipRightAlign;
      }

      // 计算handle中显示的值
      let handleValueContent = val;
      if (valueDisplayConfig.enabled && valueDisplayConfig.formatter) {
        handleValueContent = valueDisplayConfig.formatter(val);
      }

      return (
        <div
          key={index}
          className={`${styles.handle} ${isActive ? styles.handleActive : ""} ${
            isHover ? styles.handleHover : ""
          } ${disabled ? styles.handleDisabled : ""} ${
            valueDisplayConfig.enabled ? styles.handleWithValue : ""
          }`}
          style={handleStyleObj}
          onMouseDown={(e) => handleMouseDown(e, index)}
          onTouchStart={(e) => handleMouseDown(e, index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          aria-disabled={disabled}
          aria-label={Array.isArray(ariaLabel) ? ariaLabel[index] : ariaLabel}
          aria-valuetext={
            Array.isArray(ariaValueText) ? ariaValueText[index] : ariaValueText
          }
        >
          {valueDisplayConfig.enabled && (
            <span
              className={styles.handleValue}
              style={valueDisplayConfig.style}
            >
              {handleValueContent}
            </span>
          )}

          {tooltip && !valueDisplayConfig.enabled && isTooltipVisible && (
            <div className={`${styles.tooltipNew} ${tooltipAlignClass} ${activeHandle === index ? styles.tooltipActive : ''}`}>
              <div className={styles.tooltipContent}>
                {tooltipContent}
              </div>
              <div className={styles.tooltipArrow} />
            </div>
          )}
        </div>
      );
    });
  };

  // 计算滑块类名
  const sliderClassName = useMemo(() => {
    return `${styles.slider} ${disabled ? styles.sliderDisabled : ""} ${
      isDragging ? styles.sliderDragging : ""
    } ${className}`;
  }, [disabled, isDragging, className]);

  return (
    <div
      ref={sliderRef}
      className={sliderClassName}
      style={style}
      id={id}
      {...props}
    >
      <div ref={trackRef} className={styles.track} onClick={handleTrackClick}>
        <div className={styles.rail} style={railStyle} />
        {!segmentedTrack && !segmentedTrackColor && (
          <div className={styles.trackFill} style={trackStyle} />
        )}
        {(segmentedTrack || segmentedTrackColor) && passedMasks}
      </div>

      {renderMarks()}
      {renderHandles()}
    </div>
  );
};

// PropTypes 定义
EnhancedSlider.propTypes = {
  // 基础配置
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  range: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      editable: PropTypes.bool,
      draggableTrack: PropTypes.bool,
      minCount: PropTypes.number,
      maxCount: PropTypes.number,
    }),
  ]),

  // 标记配置
  marks: PropTypes.object,

  // 区间颜色配置
  ranges: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),

  // 分段背景色配置
  segmentedTrack: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      segments: PropTypes.number,
      colors: PropTypes.arrayOf(PropTypes.string),
      startColor: PropTypes.string,
      endColor: PropTypes.string,
      baseColor: PropTypes.string,
      useOpacityGradient: PropTypes.bool,
    }),
  ]),

  segmentedTrackColor: PropTypes.arrayOf(PropTypes.string),
  hideRailWhenDragging: PropTypes.bool,

  // 事件回调
  onChange: PropTypes.func,
  onChangeComplete: PropTypes.func,

  // 样式配置
  disabled: PropTypes.bool,
  tooltip: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      formatter: PropTypes.func,
      placement: PropTypes.oneOf(["top", "bottom"]),
      visible: PropTypes.bool,
    }),
  ]),
  showMarks: PropTypes.bool,
  showMarkLabels: PropTypes.bool,
  
  // Tooltip 配置（新增）
  formatTooltip: PropTypes.func,
  tooltipVisible: PropTypes.oneOf(['always', 'hover', 'drag']),

  // 值显示配置
  showValueInHandle: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      formatter: PropTypes.func,
      style: PropTypes.object,
    }),
  ]),
  
  // Handle 大小配置
  handleSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
  ]),

  // 颜色配置
  trackColor: PropTypes.string,
  railColor: PropTypes.string,
  handleColor: PropTypes.string,
  passedColor: PropTypes.string,
  passedOverlay: PropTypes.bool,

  // 其他配置
  className: PropTypes.string,
  style: PropTypes.object,
  id: PropTypes.string,

  // 无障碍配置
  ariaLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  ariaValueText: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

export default EnhancedSlider;

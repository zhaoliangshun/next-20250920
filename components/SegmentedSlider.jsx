"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import styles from "./SegmentedSlider.module.css";

/**
 * 分段式滑块组件（仅支持区间选择）
 * 支持独立的颜色区间和值区间配置
 * 支持两个拖动点来选择一个区间
 */
const SegmentedSlider = ({
  // 颜色区间配置：每个区间包含 start, end, color（用于背景显示）
  colorSegments = [],
  // 值区间配置：每个区间包含 start, end（用于定义可选择的值）
  valueSegments = [],
  // 默认值（区间）
  defaultValue = [0, 100],
  // 受控值（区间）
  value,
  // 值变化回调
  onChange,
  // 是否禁用
  disabled = false,
  // 自定义类名
  className = "",
  // 自定义样式
  style = {},
  // 是否显示 tooltip
  showTooltip = true,
  // 自定义 tooltip 格式化函数
  formatTooltip = (value) => value,
  // tooltip 显示策略：'always' | 'hover' | 'drag'
  tooltipVisible = "drag",
  // 自定义 handle 大小：数字（单位 px）或对象 { width, height }
  handleSize = 24,
  // 已滑过区域遮罩（用于分段背景色模式）
  passedOverlay = false,
  passedColor = "#E0E0E0",
  ...props
}) => {
  // 状态管理
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null);
  const [hoveredHandle, setHoveredHandle] = useState(null);

  // 引用
  const sliderRef = useRef(null);
  const isDraggingRef = useRef(false);


  // 计算最小值和最大值
  const min = useMemo(() => {
    if (valueSegments.length === 0) return 0;
    return Math.min(...valueSegments.map((seg) => seg.start));
  }, [valueSegments]);

  const max = useMemo(() => {
    if (valueSegments.length === 0) return 100;
    return Math.max(...valueSegments.map((seg) => seg.end));
  }, [valueSegments]);

  // 计算当前值（始终为区间）
  const [currentValue, setCurrentValue] = useState(() => {
    // 检查默认值是否为有效区间
    if (Array.isArray(defaultValue) && defaultValue.length >= 2) {
      const [startVal, endVal] = defaultValue;
      const isValidStart = valueSegments.some(
        (seg) => startVal === seg.start || startVal === seg.end
      );
      const isValidEnd = valueSegments.some(
        (seg) => endVal === seg.start || endVal === seg.end
      );

      if (isValidStart && isValidEnd && startVal <= endVal) {
        return [startVal, endVal];
      }
    }

    // 如果默认值无效，使用第一个区间的起点和最后一个区间的终点
    if (valueSegments.length > 0) {
      return [valueSegments[0].start, valueSegments[valueSegments.length - 1].end];
    }
    return [0, 100];
  });

  // 计算百分比
  const getPercentage = useCallback(
    (val) => {
      if (max === min) return 0;
      return ((val - min) / (max - min)) * 100;
    },
    [min, max]
  );

  // 获取鼠标位置对应的值
  const getValueFromPosition = useCallback(
    (clientX) => {
      if (!sliderRef.current) return min;

      const rect = sliderRef.current.getBoundingClientRect();
      const position = clientX;
      const size = rect.width;
      const offset = rect.left;

      const percentage = Math.max(0, Math.min(1, (position - offset) / size));
      const rawValue = min + percentage * (max - min);

      // 找到最近的有效位置（区间的起点或终点）
      let closestValue = currentValue[0];
      let minDistance = Infinity;

      valueSegments.forEach((segment) => {
        // 检查起点
        const startDistance = Math.abs(rawValue - segment.start);
        if (startDistance < minDistance) {
          minDistance = startDistance;
          closestValue = segment.start;
        }

        // 检查终点
        const endDistance = Math.abs(rawValue - segment.end);
        if (endDistance < minDistance) {
          minDistance = endDistance;
          closestValue = segment.end;
        }
      });

      return closestValue;
    },
    [min, max, valueSegments, currentValue]
  );

  // 处理鼠标按下
  const handleMouseDown = useCallback(
    (e, handleIndex = 0) => {
      if (disabled) return;

      e.preventDefault();
      setIsDragging(true);
      isDraggingRef.current = true;
      setActiveHandle(handleIndex);

      // 获取事件位置
      const getEventPosition = (e) => {
        if ("touches" in e && e.touches[0]) {
          return { clientX: e.touches[0].clientX };
        }
        return { clientX: e.clientX };
      };

      // 移动处理函数
      const moveHandler = (e) => {
        if (!isDraggingRef.current) return;

        e.preventDefault();
        const { clientX } = getEventPosition(e);
        const newValue = getValueFromPosition(clientX);

        // if (handleIndex === 0 && newValue >= currentValue[1]) {
        //   return false;
        // }

        // if (handleIndex === 1 && newValue <= currentValue[0]) {
        //   return false;
        // }

        const newValues = [...currentValue];
        newValues[handleIndex] = newValue;

        // 确保区间值的顺序正确
        if (handleIndex === 0 && newValues[0] > newValues[1]) {
            newValues[0] = newValues[1];
        } else if (handleIndex === 1 && newValues[1] < newValues[0]) {
            newValues[1] = newValues[0];
        }

        // 只有当值发生变化时才更新
        // if (newValues[0] !== currentValue[0] || newValues[1] !== currentValue[1]) {
        setCurrentValue(newValues);
        onChange?.(newValues);
        // }
      };

      // 释放处理函数
      const upHandler = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        setActiveHandle(null);

        // 移除事件监听器
        document.removeEventListener("mousemove", moveHandler);
        document.removeEventListener("mouseup", upHandler);
        document.removeEventListener("touchmove", moveHandler);
        document.removeEventListener("touchend", upHandler);
      };

      // 添加全局事件监听
      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", upHandler);
      document.addEventListener("touchmove", moveHandler, { passive: false });
      document.addEventListener("touchend", upHandler);
    },
    [disabled, currentValue, getValueFromPosition, onChange]
  );

  // 处理轨道点击
  const handleTrackClick = useCallback(
    (e) => {
      if (disabled || isDragging) return;

      const newValue = getValueFromPosition(e.clientX);

      // 在区间模式下，找到最近的手柄
      const distanceToStart = Math.abs(newValue - currentValue[0]);
      const distanceToEnd = Math.abs(newValue - currentValue[1]);

      if (distanceToStart <= distanceToEnd) {
        const newValues = [newValue, currentValue[1]];
        setCurrentValue(newValues);
        onChange?.(newValues);
      } else {
        const newValues = [currentValue[0], newValue];
        setCurrentValue(newValues);
        onChange?.(newValues);
      }
    },
    [disabled, isDragging, currentValue, getValueFromPosition, onChange]
  );

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e, handleIndex = 0) => {
      if (disabled) return;

      let newValue;
      let foundNewValue = false;

      const currentValueToUse = currentValue[handleIndex];

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          // 找到前一个有效位置
          for (let i = valueSegments.length - 1; i >= 0; i--) {
            const segment = valueSegments[i];
            if (currentValueToUse === segment.end) {
              newValue = segment.start;
              foundNewValue = true;
              break;
            } else if (currentValueToUse === segment.start && i > 0) {
              newValue = valueSegments[i - 1].end;
              foundNewValue = true;
              break;
            }
          }
          break;
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          // 找到后一个有效位置
          for (let i = 0; i < valueSegments.length; i++) {
            const segment = valueSegments[i];
            if (currentValueToUse === segment.start) {
              newValue = segment.end;
              foundNewValue = true;
              break;
            } else if (
              currentValueToUse === segment.end &&
              i < valueSegments.length - 1
            ) {
              newValue = valueSegments[i + 1].start;
              foundNewValue = true;
              break;
            }
          }
          break;
        case "Home":
          e.preventDefault();
          newValue = valueSegments.length > 0 ? valueSegments[0].start : min;
          foundNewValue = true;
          break;
        case "End":
          e.preventDefault();
          newValue =
            valueSegments.length > 0 ? valueSegments[valueSegments.length - 1].end : max;
          foundNewValue = true;
          break;
      }

      if (foundNewValue) {
        const newValues = [...currentValue];
        newValues[handleIndex] = newValue;

        // 确保区间值的顺序正确
        if (handleIndex === 0 && newValues[0] > newValues[1]) {
          newValues[0] = newValues[1];
        } else if (handleIndex === 1 && newValues[1] < newValues[0]) {
          newValues[1] = newValues[0];
        }

        // 只有当值发生变化时才更新
        if (
          newValues[0] !== currentValue[0] ||
          newValues[1] !== currentValue[1]
        ) {
          setCurrentValue(newValues);
          onChange?.(newValues);
        }
      }
    },
    [disabled, currentValue, valueSegments, min, max, onChange]
  );

  // 计算手柄位置
  const handlePositions = useMemo(() => {
    return currentValue.map((val) => getPercentage(val));
  }, [currentValue, getPercentage]);

  // 渲染区间 - 使用 colorSegments 来显示背景颜色
  const renderSegments = () => {
    if (colorSegments.length === 0) return null;

    // 计算 colorSegments 的范围
    const colorMin = Math.min(...colorSegments.map((seg) => seg.start));
    const colorMax = Math.max(...colorSegments.map((seg) => seg.end));

    return colorSegments.map((segment, index) => {
      // 计算该颜色区间在整个范围内的百分比位置
      const startPercent =
        ((segment.start - colorMin) / (colorMax - colorMin)) * 100;
      const endPercent =
        ((segment.end - colorMin) / (colorMax - colorMin)) * 100;
      const widthPercent = endPercent - startPercent;

      return (
        <div
          key={index}
          className={`${styles.segment}`}
          style={{
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
            backgroundColor: segment.color,
          }}
        />
      );
    });
  };

  // 渲染区间标记点 - 根据 colorSegments 生成，每个颜色区间显示起点和终点，但排除头和尾
  const renderSegmentPoints = () => {
    if (colorSegments.length === 0) return null;

    const points = [];
    const renderedPoints = new Set();

    // 计算 colorSegments 的范围
    const colorMin = Math.min(...colorSegments.map((seg) => seg.start));
    const colorMax = Math.max(...colorSegments.map((seg) => seg.end));

    // 收集所有需要显示的 mark 值（排除头和尾）
    const markValues = new Set();
    colorSegments.forEach((segment) => {
      // 添加起点（如果不是整体的头）
      if (segment.start !== colorMin) {
        markValues.add(segment.start);
      }
      // 添加终点（如果不是整体的尾）
      if (segment.end !== colorMax) {
        markValues.add(segment.end);
      }
    });

    // 将 Set 转换为数组并排序
    const sortedMarkValues = Array.from(markValues).sort((a, b) => a - b);

    // 渲染每个 mark
    sortedMarkValues.forEach((markValue) => {
      // 计算该 mark 在滑块上的百分比位置
      const position = ((markValue - colorMin) / (colorMax - colorMin)) * 100;
      points.push(
        <div
          key={`point-${markValue}`}
          className={`${styles.point}`}
          style={{
            left: `${position}%`,
          }}
        />
      );
    });

    return points;
  };

  // 计算分段模式下的已过遮罩样式
  const passedMasks = useMemo(() => {
    if (!passedOverlay) return null;
    if (colorSegments.length === 0) return null;

    // 计算 colorSegments 的范围
    const colorMin = Math.min(...colorSegments.map((seg) => seg.start));
    const colorMax = Math.max(...colorSegments.map((seg) => seg.end));
    if (currentValue.length !== 2) return null;

    // 计算选中范围的百分比位置
    const startPercent =
      ((currentValue[0] - colorMin) / (colorMax - colorMin)) * 100;
    const endPercent =
      ((currentValue[1] - colorMin) / (colorMax - colorMin)) * 100;

    return (
      <>
        <div
          className={styles.passedMask}
          style={{
            left: 0,
            width: `${startPercent}%`,
            backgroundColor: passedColor,
          }}
        />
        <div
          className={styles.passedMask}
          style={{
            left: `${endPercent}%`,
            width: `${100 - endPercent}%`,
            backgroundColor: passedColor,
          }}
        />
      </>
    );
  }, [passedOverlay, colorSegments, currentValue, passedColor]);

  // 渲染选中区间

  // 判断是否显示 tooltip
  const shouldShowTooltip = useCallback(
    (handleIndex) => {
      if (!showTooltip) return false;

      switch (tooltipVisible) {
        case "always":
          return true;
        case "hover":
          return hoveredHandle === handleIndex || activeHandle === handleIndex;
        case "drag":
          return activeHandle === handleIndex;
        default:
          return activeHandle === handleIndex;
      }
    },
    [showTooltip, tooltipVisible, hoveredHandle, activeHandle]
  );

  // 计算 handle 样式
  const handleStyleConfig = useMemo(() => {
    if (typeof handleSize === "number") {
      return {
        width: handleSize,
        height: handleSize,
      };
    }
    return {
      width: handleSize.width || 24,
      height: handleSize.height || 24,
    };
  }, [handleSize]);

  // 渲染拖动点
  const renderHandles = () => {
    return handlePositions.map((position, index) => {
      const showCurrentTooltip = shouldShowTooltip(index);

      // 判断 tooltip 的对齐方式
      // 左端：位置 <= 10%，右端：位置 >= 90%
      let tooltipAlignClass = "";
      if (position <= 10) {
        tooltipAlignClass = styles.tooltipLeft;
      } else if (position >= 90) {
        tooltipAlignClass = styles.tooltipRight;
      }

      return (
        <div
          key={index}
          className={`${styles.handleWrapper}`}
          style={{
            left: `${position}%`,
          }}
        >
          <div
            className={`${styles.handle} ${
              activeHandle === index ? styles.handleActive : ""
            } ${disabled ? styles.handleDisabled : ""}`}
            style={{
              width: `${handleStyleConfig.width}px`,
              height: `${handleStyleConfig.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, index)}
            onTouchStart={(e) => handleMouseDown(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onMouseEnter={() => setHoveredHandle(index)}
            onMouseLeave={() => setHoveredHandle(null)}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue[index]}
            aria-disabled={disabled}
            aria-label={index === 0 ? "最小值" : "最大值"}
          />
          {showCurrentTooltip && (
            <div
              className={`${styles.tooltip} ${tooltipAlignClass} ${
                index === 0 ? styles.tooltip0 : ""
              } ${activeHandle === index ? styles.tooltipActive : ""}`}
            >
              <div className={styles.tooltipContent}>
                {formatTooltip(currentValue[index])}
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
    } ${styles.sliderRange} ${className}`;
  }, [disabled, isDragging, className]);

  return (
    <div ref={sliderRef} className={sliderClassName} style={style} {...props}>
      <div className={styles.track} onClick={handleTrackClick}>
        <div className={styles.rail} />
        {renderSegments()}
        {passedMasks}
        {renderSegmentPoints()}
      </div>
      {renderHandles()}
    </div>
  );
};

export default SegmentedSlider;

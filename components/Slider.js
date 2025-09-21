'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Slider.module.css';

const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 0,
  value,
  onChange,
  disabled = false,
  marks = null,
  tooltipVisible = true,
  tooltipPlacement = 'top',
  range = false,
  className = '',
  style = {},
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(0);
  const [hoverValue, setHoverValue] = useState(null);
  const sliderRef = useRef(null);
  const thumbRefs = useRef([]);

  // 计算当前值
  const currentValue = value !== undefined ? value : defaultValue;
  const currentValues = Array.isArray(currentValue) ? currentValue : [currentValue];

  // 计算百分比
  const getPercentage = useCallback((val) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  // 根据位置计算值 - 优化性能
  const getValueFromPosition = useCallback((clientX) => {
    if (!sliderRef.current) return min;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percentage * (max - min);
    
    // 根据 step 调整值
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step]);

  // 处理鼠标按下 - 优化范围选择
  const handleMouseDown = useCallback((e, index = 0) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDraggingIndex(index);
    
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const newValue = getValueFromPosition(clientX);
    if (onChange) {
      if (range) {
        const newValues = [...currentValues];
        newValues[index] = newValue;
        onChange(newValues);
      } else {
        onChange(newValue);
      }
    }
  }, [disabled, getValueFromPosition, onChange, range, currentValues]);

  // 处理触摸开始
  const handleTouchStart = useCallback((e, index = 0) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDraggingIndex(index);
    
    const clientX = e.touches[0]?.clientX;
    const newValue = getValueFromPosition(clientX);
    if (onChange) {
      if (range) {
        const newValues = [...currentValues];
        newValues[index] = newValue;
        onChange(newValues);
      } else {
        onChange(newValue);
      }
    }
  }, [disabled, getValueFromPosition, onChange, range, currentValues]);

  // 处理轨道点击 - 范围选择优化
  const handleTrackClick = useCallback((e) => {
    if (disabled || isDragging) return;
    
    const newValue = getValueFromPosition(e.clientX);
    
    if (range && currentValues.length === 2) {
      const [start, end] = currentValues.sort((a, b) => a - b);
      const midPoint = (start + end) / 2;
      
      // 根据点击位置决定移动哪个滑块
      const targetIndex = newValue < midPoint ? 
        (currentValues[0] < currentValues[1] ? 0 : 1) : 
        (currentValues[0] < currentValues[1] ? 1 : 0);
      
      const newValues = [...currentValues];
      newValues[targetIndex] = newValue;
      onChange(newValues);
    } else {
      onChange(newValue);
    }
  }, [disabled, isDragging, getValueFromPosition, onChange, range, currentValues]);

  // 处理鼠标移动 - 性能优化，实时更新
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || disabled) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const newValue = getValueFromPosition(clientX);
    
    // 立即更新，不等待状态更新
    if (onChange) {
      if (range) {
        const newValues = [...currentValues];
        newValues[draggingIndex] = newValue;
        onChange(newValues);
      } else {
        onChange(newValue);
      }
    }
  }, [isDragging, disabled, draggingIndex, getValueFromPosition, onChange, range, currentValues]);

  // 处理鼠标释放
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggingIndex(0);
  }, []);

  // 处理悬停
  const handleMouseEnter = useCallback((e) => {
    if (disabled) return;
    const hoverVal = getValueFromPosition(e.clientX);
    setHoverValue(hoverVal);
  }, [disabled, getValueFromPosition]);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
  }, []);

  // 处理键盘事件
  const handleKeyDown = useCallback((e, index = 0) => {
    if (disabled) return;
    
    let newValue = currentValues[index];
    const stepAmount = e.shiftKey ? step * 10 : step;
    
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.max(min, newValue - stepAmount);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(max, newValue + stepAmount);
        break;
      case 'Home':
        e.preventDefault();
        newValue = min;
        break;
      case 'End':
        e.preventDefault();
        newValue = max;
        break;
      default:
        return;
    }
    
    if (onChange) {
      if (range) {
        const newValues = [...currentValues];
        newValues[index] = newValue;
        onChange(newValues);
      } else {
        onChange(newValue);
      }
    }
  }, [disabled, currentValues, step, min, max, onChange, range]);

  // 添加全局事件监听器 - 性能优化，直接处理事件
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => {
        handleMouseMove(e);
      };
      
      const handleGlobalTouchMove = (e) => {
        e.preventDefault();
        handleMouseMove(e);
      };
      
      const handleGlobalMouseUp = () => {
        handleMouseUp();
      };
      
      const handleGlobalTouchEnd = () => {
        handleMouseUp();
      };
      
      // 使用 capture 模式获得更好的性能
      document.addEventListener('mousemove', handleGlobalMouseMove, { 
        passive: false, 
        capture: true 
      });
      document.addEventListener('mouseup', handleGlobalMouseUp, { capture: true });
      document.addEventListener('touchmove', handleGlobalTouchMove, { 
        passive: false, 
        capture: true 
      });
      document.addEventListener('touchend', handleGlobalTouchEnd, { capture: true });
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove, { capture: true });
        document.removeEventListener('mouseup', handleGlobalMouseUp, { capture: true });
        document.removeEventListener('touchmove', handleGlobalTouchMove, { capture: true });
        document.removeEventListener('touchend', handleGlobalTouchEnd, { capture: true });
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 渲染标记
  const renderMarks = () => {
    if (!marks) return null;
    
    return Object.entries(marks).map(([key, mark]) => {
      const value = parseFloat(key);
      const percentage = getPercentage(value);
      const isActive = range 
        ? value >= Math.min(...currentValues) && value <= Math.max(...currentValues)
        : value <= currentValues[0];
      
      return (
        <div
          key={key}
          className={`${styles.mark} ${isActive ? styles.markActive : ''}`}
          style={{ left: `${percentage}%` }}
        >
          <span className={styles.markValue}>{value}</span>
          {typeof mark === 'object' && mark.label && (
            <span className={styles.markLabel}>{mark.label}</span>
          )}
        </div>
      );
    });
  };

  // 渲染工具提示
  const renderTooltip = (value, index) => {
    if (!tooltipVisible || disabled) return null;
    
    const percentage = getPercentage(value);
    const isHovering = hoverValue !== null;
    const displayValue = isHovering ? hoverValue : value;
    
    return (
      <div
        className={`${styles.tooltip} ${styles[tooltipPlacement]} ${
          isHovering || isDragging ? styles.tooltipVisible : ''
        }`}
        style={{ left: `${percentage}%` }}
      >
        <div className={styles.tooltipContent}>
          {displayValue}
        </div>
      </div>
    );
  };

  // 渲染滑块
  const renderThumb = (value, index) => {
    const percentage = getPercentage(value);
    const isDraggingThis = isDragging && draggingIndex === index;
    
    return (
      <div
        key={index}
        ref={(el) => {
          if (el) thumbRefs.current[index] = el;
        }}
        className={`${styles.thumb} ${disabled ? styles.thumbDisabled : ''} ${
          isDraggingThis ? styles.thumbActive : ''
        }`}
        style={{ 
          left: `${percentage}%`,
          zIndex: isDraggingThis ? 3 : (range ? (index === 0 ? 1 : 2) : 2)
        }}
        onMouseDown={(e) => handleMouseDown(e, index)}
        onTouchStart={(e) => handleTouchStart(e, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
      >
        {renderTooltip(value, index)}
      </div>
    );
  };

  // 渲染轨道 - 优化性能，实时更新
  const renderTrack = () => {
    if (range && currentValues.length === 2) {
      const [start, end] = currentValues.sort((a, b) => a - b);
      const startPercentage = getPercentage(start);
      const endPercentage = getPercentage(end);
      
      return (
        <div
          className={styles.track}
          style={{
            left: `${startPercentage}%`,
            width: `${endPercentage - startPercentage}%`,
            willChange: isDragging ? 'left, width' : 'auto'
          }}
        />
      );
    } else {
      const percentage = getPercentage(currentValues[0]);
      return (
        <div
          className={styles.track}
          style={{ 
            width: `${percentage}%`,
            willChange: isDragging ? 'width' : 'auto'
          }}
        />
      );
    }
  };

  return (
    <div
      className={`${styles.slider} ${disabled ? styles.sliderDisabled : ''} ${className}`}
      style={style}
      data-range={range}
      data-dragging={isDragging}
      {...props}
    >
      <div
        ref={sliderRef}
        className={styles.sliderRail}
        onMouseDown={handleTrackClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.sliderTrack} />
        {renderTrack()}
        {renderMarks()}
        {currentValues.map((value, index) => renderThumb(value, index))}
      </div>
    </div>
  );
};

export default Slider;

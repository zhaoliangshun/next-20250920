'use client';

import { useState, useRef, useCallback, useEffect, useMemo, useLayoutEffect } from 'react';
import styles from './Slider.module.css';

/**
 * 高性能 Slider 组件
 * 支持单值、范围、步长、标记、区间颜色等功能
 */
const Slider = ({
  // 基础配置
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  defaultValue = 0,
  range = false,
  rangeValue = [0, 100],
  defaultRangeValue = [0, 100],
  
  // 标记配置
  marks = {},
  
  // 区间颜色配置
  ranges = [],
  
  // 事件回调
  onChange,
  onAfterChange,
  
  // 样式配置
  disabled = false,
  vertical = false,
  tooltip = true,
  showMarks = true,
  
  // 其他配置
  className = '',
  style = {},
  ...props
}) => {
  // 状态管理
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null);
  const [dragStartValue, setDragStartValue] = useState(null);
  const [dragStartRangeValue, setDragStartRangeValue] = useState(null);
  
  // 引用
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const moveHandlerRef = useRef(null);
  const upHandlerRef = useRef(null);
  const pendingValueRef = useRef(null);
  
  // 计算当前值
  const currentValue = useMemo(() => {
    if (range) {
      return rangeValue || defaultRangeValue;
    }
    return value !== undefined ? value : defaultValue;
  }, [range, rangeValue, defaultRangeValue, value, defaultValue]);
  
  // 计算步长值 - 使用 useMemo 缓存计算结果
  const getStepValue = useCallback((rawValue) => {
    const stepCount = Math.round((rawValue - min) / step);
    return Math.min(max, Math.max(min, min + stepCount * step));
  }, [min, max, step]);
  
  // 计算百分比 - 使用 useMemo 缓存计算结果
  const getPercentage = useCallback((val) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);
  
  // 防抖函数 - 延迟执行
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }, []);
  
  // 计算轨道样式 - 优化性能
  const trackStyle = useMemo(() => {
    if (range) {
      const [start, end] = currentValue;
      const startPercent = getPercentage(start);
      const endPercent = getPercentage(end);
      
      // 计算区间颜色
      let backgroundColor = '#1890ff';
      if (ranges.length > 0) {
        const rangeIndex = ranges.findIndex(r => 
          start >= r.start && end <= r.end
        );
        if (rangeIndex !== -1) {
          backgroundColor = ranges[rangeIndex].color;
        }
      }
      
      return {
        left: `${startPercent}%`,
        width: `${endPercent - startPercent}%`,
        backgroundColor
      };
    } else {
      const percent = getPercentage(currentValue);
      
      // 计算区间颜色
      let backgroundColor = '#1890ff';
      if (ranges.length > 0) {
        const rangeIndex = ranges.findIndex(r => 
          currentValue >= r.start && currentValue <= r.end
        );
        if (rangeIndex !== -1) {
          backgroundColor = ranges[rangeIndex].color;
        }
      }
      
      return {
        width: `${percent}%`,
        backgroundColor
      };
    }
  }, [range, currentValue, getPercentage, ranges]);
  
  // 获取鼠标位置对应的值 - 优化性能
  const getValueFromPosition = useCallback((clientX, clientY) => {
    if (!sliderRef.current) return min;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const position = vertical ? clientY : clientX;
    const size = vertical ? rect.height : rect.width;
    const offset = vertical ? rect.top : rect.left;
    
    const percentage = Math.max(0, Math.min(1, (position - offset) / size));
    const rawValue = min + percentage * (max - min);
    
    return getStepValue(rawValue);
  }, [min, max, getStepValue, vertical]);
  
  // 处理鼠标移动 - 已移除，使用内联事件处理函数
  // 处理鼠标释放 - 已移除，使用内联事件处理函数
  
  // 处理鼠标按下
  const handleMouseDown = useCallback((e, handleIndex = null) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    
    if (range) {
      setActiveHandle(handleIndex);
      setDragStartRangeValue([...currentValue]);
    } else {
      setDragStartValue(currentValue);
    }
    
    // 获取触摸或鼠标位置
    const getEventPosition = (e) => {
      if (e.touches && e.touches[0]) {
        return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
      }
      return { clientX: e.clientX, clientY: e.clientY };
    };
    
    // 直接更新值，不使用节流
    const updateValue = (newValue) => {
      if (range && handleIndex !== null) {
        const newRangeValue = [...currentValue];
        newRangeValue[handleIndex] = newValue;
        
        // 确保范围值的顺序正确
        if (handleIndex === 0 && newRangeValue[0] > newRangeValue[1]) {
          newRangeValue[0] = newRangeValue[1];
        } else if (handleIndex === 1 && newRangeValue[1] < newRangeValue[0]) {
          newRangeValue[1] = newRangeValue[0];
        }
        
        onChange?.(newRangeValue);
      } else if (!range) {
        onChange?.(newValue);
      }
    };
    
    // 创建事件处理函数
    const moveHandler = (e) => {
      if (!isDraggingRef.current) return;
      
      e.preventDefault();
      const { clientX, clientY } = getEventPosition(e);
      const newValue = getValueFromPosition(clientX, clientY);
      
      // 直接更新，不使用 requestAnimationFrame
      updateValue(newValue);
    };
    
    // 创建防抖的 onAfterChange 处理函数
    const debouncedOnAfterChange = debounce(() => {
      onAfterChange?.(currentValue);
    }, 50);
    
    const upHandler = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      setActiveHandle(null);
      setDragStartValue(null);
      setDragStartRangeValue(null);
      
      // 移除事件监听器
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', upHandler);
      
      // 触发 onAfterChange
      debouncedOnAfterChange();
    };
    
    // 保存引用以便清理
    moveHandlerRef.current = moveHandler;
    upHandlerRef.current = upHandler;
    
    // 添加全局事件监听
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', upHandler);
  }, [disabled, range, currentValue, getValueFromPosition, onChange, onAfterChange]);
  
  // 处理轨道点击
  const handleTrackClick = useCallback((e) => {
    if (disabled || isDragging) return;
    
    const newValue = getValueFromPosition(e.clientX, e.clientY);
    
    if (range) {
      const [start, end] = currentValue;
      const distanceToStart = Math.abs(newValue - start);
      const distanceToEnd = Math.abs(newValue - end);
      
      const newRangeValue = [...currentValue];
      if (distanceToStart < distanceToEnd) {
        newRangeValue[0] = newValue;
        if (newRangeValue[0] > newRangeValue[1]) {
          newRangeValue[0] = newRangeValue[1];
        }
      } else {
        newRangeValue[1] = newValue;
        if (newRangeValue[1] < newRangeValue[0]) {
          newRangeValue[1] = newRangeValue[0];
        }
      }
      
      onChange?.(newRangeValue);
    } else {
      onChange?.(newValue);
    }
  }, [disabled, isDragging, range, currentValue, getValueFromPosition, onChange]);
  
  // 处理键盘事件
  const handleKeyDown = useCallback((e, handleIndex = null) => {
    if (disabled) return;
    
    const stepSize = e.shiftKey ? step * 10 : step;
    let newValue;
    
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        if (range && handleIndex !== null) {
          const newRangeValue = [...currentValue];
          newRangeValue[handleIndex] = Math.max(min, newRangeValue[handleIndex] - stepSize);
          onChange?.(newRangeValue);
        } else if (!range) {
          newValue = Math.max(min, currentValue - stepSize);
          onChange?.(newValue);
        }
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        if (range && handleIndex !== null) {
          const newRangeValue = [...currentValue];
          newRangeValue[handleIndex] = Math.min(max, newRangeValue[handleIndex] + stepSize);
          onChange?.(newRangeValue);
        } else if (!range) {
          newValue = Math.min(max, currentValue + stepSize);
          onChange?.(newValue);
        }
        break;
      case 'Home':
        e.preventDefault();
        if (range && handleIndex !== null) {
          const newRangeValue = [...currentValue];
          newRangeValue[handleIndex] = min;
          onChange?.(newRangeValue);
        } else if (!range) {
          onChange?.(min);
        }
        break;
      case 'End':
        e.preventDefault();
        if (range && handleIndex !== null) {
          const newRangeValue = [...currentValue];
          newRangeValue[handleIndex] = max;
          onChange?.(newRangeValue);
        } else if (!range) {
          onChange?.(max);
        }
        break;
    }
  }, [disabled, range, currentValue, min, max, step, onChange]);
  
  // 清理事件监听器
  useEffect(() => {
    return () => {
      // 清理动画帧
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // 清理事件监听器
      if (moveHandlerRef.current) {
        document.removeEventListener('mousemove', moveHandlerRef.current);
        document.removeEventListener('touchmove', moveHandlerRef.current);
      }
      if (upHandlerRef.current) {
        document.removeEventListener('mouseup', upHandlerRef.current);
        document.removeEventListener('touchend', upHandlerRef.current);
      }
    };
  }, []);
  
  // 渲染标记
  const renderMarks = () => {
    if (!showMarks || Object.keys(marks).length === 0) return null;
    
    return Object.entries(marks).map(([markValue, markLabel]) => {
      const percent = getPercentage(Number(markValue));
      const isActive = range 
        ? currentValue[0] <= Number(markValue) && Number(markValue) <= currentValue[1]
        : currentValue >= Number(markValue);
      
      return (
        <div
          key={markValue}
          className={`${styles.mark} ${isActive ? styles.markActive : ''}`}
          style={{
            [vertical ? 'bottom' : 'left']: `${percent}%`,
            transform: vertical ? 'translateY(50%)' : 'translateX(-50%)'
          }}
        >
          <span className={styles.markLabel}>{markLabel}</span>
        </div>
      );
    });
  };
  
  // 渲染拖拽手柄
  const renderHandles = () => {
    if (range) {
      return currentValue.map((val, index) => {
        const percent = getPercentage(val);
        const isActive = activeHandle === index;
        
        return (
          <div
            key={index}
            className={`${styles.handle} ${isActive ? styles.handleActive : ''} ${disabled ? styles.handleDisabled : ''}`}
            style={{
              [vertical ? 'bottom' : 'left']: `${percent}%`,
              transform: vertical ? 'translateY(50%)' : 'translateX(-50%)'
            }}
            onMouseDown={(e) => handleMouseDown(e, index)}
            onTouchStart={(e) => handleMouseDown(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={val}
            aria-disabled={disabled}
          >
            {tooltip && (
              <div className={`${styles.tooltip} ${isActive ? styles.tooltipVisible : ''}`}>
                {val}
              </div>
            )}
          </div>
        );
      });
    } else {
      const percent = getPercentage(currentValue);
      
      return (
        <div
          className={`${styles.handle} ${isDragging ? styles.handleActive : ''} ${disabled ? styles.handleDisabled : ''}`}
          style={{
            [vertical ? 'bottom' : 'left']: `${percent}%`,
            transform: vertical ? 'translateY(50%)' : 'translateX(-50%)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-disabled={disabled}
        >
          {tooltip && (
            <div className={`${styles.tooltip} ${isDragging ? styles.tooltipVisible : ''}`}>
              {currentValue}
            </div>
          )}
        </div>
      );
    }
  };
  
  return (
    <div
      ref={sliderRef}
      className={`${styles.slider} ${vertical ? styles.sliderVertical : ''} ${disabled ? styles.sliderDisabled : ''} ${isDragging ? styles.sliderDragging : ''} ${className}`}
      style={style}
      {...props}
    >
      <div
        ref={trackRef}
        className={styles.track}
        onClick={handleTrackClick}
      >
        <div className={styles.trackBackground} />
        <div
          className={styles.trackActive}
          style={trackStyle}
        />
      </div>
      
      {renderMarks()}
      {renderHandles()}
    </div>
  );
};

export default Slider;

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
  itemHeight = 44,
  className = "",
  style = {},
  disabled = false,
  placeholder = "请选择",
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

  // 计算容器高度
  const containerHeight = visibleCount * itemHeight;
  
  // 计算中心位置（选中项的位置）
  const centerIndex = Math.floor(visibleCount / 2);

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
    
    // 计算透明度：距离中心越远，透明度越低
    let opacity = 1;
    if (distance > 0) {
      opacity = Math.max(0.2, 1 - distance * 0.3);
    }

    // 计算缩放：选中项稍大
    const scale = distance === 0 ? 1 : Math.max(0.85, 1 - distance * 0.08);

    // 计算字体粗细
    const fontWeight = distance < 0.5 ? 600 : 400;

    return {
      opacity,
      transform: `scale(${scale})`,
      fontWeight,
      color: distance < 0.5 ? "#000" : "#666",
    };
  };

  // 渲染选项列表
  const renderOptions = () => {
    return options.map((option, index) => {
      const itemStyle = getItemStyle(index);
      const isSelected = index === selectedIndex && !isDragging;

      return (
        <div
          key={option.value}
          className={`${styles.pickerItem} ${isSelected ? styles.pickerItemSelected : ""}`}
          style={{
            height: `${itemHeight}px`,
            lineHeight: `${itemHeight}px`,
            ...itemStyle,
          }}
          onClick={() => !disabled && scrollToIndex(index)}
        >
          {option.label}
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
          top: `${centerIndex * itemHeight}px`,
          height: `${itemHeight}px`,
        }}
      />

      {/* 遮罩层 - 上 */}
      <div className={styles.pickerMaskTop} style={{ height: `${centerIndex * itemHeight}px` }} />
      
      {/* 遮罩层 - 下 */}
      <div
        className={styles.pickerMaskBottom}
        style={{
          height: `${(visibleCount - centerIndex - 1) * itemHeight}px`,
          bottom: 0,
        }}
      />

      {/* 选项列表 */}
      <div
        ref={containerRef}
        className={styles.pickerList}
        style={{
          transform: `translate3d(0, ${scrollOffset + centerIndex * itemHeight}px, 0)`,
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
  // 选项列表 [{ label: string, value: any }]
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  
  // 当前值（受控）
  value: PropTypes.any,
  
  // 默认值（非受控）
  defaultValue: PropTypes.any,
  
  // 值变化回调
  onChange: PropTypes.func,
  
  // 可见项数量（必须是奇数）
  visibleCount: PropTypes.number,
  
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

export default MobilePicker;

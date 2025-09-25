'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './AnimatedRadioGroup.module.css';

const AnimatedRadioGroup = ({ 
  options = [], 
  value, 
  onChange, 
  name = 'radio-group',
  className = '',
  variant = 'pill' // 'pill', 'button', 'underline'
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const containerRef = useRef(null);
  const buttonRefs = useRef([]);

  // 初始化选中的索引
  useEffect(() => {
    if (value !== undefined) {
      const index = options.findIndex(option => option.value === value);
      if (index !== -1) {
        setSelectedIndex(index);
      }
    }
  }, [value, options]);

  // 更新指示器位置
  useEffect(() => {
    updateIndicatorPosition();
  }, [selectedIndex, options]);

  const updateIndicatorPosition = () => {
    if (buttonRefs.current[selectedIndex] && containerRef.current) {
      const selectedButton = buttonRefs.current[selectedIndex];
      const container = containerRef.current;
      
      const buttonRect = selectedButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const left = buttonRect.left - containerRect.left;
      const width = buttonRect.width;
      const height = buttonRect.height;
      
      setIndicatorStyle({
        transform: `translateX(${left}px)`,
        width: `${width}px`,
        height: variant === 'underline' ? '2px' : `${height}px`,
        top: variant === 'underline' ? 'auto' : '0',
        bottom: variant === 'underline' ? '0' : 'auto'
      });
    }
  };

  const handleOptionClick = (option, index) => {
    setSelectedIndex(index);
    if (onChange) {
      onChange(option.value);
    }
  };

  // 监听窗口大小变化，重新计算指示器位置
  useEffect(() => {
    const handleResize = () => {
      setTimeout(updateIndicatorPosition, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedIndex]);

  if (!options.length) return null;

  return (
    <div className={styles.radioGroupContainer}>
      <div 
        ref={containerRef}
        className={`${styles.radioGroup} ${styles[variant]} ${className}`}
      >
        {/* 移动的指示器 */}
        <div 
          className={styles.indicator}
          style={indicatorStyle}
        />
        
        {/* 选项按钮 */}
        {options.map((option, index) => (
          <button
            key={option.value}
            ref={el => buttonRefs.current[index] = el}
            type="button"
            className={`${styles.option} ${selectedIndex === index ? styles.selected : ''}`}
            onClick={() => handleOptionClick(option, index)}
            aria-pressed={selectedIndex === index}
            role="radio"
            aria-checked={selectedIndex === index}
          >
            {option.label}
          </button>
        ))}
        
        {/* 隐藏的真实 radio 输入，用于表单提交 */}
        {options.map((option, index) => (
          <input
            key={`input-${option.value}`}
            type="radio"
            name={name}
            value={option.value}
            checked={selectedIndex === index}
            onChange={() => {}}
            style={{ display: 'none' }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedRadioGroup;
"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './KeyboardSafeAreaView.module.css';

/**
 * 增强版键盘安全区域视图组件
 * 专门解决iOS Safari中虚拟键盘覆盖固定底部元素的问题
 * 
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @param {string} props.className - 额外的CSS类名
 * @param {number} props.offset - 额外的偏移量（像素）
 * @param {boolean} props.animate - 是否启用动画效果
 * @param {boolean} props.debug - 是否启用调试模式
 * @param {boolean} props.useVisualViewport - 是否使用visualViewport API（推荐）
 * @param {Function} props.onKeyboardChange - 键盘状态变化时的回调函数
 */
const EnhancedKeyboardSafeAreaView = ({ 
  children, 
  className = '', 
  offset = 0,
  animate = true,
  debug = false,
  useVisualViewport = true,
  onKeyboardChange,
  ...props
}) => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const containerRef = useRef(null);
  const originalBottomRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const visualViewport = window.visualViewport;
    let resizeObserver = null;

    const updateKeyboardPosition = () => {
      let currentKeyboardOffset = 0;
      let keyboardVisible = false;

      if (useVisualViewport && visualViewport) {
        // 使用 visualViewport API（最准确的方法）
        const layoutViewportHeight = window.innerHeight;
        const visualViewportHeight = visualViewport.height;
        currentKeyboardOffset = layoutViewportHeight - visualViewportHeight;
        keyboardVisible = currentKeyboardOffset > 50;
        
        if (debug) {
          console.log('=== VisualViewport 方法 ===');
          console.log('布局视口高度:', layoutViewportHeight);
          console.log('可视视口高度:', visualViewportHeight);
          console.log('键盘偏移量:', currentKeyboardOffset);
        }
      } else {
        // 备用方法：监听窗口大小变化
        const windowHeight = window.innerHeight;
        const screenHeight = window.screen.height;
        const orientation = window.orientation;
        
        // 计算键盘高度（简化版）
        currentKeyboardOffset = Math.max(0, screenHeight - windowHeight - 100);
        keyboardVisible = currentKeyboardOffset > 100;
        
        if (debug) {
          console.log('=== 备用方法 ===');
          console.log('窗口高度:', windowHeight);
          console.log('屏幕高度:', screenHeight);
          console.log('键盘偏移量:', currentKeyboardOffset);
        }
      }

      // 保存原始bottom值（首次加载时）
      if (originalBottomRef.current === 0 && currentKeyboardOffset === 0) {
        const computedStyle = getComputedStyle(document.documentElement);
        const safeAreaBottom = parseFloat(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0;
        originalBottomRef.current = safeAreaBottom;
      }

      setKeyboardOffset(currentKeyboardOffset);
      setIsKeyboardVisible(keyboardVisible);

      // 触发回调
      if (onKeyboardChange) {
        onKeyboardChange({
          isVisible: keyboardVisible,
          offset: currentKeyboardOffset,
          height: currentKeyboardOffset
        });
      }

      if (debug) {
        console.log('键盘是否可见:', keyboardVisible);
        console.log('最终偏移量:', currentKeyboardOffset + offset);
      }
    };

    // 初始检测
    updateKeyboardPosition();

    // 设置监听器
    if (useVisualViewport && visualViewport) {
      visualViewport.addEventListener('resize', updateKeyboardPosition);
      visualViewport.addEventListener('scroll', updateKeyboardPosition);
    }

    // 监听窗口变化（备用方案）
    window.addEventListener('resize', updateKeyboardPosition);
    window.addEventListener('orientationchange', updateKeyboardPosition);

    // 监听焦点事件
    const handleFocus = () => {
      setTimeout(updateKeyboardPosition, 100);
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', updateKeyboardPosition);

    // 监听DOM变化（可选）
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateKeyboardPosition);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
    }

    return () => {
      if (useVisualViewport && visualViewport) {
        visualViewport.removeEventListener('resize', updateKeyboardPosition);
        visualViewport.removeEventListener('scroll', updateKeyboardPosition);
      }
      window.removeEventListener('resize', updateKeyboardPosition);
      window.removeEventListener('orientationchange', updateKeyboardPosition);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', updateKeyboardPosition);
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [useVisualViewport, offset, debug, onKeyboardChange]);

  const containerStyle = {
    bottom: `calc(${keyboardOffset + offset}px + env(safe-area-inset-bottom, 0px))`,
    transition: animate ? 'bottom 0.2s ease-out' : 'none'
  };

  return (
    <div 
      ref={containerRef}
      className={`${styles.keyboardSafeContainer} ${className}`}
      style={containerStyle}
      data-keyboard-visible={isKeyboardVisible}
      data-keyboard-offset={keyboardOffset}
      {...props}
    >
      {children}
      {debug && (
        <div className={styles.debugInfo}>
          键盘偏移: {keyboardOffset}px | 状态: {isKeyboardVisible ? '显示' : '隐藏'}
        </div>
      )}
    </div>
  );
};

export default EnhancedKeyboardSafeAreaView;
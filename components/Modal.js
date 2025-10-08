'use client';

import { useState, useEffect } from 'react';
import styles from './Modal.module.css';

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title = "标题",
  showCloseButton = true,
  size = "medium", // small, medium, large
  showBackdrop = true,
  closeOnBackdropClick = true
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 防止背景滚动和键盘支持
  useEffect(() => {
    if (isOpen) {
      // 保存当前滚动位置
      const scrollY = window.scrollY;
      // 计算滚动条宽度，避免隐藏滚动条导致布局抖动
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      // 记录内联样式以便恢复
      const previousPaddingRightInline = document.body.style.paddingRight;
      // 使用计算样式，确保兼容 body 原有 padding 的情况
      const computedPaddingRight = parseFloat(window.getComputedStyle(document.body).paddingRight || '0') || 0;
      // 创建一个右侧补位元素，视觉上替代滚动条区域，避免背景色差异
      let scrollbarSpacer = null;
      
      // 禁止滚动
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        // 在原有 padding 基础上叠加滚动条宽度
        document.body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;

        // 插入补位元素，使右侧区域颜色与滚动条/轨道尽可能一致
        scrollbarSpacer = document.createElement('div');
        scrollbarSpacer.setAttribute('data-modal-scrollbar-spacer', '');
        const spacerStyle = scrollbarSpacer.style;
        spacerStyle.position = 'fixed';
        spacerStyle.top = '0';
        spacerStyle.right = '0';
        spacerStyle.width = `${scrollbarWidth}px`;
        spacerStyle.height = '100vh';
        spacerStyle.pointerEvents = 'none';
        spacerStyle.zIndex = '999';
        // 优先读取 Firefox 的 scrollbar-color（格式：thumb track）作为轨道色
        const scrollbarColor = window.getComputedStyle(document.body).getPropertyValue('scrollbar-color');
        let trackColor = '';
        if (scrollbarColor) {
          const parts = scrollbarColor.trim().split(/\s+/);
          if (parts.length > 1) trackColor = parts[1];
        }
        // 如果定义了自定义变量 --scrollbar-bg 则使用
        if (!trackColor) {
          const cssVar = window.getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-bg').trim();
          if (cssVar) trackColor = cssVar;
        }
        // 兜底使用页面背景色，通常与滚动条轨道接近
        if (!trackColor) {
          trackColor = '#ffffff' || window.getComputedStyle(document.body).backgroundColor || 'transparent';
        }
        spacerStyle.backgroundColor = trackColor;
        document.body.appendChild(scrollbarSpacer);
      }
      
      // 显示弹出层
      setIsVisible(true);
      
      // 小延迟确保 DOM 更新后再开始动画
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);

      // 键盘事件处理
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        // 恢复滚动
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        // 恢复原有内联 padding-right
        document.body.style.paddingRight = previousPaddingRightInline;
        // 移除补位元素
        const existSpacer = document.querySelector('[data-modal-scrollbar-spacer]');
        if (existSpacer && existSpacer.parentNode) {
          existSpacer.parentNode.removeChild(existSpacer);
        }
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: "instant",
        });
        
        // 移除键盘事件监听
        document.removeEventListener('keydown', handleKeyDown);
        setTimeout(() => {
          setIsVisible(false);
        }, 300);
      };
    } else {
      setIsAnimating(false);
      // 等待动画完成后再隐藏元素
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  // 阻止事件冒泡，防止点击内容区域时关闭弹出层
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`${styles.backdrop} ${isAnimating ? styles.backdropVisible : ''} ${!showBackdrop ? styles.noBackdrop : ''}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`${styles.modal} ${styles[`modal${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${isAnimating ? styles.modalOpen : styles.modalClosed}`}
        onClick={handleContentClick}
      >
        {/* 头部 */}
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {showCloseButton && (
            <button 
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="关闭"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* 内容区域 */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

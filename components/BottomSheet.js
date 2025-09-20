'use client';

import { useState, useEffect } from 'react';
import styles from './BottomSheet.module.css';

export default function BottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  title = "标题",
  showCloseButton = true 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 防止背景滚动和键盘支持
  useEffect(() => {
    if (isOpen) {
      // 保存当前滚动位置
      const scrollY = window.scrollY;
      
      // 禁止滚动
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
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
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: "instant",
        });
        
        // 移除键盘事件监听
        document.removeEventListener('keydown', handleKeyDown);
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
    if (e.target === e.currentTarget) {
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
      className={`${styles.backdrop} ${isAnimating ? styles.backdropVisible : ''}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`${styles.bottomSheet} ${isAnimating ? styles.bottomSheetOpen : styles.bottomSheetClosed}`}
        onClick={handleContentClick}
      >
        {/* 拖拽指示器 */}
        <div className={styles.dragIndicator}></div>
        
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

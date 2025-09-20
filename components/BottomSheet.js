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

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // 小延迟确保 DOM 更新后再开始动画
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      // 等待动画完成后再隐藏元素
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
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

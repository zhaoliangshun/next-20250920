"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Message.module.css";

const MessageItem = ({ message, onClose, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const timerRef = useRef(null);
  const itemRef = useRef(null);

  useEffect(() => {
    // 进入动画 - 使用 requestAnimationFrame 确保更平滑的动画
    // 为不同位置的消息添加不同的延迟，避免同时出现造成抖动
    const enterTimer = requestAnimationFrame(() => {
      setTimeout(() => {
        setIsVisible(true);
      }, 50 + index * 50); // 根据索引添加延迟
    });

    // 自动关闭
    if (message.duration !== 0) {
      timerRef.current = setTimeout(() => {
        handleClose();
      }, message.duration || 3000);
    }

    return () => {
      cancelAnimationFrame(enterTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [index]);

  const handleClose = () => {
    if (isLeaving) return; // 防止重复触发
    
    setIsLeaving(true);
    
    // 获取当前元素的高度，用于平滑的高度过渡
    if (itemRef.current) {
      const height = itemRef.current.offsetHeight;
      itemRef.current.style.height = height + 'px';
      itemRef.current.style.marginBottom = '8px';
      
      // 强制重排，然后开始动画
      itemRef.current.offsetHeight;
      
      // 开始退出动画
      itemRef.current.style.height = '0px';
      itemRef.current.style.marginBottom = '0px';
      itemRef.current.style.paddingTop = '0px';
      itemRef.current.style.paddingBottom = '0px';
    }
    
    // 延迟移除，确保动画完成
    setTimeout(() => {
      setShouldRender(false);
      setTimeout(() => {
        onClose(message.id);
      }, 50);
    }, 400);
  };

  // 如果不应该渲染，返回 null
  if (!shouldRender) {
    return null;
  }

  const getIcon = () => {
    switch (message.type) {
      case "success":
        return (
          <svg className={styles.icon} viewBox="0 0 1024 1024">
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
              fill="currentColor"
            />
          </svg>
        );
      case "error":
        return (
          <svg className={styles.icon} viewBox="0 0 1024 1024">
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.5-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.5 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
              fill="currentColor"
            />
          </svg>
        );
      case "warning":
        return (
          <svg className={styles.icon} viewBox="0 0 1024 1024">
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"
              fill="currentColor"
            />
          </svg>
        );
      case "info":
      default:
        return (
          <svg className={styles.icon} viewBox="0 0 1024 1024">
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"
              fill="currentColor"
            />
          </svg>
        );
    }
  };

  return (
    <div
      ref={itemRef}
      className={`${styles.messageItem} ${styles[message.type]} ${
        isVisible ? styles.visible : ""
      } ${isLeaving ? styles.leaving : ""}`}
    >
      <div className={styles.iconWrapper}>{getIcon()}</div>
      <div className={styles.content}>
        <div className={styles.text}>{message.content}</div>
      </div>
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="关闭"
      >
        <svg viewBox="0 0 1024 1024" width="12" height="12">
          <path
            d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

const MessageContainer = ({ messages, onClose }) => {
  return (
    <div className={styles.messageContainer}>
      {messages.map((message, index) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          onClose={onClose}
          index={index}
        />
      ))}
    </div>
  );
};

export default MessageContainer;

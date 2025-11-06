"use client";

import React, { useState, useEffect } from 'react';
import styles from './IOSKeyboardFixDemo.module.css';

const IOSKeyboardFixDemo = () => {
  const [viewportBottom, setViewportBottom] = useState(0);

  useEffect(() => {
    const visualViewport = window.visualViewport;

    if (!visualViewport) {
      // 如果浏览器不支持 visualViewport API，则不执行任何操作
      return;
    }

    const handleResize = () => {
      // layout viewport的高度 (整个页面的高度)
      const layoutViewportHeight = window.innerHeight;
      // visual viewport的高度 (可见区域的高度)
      const visualViewportHeight = visualViewport.height;

      // 当键盘弹出时, visualViewportHeight会变小
      // 计算出键盘遮挡的高度
      const keyboardOffset = layoutViewportHeight - visualViewportHeight;

      // 将底部元素的 bottom 值设置为键盘的高度
      // 同时考虑安全区域
      setViewportBottom(keyboardOffset);
    };

    visualViewport.addEventListener('resize', handleResize);

    // 组件卸载时移除监听器
    return () => {
      visualViewport.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>iOS 键盘问题解决方案</h1>
        <p>在下方输入框中输入内容，观察在iOS Safari中弹出键盘时的效果。</p>
        <p>这个页面包含了很多内容，以便您可以滚动。</p>
        {Array.from({ length: 30 }).map((_, i) => (
          <p key={i}>这是滚动内容 #{i + 1}</p>
        ))}
      </div>

      <div 
        className={styles.fixedBottomBar}
        style={{
          // 动态调整 bottom 值
          // env(safe-area-inset-bottom) 是为了处理iPhone的底部安全区域（小黑条）
          bottom: `calc(${viewportBottom}px + env(safe-area-inset-bottom, 0px))`
        }}
      >
        <input 
          type="text" 
          placeholder="点击这里输入..." 
          className={styles.inputField}
        />
        <button className={styles.sendButton}>发送</button>
      </div>
    </div>
  );
};

export default IOSKeyboardFixDemo;
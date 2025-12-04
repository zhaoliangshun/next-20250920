"use client";

import { useState, useEffect, useRef } from "react";
import BottomSheet from "../../components/BottomSheet";
import styles from "./page.module.css";

export default function KeyboardSafeDemo() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inputRef = useRef(null);
  const bottomBarRef = useRef(null);

  // useEffect(() => {
  //   // 检测键盘弹出
  //   const handleResize = () => {
  //     const currentHeight = window.visualViewport?.height || window.innerHeight;
  //     const fullHeight = window.innerHeight;
  //     const heightDiff = fullHeight - currentHeight;

  //     setViewportHeight(currentHeight);
  //     setKeyboardHeight(heightDiff);
  //     setIsKeyboardVisible(heightDiff > 150); // 如果高度差超过150px，认为键盘弹出

  //     // 方案3: 使用 CSS 变量
  //     document.documentElement.style.setProperty(
  //       "--keyboard-height",
  //       heightDiff > 150 ? `${heightDiff}px` : "0px"
  //     );
  //   };

  //   // 使用 visualViewport API（推荐，iOS Safari 支持）
  //   if (window.visualViewport) {
  //     window.visualViewport.addEventListener("resize", handleResize);
  //   } else {
  //     window.addEventListener("resize", handleResize);
  //   }

  //   // 初始值
  //   handleResize();

  //   return () => {
  //     if (window.visualViewport) {
  //       window.visualViewport.removeEventListener("resize", handleResize);
  //     } else {
  //       window.removeEventListener("resize", handleResize);
  //     }
  //   };
  // }, []);

  // 当输入框获得焦点时，滚动到底部
  const handleInputFocus = () => {
    // setTimeout(() => {
    //   if (inputRef.current) {
    //     inputRef.current.scrollIntoView({ behavior: "instant", block: "end" });
    //   }
    // }, 300);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>iOS Safari 键盘遮挡问题解决方案</h1>
        <div className={styles.status}>
          <div className={styles.statusItem}>
            <span className={styles.label}>键盘状态:</span>
            <span
              className={isKeyboardVisible ? styles.active : styles.inactive}
            >
              {isKeyboardVisible ? "已弹出" : "已收起"}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>键盘高度:</span>
            <span>{keyboardHeight}px</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>视口高度:</span>
            <span>{viewportHeight}px</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2>问题描述</h2>
          <p>
            在 iOS 18 iPhone Safari 浏览器中，当使用 fixed 定位的底部元素时，
            如果设置了 <code>env(safe-area-inset-bottom, 0)</code>，
            当数字键盘弹出时，键盘会覆盖底部内容。
          </p>
        </section>

        <section className={styles.section}>
          <h2>解决方案 1: 使用 visualViewport API（推荐）</h2>
          <p>
            使用 <code>window.visualViewport</code> API 检测键盘弹出状态，
            动态调整底部元素的位置。
          </p>
          <div className={styles.codeBlock}>
            <pre>{`useEffect(() => {
  const handleResize = () => {
    const currentHeight = window.visualViewport?.height || window.innerHeight;
    const fullHeight = window.innerHeight;
    const heightDiff = fullHeight - currentHeight;
    setIsKeyboardVisible(heightDiff > 150);
  };

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleResize);
  }
  
  return () => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', handleResize);
    }
  };
}, []);`}</pre>
          </div>
        </section>

        <section className={styles.section}>
          <h2>解决方案 2: CSS 动态调整</h2>
          <p>
            根据键盘状态，动态设置底部元素的 <code>bottom</code> 值。
          </p>
          <div className={styles.codeBlock}>
            <pre>{`.bottomBar {
  position: fixed;
  bottom: env(safe-area-inset-bottom, 0);
  /* 当键盘弹出时，增加 bottom 值 */
  bottom: calc(env(safe-area-inset-bottom, 0) + var(--keyboard-height, 0));
}

/* 或者使用 JavaScript 动态设置 */
bottom: \${isKeyboardVisible ? keyboardHeight + 'px' : 'env(safe-area-inset-bottom, 0)'}`}</pre>
          </div>
        </section>

        <section className={styles.section}>
          <h2>解决方案 3: 使用 CSS 变量</h2>
          <p>通过 JavaScript 设置 CSS 变量，CSS 中使用该变量。</p>
          <div className={styles.codeBlock}>
            <pre>{`// JavaScript
document.documentElement.style.setProperty(
  '--keyboard-height', 
  isKeyboardVisible ? keyboardHeight + 'px' : '0px'
);

// CSS
.bottomBar {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom, 0) + var(--keyboard-height, 0));
}`}</pre>
          </div>
        </section>

        <section className={styles.section}>
          <h2>解决方案 4: 使用 position: sticky</h2>
          <p>
            对于某些场景，可以使用 <code>position: sticky</code> 替代{" "}
            <code>position: fixed</code>。
          </p>
          <div className={styles.codeBlock}>
            <pre>{`.bottomBar {
  position: sticky;
  bottom: 0;
  margin-top: auto;
}`}</pre>
          </div>
        </section>

        <section className={styles.section}>
          <h2>实际演示</h2>
          <p>点击下面的输入框，观察底部栏的调整效果：</p>

          <div className={styles.inputGroup}>
            <label>普通输入框:</label>
            <input
              type="text"
              placeholder="点击这里测试普通键盘"
              onFocus={handleInputFocus}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>数字输入框:</label>
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              placeholder="点击这里测试数字键盘"
              onFocus={handleInputFocus}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>电话输入框:</label>
            <input
              type="tel"
              inputMode="tel"
              placeholder="点击这里测试电话键盘"
              onFocus={handleInputFocus}
            />
          </div>
        </section>
      </main>

      {/* 底部固定栏 - 使用动态调整 */}
      <BottomSheet isOpen={true}>
        <input inputMode="numeric" style={{ height: 33, fontSize: 16 }}></input>
      </BottomSheet>
    </div>
  );
}

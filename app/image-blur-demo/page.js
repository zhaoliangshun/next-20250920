"use client";

import React from "react";
import styles from "./page.module.css";

const ImageBlurDemo = () => {
  return (
    <div className={styles.container}>
      <h1>图片两端模糊效果演示</h1>
      
      <div className={styles.demoSection}>
        <h2>方法一：使用 CSS mask 实现</h2>
        <div className={styles.imageContainer}>
          <div className={styles.maskedImage}></div>
        </div>
        <p>使用 CSS mask 属性创建渐变遮罩，使图片两端模糊</p>
      </div>
      
      <div className={styles.demoSection}>
        <h2>方法二：使用伪元素实现</h2>
        <div className={styles.imageContainer}>
          <div className={`${styles.maskedImage} ${styles.method2}`}></div>
        </div>
        <p>使用伪元素创建渐变遮罩层</p>
      </div>
      
      <div className={styles.demoSection}>
        <h2>方法三：使用多个元素叠加</h2>
        <div className={styles.imageContainer}>
          <div className={styles.overlayContainer}>
            <div className={styles.baseImage}></div>
            <div className={styles.gradientOverlay}></div>
          </div>
        </div>
        <p>使用两个元素叠加，上面的元素作为渐变遮罩</p>
      </div>
    </div>
  );
};

export default ImageBlurDemo;
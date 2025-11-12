"use client";

import React from "react";
import styles from "./advanced.module.css";

const AdvancedImageBlurDemo = () => {
  return (
    <div className={styles.container}>
      <h1>高级图片两端模糊效果演示</h1>
      
      <div className={styles.demoSection}>
        <h2>方法四：使用模糊滤镜和遮罩</h2>
        <div className={styles.imageContainer}>
          <div className={styles.blurContainer}>
            <div className={styles.blurredImage}></div>
            <div className={styles.sharpImage}></div>
          </div>
        </div>
        <p>使用模糊图片作为背景，清晰图片作为前景，通过遮罩显示中间部分</p>
      </div>
      
      <div className={styles.demoSection}>
        <h2>方法五：使用 CSS clamp 和渐变</h2>
        <div className={styles.imageContainer}>
          <div className={`${styles.maskedImage} ${styles.method5}`}></div>
        </div>
        <p>使用更精细的渐变控制，创建平滑的模糊过渡</p>
      </div>
    </div>
  );
};

export default AdvancedImageBlurDemo;
"use client";

import React from "react";
import styles from "./svg.module.css";

const SVGImageBlurDemo = () => {
  return (
    <div className={styles.container}>
      <h1>SVG 滤镜图片两端模糊效果演示</h1>
      
      {/* SVG 滤镜定义 */}
      <svg width="0" height="0">
        <filter id="horizontalBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10 0" />
        </filter>
      </svg>
      
      <div className={styles.demoSection}>
        <h2>方法六：使用 SVG 水平模糊滤镜</h2>
        <div className={styles.imageContainer}>
          <div className={styles.svgBlurredImage}></div>
        </div>
        <p>使用 SVG 滤镜创建水平方向的模糊效果</p>
      </div>
      
      <div className={styles.demoSection}>
        <h2>方法七：组合 SVG 滤镜和遮罩</h2>
        <div className={styles.imageContainer}>
          <div className={styles.combinedEffect}></div>
        </div>
        <p>结合 SVG 滤镜和 CSS 遮罩实现更复杂的模糊效果</p>
      </div>
    </div>
  );
};

export default SVGImageBlurDemo;
"use client";

import React, { useState } from "react";
import SegmentedSlider from "../../components/SegmentedSlider";
import styles from "./page.module.css";

const SegmentedSliderDemo = () => {
  const [rangeValue, setRangeValue] = useState([1000, 2400]);

  // 定义区间配置 - 明确展示间隙点
  const segments = [
    { start: 1000, end: 1200, color: "#FBBE05" },
    { start: 1400, end: 1800, color: "#BEE429" },
    { start: 1900, end: 2100, color: "#67BED0" },
    { start: 2200, end: 2400, color: "#173E96" },
  ];

  return (
    <div className={styles.container}>
      <h1>分段式滑块演示（仅区间选择）</h1>
      <p>每个区间有不同的背景颜色，只能在区间的起点和终点选中</p>



      <div className={styles.sliderContainer}>
        <h2>受控区间选择滑块</h2>
        <SegmentedSlider
          segments={segments}
          value={rangeValue}
          onChange={setRangeValue}
        />
        <p>
          当前区间: {rangeValue[0]} - {rangeValue[1]}
        </p>
      </div>

      
    </div>
  );
};

export default SegmentedSliderDemo;

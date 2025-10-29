"use client";

import React, { useState } from "react";
import SegmentedSlider from "../../components/SegmentedSlider";
import styles from "./page.module.css";

const SegmentedSliderDemo = () => {
  const [rangeValue1, setRangeValue1] = useState([1000, 2400]);
  const [rangeValue2, setRangeValue2] = useState([1000, 2100]);
  const [rangeValue3, setRangeValue3] = useState([1400, 2400]);
  const [rangeValue4, setRangeValue4] = useState([1000, 1800]);

  // 定义区间配置
  const segments = [
    { start: 1000, end: 1200, color: "#FBBE05" },
    { start: 1400, end: 1800, color: "#BEE429" },
    { start: 1900, end: 2100, color: "#67BED0" },
    { start: 2200, end: 2400, color: "#173E96" },
  ];

  // 自定义格式化函数 - 显示温度
  const formatTemperature = (value) => `${value}°C`;

  // 自定义格式化函数 - 显示波长
  const formatWavelength = (value) => `${value}nm`;

  // 自定义格式化函数 - 显示价格
  const formatPrice = (value) => `¥${value.toLocaleString()}`;

  return (
    <div className={styles.container}>
      <h1>分段式滑块 Tooltip 演示</h1>
      <p>支持自定义 tooltip 格式化和多种显示策略</p>

      <div className={styles.sliderContainer}>
        <h2>1. 默认 Tooltip（拖动时显示）</h2>
        <SegmentedSlider
          segments={segments}
          value={rangeValue1}
          onChange={setRangeValue1}
          tooltipVisible="drag"
        />
        <p>
          当前区间: {rangeValue1[0]} - {rangeValue1[1]}
        </p>
        <p className={styles.description}>
          💡 拖动滑块手柄时会显示 tooltip
        </p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>2. 温度显示格式（悬停时显示）</h2>
        <SegmentedSlider
          segments={segments}
          value={rangeValue2}
          onChange={setRangeValue2}
          formatTooltip={formatTemperature}
          tooltipVisible="hover"
        />
        <p>
          当前温度范围: {formatTemperature(rangeValue2[0])} - {formatTemperature(rangeValue2[1])}
        </p>
        <p className={styles.description}>
          💡 鼠标悬停或拖动时显示温度格式的 tooltip
        </p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>3. 波长显示格式（始终显示）</h2>
        <SegmentedSlider
          segments={segments}
          value={rangeValue3}
          onChange={setRangeValue3}
          formatTooltip={formatWavelength}
          tooltipVisible="always"
        />
        <p>
          当前波长范围: {formatWavelength(rangeValue3[0])} - {formatWavelength(rangeValue3[1])}
        </p>
        <p className={styles.description}>
          💡 tooltip 始终显示，展示波长单位
        </p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>4. 价格显示格式（拖动时显示）</h2>
        <SegmentedSlider
          segments={segments}
          value={rangeValue4}
          onChange={setRangeValue4}
          formatTooltip={formatPrice}
          tooltipVisible="drag"
        />
        <p>
          当前价格范围: {formatPrice(rangeValue4[0])} - {formatPrice(rangeValue4[1])}
        </p>
        <p className={styles.description}>
          💡 使用货币格式化，千位分隔符
        </p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>5. 禁用 Tooltip</h2>
        <SegmentedSlider
          segments={segments}
          value={rangeValue1}
          onChange={setRangeValue1}
          showTooltip={false}
        />
        <p>
          当前区间: {rangeValue1[0]} - {rangeValue1[1]}
        </p>
        <p className={styles.description}>
          💡 完全不显示 tooltip
        </p>
      </div>
    </div>
  );
};

export default SegmentedSliderDemo;

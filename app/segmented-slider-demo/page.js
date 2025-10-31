"use client";

import React, { useState } from "react";
import SegmentedSlider from "../../components/SegmentedSlider";
import styles from "./page.module.css";

const SegmentedSliderDemo = () => {
  const [rangeValue1, setRangeValue1] = useState([1000, 2400]);
  const [rangeValue2, setRangeValue2] = useState([1000, 2100]);
  const [rangeValue3, setRangeValue3] = useState([1400, 2400]);
  const [rangeValue4, setRangeValue4] = useState([1000, 1800]);
  const [rangeValue5, setRangeValue5] = useState([1000, 2100]);
  const [rangeValue6, setRangeValue6] = useState([1400, 2200]);
  const [rangeValue7, setRangeValue7] = useState([1000, 2500]);
  const [rangeValue8, setRangeValue8] = useState([1400, 2100]);

  // 定义颜色区间配置（用于背景显示）
  const colorSegments = [
    { start: 1000, end: 1400, color: "#FBBE05" },
    { start: 1400, end: 1800, color: "#BEE429" },
    { start: 1800, end: 2200, color: "#67BED0" },
    { start: 2200, end: 2400, color: "#173E96" },
  ];

  // 定义可选择的值区间（用于定义拖动点可以停留的位置）
  const valueSegments = [
    { start: 1000, end: 1200 },
    { start: 1400, end: 1800 },
    { start: 1900, end: 2100 },
    { start: 2200, end: 2400 },
  ];

  // 演示独立配置：更多的可选值区间
  const extendedValueSegments = [
    { start: 1000, end: 1200 },
    { start: 1200, end: 1400 },
    { start: 1400, end: 1600 },
    { start: 1600, end: 1650 },
    { start: 1650, end: 1800 },
    { start: 2000, end: 2200 },
    { start: 2200, end: 2400 },
  ];

  // 自定义格式化函数 - 显示温度
  const formatTemperature = (value) => `${value}°C`;

  // 自定义格式化函数 - 显示波长
  const formatWavelength = (value) => `${value}m`;

  // 自定义格式化函数 - 显示价格
  const formatPrice = (value) => `¥${value.toLocaleString()}`;

  return (
    <div className={styles.container}>
      <h1>分段式滑块 Tooltip 演示</h1>
      <p>支持自定义 tooltip 格式化和多种显示策略</p>

      <div className={styles.sliderContainer}>
        <h2>1. 默认 Tooltip（拖动时显示）</h2>
        <SegmentedSlider
          colorSegments={colorSegments}
          valueSegments={valueSegments}
          value={rangeValue1}
          onChange={setRangeValue1}
          tooltipVisible="drag"
        />
        <p>
          当前区间: {rangeValue1[0]} - {rangeValue1[1]}
        </p>
        <p className={styles.description}>💡 拖动滑块手柄时会显示 tooltip</p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>2. 温度显示格式（悬停时显示）</h2>
        <SegmentedSlider
          colorSegments={colorSegments}
          valueSegments={valueSegments}
          value={rangeValue2}
          onChange={setRangeValue2}
          formatTooltip={formatTemperature}
          tooltipVisible="hover"
        />
        <p>
          当前温度范围: {formatTemperature(rangeValue2[0])} -{" "}
          {formatTemperature(rangeValue2[1])}
        </p>
        <p className={styles.description}>
          💡 鼠标悬停或拖动时显示温度格式的 tooltip
        </p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>3. 波长显示格式（始终显示）</h2>
        <SegmentedSlider
          colorSegments={colorSegments}
          valueSegments={valueSegments}
          value={rangeValue3}
          onChange={setRangeValue3}
          formatTooltip={formatWavelength}
          tooltipVisible="always"
        />
        <p>
          当前波长范围: {formatWavelength(rangeValue3[0])} -{" "}
          {formatWavelength(rangeValue3[1])}
        </p>
        <p className={styles.description}>💡 tooltip 始终显示，展示波长单位</p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>4. 价格显示格式（拖动时显示）</h2>
        <SegmentedSlider
          colorSegments={colorSegments}
          valueSegments={valueSegments}
          value={rangeValue4}
          onChange={setRangeValue4}
          formatTooltip={formatPrice}
          tooltipVisible="drag"
        />
        <p>
          当前价格范围: {formatPrice(rangeValue4[0])} -{" "}
          {formatPrice(rangeValue4[1])}
        </p>
        <p className={styles.description}>💡 使用货币格式化，千位分隔符</p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>5. 禁用 Tooltip</h2>
        <SegmentedSlider
          colorSegments={colorSegments}
          valueSegments={valueSegments}
          value={rangeValue1}
          onChange={setRangeValue1}
          showTooltip={false}
        />
        <p>
          当前区间: {rangeValue1[0]} - {rangeValue1[1]}
        </p>
        <p className={styles.description}>💡 完全不显示 tooltip</p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>6. 大尺寸 Handle（32px）</h2>
        <SegmentedSlider
          colorSegments={colorSegments}
          valueSegments={valueSegments}
          value={rangeValue5}
          onChange={setRangeValue5}
          formatTooltip={formatPrice}
          tooltipVisible="hover"
          handleSize={32}
        />
        <p>
          当前价格范围: {formatPrice(rangeValue5[0])} -{" "}
          {formatPrice(rangeValue5[1])}
        </p>
        <p className={styles.description}>💡 使用 32px 的大尺寸 handle</p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>7. 自定义宽高 Handle</h2>
        <SegmentedSlider
          colorSegments={colorSegments}
          valueSegments={valueSegments}
          value={rangeValue6}
          onChange={setRangeValue6}
          formatTooltip={formatWavelength}
          tooltipVisible="always"
          handleSize={{ width: 28, height: 28 }}
        />
        <p>
          当前波长范围: {formatWavelength(rangeValue6[0])} -{" "}
          {formatWavelength(rangeValue6[1])}
        </p>
        <p className={styles.description}>💡 自定义 handle 大小为 28x28px</p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>8. 独立配置演示（颜色区间 vs 值区间）</h2>
        <SegmentedSlider
          colorSegments={colorSegments}
          valueSegments={extendedValueSegments}
          value={rangeValue7}
          onChange={setRangeValue7}
          formatTooltip={formatPrice}
          tooltipVisible="hover"
        />
        <p>
          当前价格范围: {formatPrice(rangeValue7[0])} -{" "}
          {formatPrice(rangeValue7[1])}
        </p>
        <p className={styles.description}>
          💡 颜色区间保持4段，但值区间有6段（更多可选择的位置）。 Marks
          根据颜色区间生成，不包括头尾。
        </p>
      </div>

      <div className={styles.sliderContainer}>
        <h2>9. PassedOverlay 遮罩效果</h2>
        <SegmentedSlider
          colorSegments={colorSegments}
          valueSegments={extendedValueSegments}
          value={rangeValue8}
          onChange={setRangeValue8}
          formatTooltip={formatTemperature}
          tooltipVisible="hover"
          passedOverlay={true}
          passedColor="rgba(224, 224, 224, 0.8)"
        />
        <p>
          当前温度范围: {formatTemperature(rangeValue8[0])} -{" "}
          {formatTemperature(rangeValue8[1])}
        </p>
        <p className={styles.description}>
          💡 启用 passedOverlay 后，未选中的部分会显示半透明灰色遮罩，
          使选中区域更加突出。适合用于强调当前选择范围。
        </p>
      </div>
    </div>
  );
};

export default SegmentedSliderDemo;

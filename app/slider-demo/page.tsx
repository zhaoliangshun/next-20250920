"use client";

import React, { useState } from "react";
import EnhancedSlider from "../../components/EnhancedSlider.jsx";
import styles from "./page.module.css";

export default function SliderDemo() {
  const [value1, setValue1] = useState<number>(50);
  const [value2, setValue2] = useState<number[]>([20, 80]);
  const [value3, setValue3] = useState<number>(30);
  const [value4, setValue4] = useState<number>(60);
  const [value5, setValue5] = useState<number>(5);
  const [value6, setValue6] = useState<number[]>([25, 75]);
  const [value7, setValue7] = useState<number>(30);
  const [value8, setValue8] = useState<number>(50);
  const [value9, setValue9] = useState<number>(70);
  const [value10, setValue10] = useState<number[]>([20, 80]);
  const [value11, setValue11] = useState<number>(40);
  const [value12, setValue12] = useState<number[]>([30, 70]);
  const [value13, setValue13] = useState<number>(1500);
  const [value14, setValue14] = useState<number[]>([1200, 2000]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>滑块组件演示</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>基础滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            value={value1}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue1(val);
              }
            }}
          />
          <div className={styles.value}>当前值: {value1}</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>分段背景色滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            value={value3}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue3(val);
              }
            }}
            segmentedTrack={true}
            hideRailWhenDragging={true}
          />
          <div className={styles.value}>当前值: {value3}</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>自定义分段颜色</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            value={value4}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue4(val);
              }
            }}
            segmentedTrack={{
              segments: 6,
              startColor: "#f0f9ff",
              endColor: "#0077cc",
            }}
            hideRailWhenDragging={true}
          />
          <div className={styles.value}>当前值: {value4}</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>范围滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            range={true}
            value={value2}
            onChange={(val) => {
              if (Array.isArray(val)) {
                setValue2(val);
              }
            }}
            marks={{
              0: "0%",
              25: "25%",
              50: "50%",
              75: "75%",
              100: "100%",
            }}
          />
          <div className={styles.value}>当前值: [{value2.join(", ")}]</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>分段背景色 + 范围滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            range={true}
            value={value2}
            onChange={(val) => {
              if (Array.isArray(val)) {
                setValue2(val);
              }
            }}
            segmentedTrack={{
              segments: 5,
              colors: ["#f3f4f6", "#dbeafe", "#93c5fd", "#60a5fa", "#3b82f6"],
            }}
            hideRailWhenDragging={true}
            marks={{
              0: "0%",
              25: "25%",
              50: "50%",
              75: "75%",
              100: "100%",
            }}
          />
          <div className={styles.value}>当前值: [{value2.join(", ")}]</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Handle中显示值 - 基础滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            value={value5}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue5(val);
              }
            }}
            showValueInHandle={true}
            tooltip={false}
            segmentedTrack={{
              segments: 4,
              baseColor: "#2655CC", // 基础颜色
              useOpacityGradient: true, // 启用透明度渐变
            }}
            min={0}
            max={10}
            marks={{
              2.5: "25%",
              5.0: "50%",
              7.5: "75%",
            }}
            showMarkLabels={false} // 全局关闭，优先级最高
            passedOverlay={false}
          />
          <div className={styles.value}>当前值: {value5}</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Handle中显示值 - 范围滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            range={true}
            value={value6}
            onChange={(val) => {
              if (Array.isArray(val)) {
                setValue6(val);
              }
            }}
            showValueInHandle={{
              formatter: (val) => `${val}%`,
              style: { fontWeight: "bold" },
            }}
            tooltip={false}
            marks={{
              0: "0%",
              25: "25%",
              50: "50%",
              75: "75%",
              100: "100%",
            }}
          />
          <div className={styles.value}>当前值: [{value6.join(", ")}]</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Handle中显示值 + 分段背景色</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            value={value5}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue5(val);
              }
            }}
            showValueInHandle={true}
            tooltip={false}
            segmentedTrack={{
              segments: 5,
              startColor: "#f0f9ff",
              endColor: "#0077cc",
            }}
            hideRailWhenDragging={true}
            marks={{
              0: "0%",
              25: "25%",
              50: "50%",
              75: "75%",
              100: "100%",
            }}
          />
          <div className={styles.value}>当前值: {value5}</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>传统工具提示模式</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            value={value1}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue1(val);
              }
            }}
            marks={{
              0: "0%",
              25: "25%",
              50: "50%",
              75: "75%",
              100: "100%",
            }}
            tooltip={{
              formatter: (val) => `${val}%`,
              placement: "bottom",
            }}
          />
          <div className={styles.value}>当前值: {value1}</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>新式 Tooltip - 拖动时显示（默认）</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            value={value7}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue7(val);
              }
            }}
            tooltipVisible="drag"
          />
          <div className={styles.value}>当前值: {value7}</div>
          <div className={styles.description}>💡 拖动手柄时显示 tooltip</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>新式 Tooltip - 悬停时显示</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            value={value8}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue8(val);
              }
            }}
            formatTooltip={(val) => `${val}°C`}
            tooltipVisible="hover"
          />
          <div className={styles.value}>当前温度: {value8}°C</div>
          <div className={styles.description}>💡 鼠标悬停或拖动时显示，带温度格式</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>新式 Tooltip - 始终显示</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            value={value9}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue9(val);
              }
            }}
            formatTooltip={(val) => `¥${val.toLocaleString()}`}
            tooltipVisible="always"
          />
          <div className={styles.value}>当前价格: ¥{value9.toLocaleString()}</div>
          <div className={styles.description}>💡 Tooltip 始终显示，价格格式化</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>新式 Tooltip - 范围滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            range={true}
            value={value10}
            onChange={(val) => {
              if (Array.isArray(val)) {
                setValue10(val);
              }
            }}
            formatTooltip={(val) => `${val}%`}
            tooltipVisible="hover"
            marks={{
              0: "0%",
              25: "25%",
              50: "50%",
              75: "75%",
              100: "100%",
            }}
          />
          <div className={styles.value}>当前范围: {value10[0]}% - {value10[1]}%</div>
          <div className={styles.description}> 范围滑块 + 悬停显示 tooltip，边缘智能对齐</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>大尺寸 Handle（36px）</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            value={value11}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue11(val);
              }
            }}
            handleSize={36}
            formatTooltip={(val) => `${val}%`}
            tooltipVisible="hover"
          />
          <div className={styles.value}>当前值: {value11}%</div>
          <div className={styles.description}> 使用 36px 的大尺寸 handle</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>自定义宽高 Handle + 范围滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            range={true}
            value={value12}
            onChange={(val) => {
              if (Array.isArray(val)) {
                setValue12(val);
              }
            }}
            handleSize={{ width: 32, height: 32 }}
            formatTooltip={(val) => `${val}%`}
            tooltipVisible="always"
            segmentedTrack={{
              segments: 5,
              colors: ["#f3f4f6", "#dbeafe", "#93c5fd", "#60a5fa", "#3b82f6"],
            }}
          />
          <div className={styles.value}>当前范围: {value12[0]}% - {value12[1]}%</div>
          <div className={styles.description}>💡 自定义 handle 大小 32x32px + 分段背景色</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>按范围大小定义颜色段（单值）</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            min={1000}
            max={2500}
            value={value13}
            onChange={(val) => {
              if (typeof val === "number") {
                setValue13(val);
              }
            }}
            segmentedTrackColor={[
              { start: 1000, end: 1200, color: "#FBBE05" },
              { start: 1400, end: 1800, color: "#BEE429" },
              { start: 1900, end: 2100, color: "#67BED0" },
              { start: 2200, end: 2400, color: "#173E96" },
            ]}
            formatTooltip={(val) => `${val}nm`}
            tooltipVisible="hover"
          />
          <div className={styles.value}>当前波长: {value13}nm</div>
          <div className={styles.description}>💡 使用对象数组格式，按实际范围大小定义颜色段，非等比例</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>按范围大小定义颜色段（范围）</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider
            range={true}
            min={1000}
            max={2500}
            value={value14}
            onChange={(val) => {
              if (Array.isArray(val)) {
                setValue14(val);
              }
            }}
            segmentedTrackColor={[
              { range: [1000, 1200], color: "#FBBE05" },
              { range: [1400, 1800], color: "#BEE429" },
              { range: [1900, 2100], color: "#67BED0" },
              { range: [2200, 2400], color: "#173E96" },
            ]}
            formatTooltip={(val) => `${val}nm`}
            tooltipVisible="always"
            marks={{
              1000: "1000nm",
              1500: "1500nm",
              2000: "2000nm",
              2500: "2500nm",
            }}
          />
          <div className={styles.value}>当前范围: {value14[0]}nm - {value14[1]}nm</div>
          <div className={styles.description}>💡 使用 range 数组格式，实现不等宽度的颜色分段</div>
        </div>
      </section>
    </div>
  );
}

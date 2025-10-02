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
    </div>
  );
}

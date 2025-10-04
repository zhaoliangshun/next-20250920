"use client";

import React, { useState, useRef, useEffect } from "react";
import Tour from "../../components/Tour";
import styles from "./page.module.css";

export default function TourDemoPage() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [allowPrev, setAllowPrev] = useState(true);

  // Ensure elements exist before measuring by delaying open slightly
  const startTour = () => {
    setStep(0);
    setOpen(true);
  };

  const steps = [
    {
      target: "#tour-hero",
      title: "欢迎使用 Tour 漫游引导",
      content: "点击下一步，按照指引逐步了解页面关键区域。",
      placement: "bottom",
    },
    {
      target: "#tour-actions",
      title: "常用操作",
      content: "这里包含创建、导入等高频操作，支持快捷键。",
      placement: "bottom",
    },
    {
      target: "#tour-card-1",
      title: "数据概览卡片",
      content: "展示关键指标与趋势，支持点击查看详情。",
      placement: "top",
    },
    {
      target: "#tour-card-2",
      title: "近期活动",
      content: "实时显示最近的变更与提醒。",
      placement: "top",
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header} id="tour-hero">
        <h1 className={styles.title}>Tour 漫游式引导 Demo</h1>
        <p className={styles.subtitle}>一步一步引导用户熟悉页面功能</p>
        <div className={styles.actions} id="tour-actions">
          <button className={styles.primaryBtn} onClick={startTour}>
            开始引导
          </button>
          <button className={styles.ghostBtn} onClick={() => setOpen(false)}>
            关闭
          </button>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={allowPrev}
              onChange={(e) => setAllowPrev(e.target.checked)}
            />
            允许“上一步”
          </label>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.grid}>
          <div className={styles.card} id="tour-card-1">
            <h3>关键指标</h3>
            <p>UV: 12,430</p>
            <p>转化率: 3.2%</p>
          </div>
          <div className={styles.card} id="tour-card-2">
            <h3>近期活动</h3>
            <ul className={styles.list}>
              <li>发布 v1.2.0</li>
              <li>新增仪表盘</li>
              <li>性能优化完成</li>
            </ul>
          </div>
          <div className={styles.card}>
            <h3>帮助中心</h3>
            <p>查看常见问题与使用指南。</p>
          </div>
        </section>
      </main>

      <Tour
        steps={steps}
        isOpen={open}
        currentStep={step}
        onStepChange={(s) => setStep(s)}
        onClose={() => setOpen(false)}
        onComplete={() => setOpen(false)}
        maskClosable={false}
        showProgress={false}
        showSkip={false}
        allowPrev={allowPrev}
      />
    </div>
  );
}

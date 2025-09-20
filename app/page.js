'use client';

import { useState } from 'react';
import BottomSheet from '../components/BottomSheet';
import styles from "./page.module.css";

export default function Home() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const openBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>移动端底部弹出层演示</h1>
        
        <div className={styles.demoSection}>
          <h2>功能特点</h2>
          <ul className={styles.featureList}>
            <li>✅ 从下到上的平滑弹出动画</li>
            <li>✅ 从上到下的关闭动画</li>
            <li>✅ 点击背景遮罩关闭</li>
            <li>✅ 拖拽指示器</li>
            <li>✅ 移动端优化</li>
            <li>✅ 响应式设计</li>
          </ul>
        </div>

        <div className={styles.ctas}>
          <button
            className={styles.primary}
            onClick={openBottomSheet}
          >
            打开底部弹出层
          </button>
        </div>

        <div className={styles.instructions}>
          <h3>使用说明</h3>
          <p>点击上方按钮打开底部弹出层，你可以：</p>
          <ul>
            <li>点击背景区域关闭弹出层</li>
            <li>点击右上角 ✕ 按钮关闭</li>
            <li>在移动设备上体验最佳效果</li>
          </ul>
        </div>
      </main>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={closeBottomSheet}
        title="底部弹出层"
      >
        <div className={styles.bottomSheetContent}>
          <h3>欢迎使用底部弹出层组件！</h3>
          <p>这是一个功能完整的移动端底部弹出层组件，具有以下特性：</p>
        </div>
      </BottomSheet>
    </div>
  );
}

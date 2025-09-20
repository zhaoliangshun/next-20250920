'use client';

import { useState } from 'react';
import BottomSheet from '../components/BottomSheet';
import Modal from '../components/Modal';
import styles from "./page.module.css";

export default function Home() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>弹窗组件演示</h1>
        
        <div className={styles.demoSection}>
          <h2>底部弹出层功能特点</h2>
          <ul className={styles.featureList}>
            <li>✅ 从下到上的平滑弹出动画</li>
            <li>✅ 从上到下的关闭动画</li>
            <li>✅ 点击背景遮罩关闭</li>
            <li>✅ 拖拽指示器</li>
            <li>✅ 移动端优化</li>
            <li>✅ 响应式设计</li>
          </ul>
        </div>

        <div className={styles.demoSection}>
          <h2>居中弹窗功能特点</h2>
          <ul className={styles.featureList}>
            <li>✅ 居中显示的弹窗效果</li>
            <li>✅ 缩放和淡入淡出动画</li>
            <li>✅ 多种尺寸选择（小、中、大）</li>
            <li>✅ 键盘 ESC 键关闭</li>
            <li>✅ 点击背景关闭</li>
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
          <button
            className={styles.primary}
            onClick={openModal}
          >
            打开居中弹窗
          </button>
        </div>

        <div className={styles.instructions}>
          <h3>使用说明</h3>
          <p>点击上方按钮体验不同的弹窗效果：</p>
          <ul>
            <li><strong>底部弹出层：</strong>点击背景区域或右上角 ✕ 按钮关闭</li>
            <li><strong>居中弹窗：</strong>点击背景区域、右上角 ✕ 按钮或按 ESC 键关闭</li>
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
          <ul>
            <li>从下到上的平滑动画</li>
            <li>移动端优化的交互体验</li>
            <li>响应式设计</li>
          </ul>
        </div>
      </BottomSheet>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="居中弹窗"
        size="medium"
      >
        <div className={styles.modalContent}>
          <h3>欢迎使用居中弹窗组件！</h3>
          <p>这是一个功能完整的居中弹窗组件，具有以下特性：</p>
          <ul>
            <li>居中显示的弹窗效果</li>
            <li>缩放和淡入淡出动画</li>
            <li>多种尺寸选择（小、中、大）</li>
            <li>键盘 ESC 键关闭支持</li>
            <li>点击背景关闭功能</li>
            <li>响应式设计，适配各种屏幕</li>
          </ul>
          <div className={styles.modalActions}>
            <button 
              className={styles.secondary}
              onClick={closeModal}
            >
              取消
            </button>
            <button 
              className={styles.primary}
              onClick={closeModal}
            >
              确定
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

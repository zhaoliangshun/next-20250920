'use client';

import React from 'react';
import { useMessage } from '../../components/MessageProvider';
import styles from './page.module.css';

export default function MessageDemo() {
  const message = useMessage();

  const handleSuccess = () => {
    message.success('这是一条成功消息！');
  };

  const handleError = () => {
    message.error('这是一条错误消息！');
  };

  const handleWarning = () => {
    message.warning('这是一条警告消息！');
  };

  const handleInfo = () => {
    message.info('这是一条信息消息！');
  };

  const handleLoading = () => {
    const loadingId = message.loading('正在加载中...');
    // 3秒后关闭loading消息
    setTimeout(() => {
      message.destroy(loadingId);
      message.success('加载完成！');
    }, 3000);
  };

  const handleCustomDuration = () => {
    message.info('这条消息将在10秒后自动关闭', 10000);
  };

  const handleMultiple = () => {
    message.info('第一条消息');
    setTimeout(() => message.success('第二条消息'), 500);
    setTimeout(() => message.warning('第三条消息'), 1000);
    setTimeout(() => message.error('第四条消息'), 1500);
  };

  const handleClear = () => {
    message.clear();
  };

  const handleMaxCountDemo = () => {
    // 清空现有消息
    message.clear();
    
    // 快速连续发送多条消息，展示数量限制功能
    setTimeout(() => message.info('第1条消息'), 100);
    setTimeout(() => message.success('第2条消息'), 200);
    setTimeout(() => message.warning('第3条消息'), 300);
    setTimeout(() => message.error('第4条消息 - 这条会替换第1条'), 400);
    setTimeout(() => message.info('第5条消息 - 这条会替换第2条'), 500);
  };

  const handleSmoothAnimationDemo = () => {
    // 清空现有消息
    message.clear();
    
    // 展示平滑动画效果
    setTimeout(() => message.success('平滑动画测试 - 第1条'), 100);
    setTimeout(() => message.info('平滑动画测试 - 第2条'), 300);
    setTimeout(() => message.warning('平滑动画测试 - 第3条'), 500);
  };

  const handleUnlimitedDemo = () => {
    // 清空现有消息
    message.clear();
    
    // 展示无限制功能 - 发送多条消息
    const messages = [
      '第1条消息 - 默认无限制',
      '第2条消息 - 可以显示多条',
      '第3条消息 - 不会自动替换',
      '第4条消息 - 继续添加',
      '第5条消息 - 更多消息',
      '第6条消息 - 无数量限制',
      '第7条消息 - 最后一条'
    ];
    
    messages.forEach((msg, index) => {
      setTimeout(() => {
        const types = ['success', 'info', 'warning', 'error'];
        const type = types[index % types.length];
        message[type](msg);
      }, index * 200);
    });
  };

  const handleSmoothExitDemo = () => {
    // 清空现有消息
    message.clear();
    
    // 发送几条消息，然后展示平滑退出效果
    setTimeout(() => message.success('消息1 - 5秒后消失', 5000), 100);
    setTimeout(() => message.info('消息2 - 3秒后消失', 3000), 300);
    setTimeout(() => message.warning('消息3 - 7秒后消失', 7000), 500);
    setTimeout(() => message.error('消息4 - 4秒后消失', 4000), 700);
    
    // 提示用户观察效果
    setTimeout(() => {
      message.info('观察消息如何一条条平滑消失，而不是整体跳动', 1000);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Message 全局提示组件</h1>
        <p className={styles.description}>
          基于 Ant Design 风格的全局消息提示组件，支持多种消息类型和自定义配置。
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>基础用法</h2>
        <div className={styles.buttonGroup}>
          <button className={`${styles.button} ${styles.success}`} onClick={handleSuccess}>
            成功消息
          </button>
          <button className={`${styles.button} ${styles.error}`} onClick={handleError}>
            错误消息
          </button>
          <button className={`${styles.button} ${styles.warning}`} onClick={handleWarning}>
            警告消息
          </button>
          <button className={`${styles.button} ${styles.info}`} onClick={handleInfo}>
            信息消息
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>高级用法</h2>
        <div className={styles.buttonGroup}>
          <button className={`${styles.button} ${styles.loading}`} onClick={handleLoading}>
            加载消息
          </button>
          <button className={`${styles.button} ${styles.custom}`} onClick={handleCustomDuration}>
            自定义时长
          </button>
          <button className={`${styles.button} ${styles.multiple}`} onClick={handleMultiple}>
            多条消息
          </button>
          <button className={`${styles.button} ${styles.clear}`} onClick={handleClear}>
            清空所有
          </button>
          <button className={`${styles.button} ${styles.maxCount}`} onClick={handleMaxCountDemo}>
            数量限制演示
          </button>
          <button className={`${styles.button} ${styles.smoothAnimation}`} onClick={handleSmoothAnimationDemo}>
            平滑动画演示
          </button>
          <button className={`${styles.button} ${styles.unlimited}`} onClick={handleUnlimitedDemo}>
            无限制演示
          </button>
          <button className={`${styles.button} ${styles.smoothExit}`} onClick={handleSmoothExitDemo}>
            平滑退出演示
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>API 说明</h2>
        <div className={styles.apiTable}>
          <table>
            <thead>
              <tr>
                <th>方法</th>
                <th>参数</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>message.success(content, duration?)</code></td>
                <td>content: string, duration?: number</td>
                <td>显示成功消息</td>
              </tr>
              <tr>
                <td><code>message.error(content, duration?)</code></td>
                <td>content: string, duration?: number</td>
                <td>显示错误消息</td>
              </tr>
              <tr>
                <td><code>message.warning(content, duration?)</code></td>
                <td>content: string, duration?: number</td>
                <td>显示警告消息</td>
              </tr>
              <tr>
                <td><code>message.info(content, duration?)</code></td>
                <td>content: string, duration?: number</td>
                <td>显示信息消息</td>
              </tr>
              <tr>
                <td><code>message.loading(content, duration?)</code></td>
                <td>content: string, duration?: number</td>
                <td>显示加载消息</td>
              </tr>
              <tr>
                <td><code>message.destroy(id)</code></td>
                <td>id: number</td>
                <td>手动关闭指定消息</td>
              </tr>
              <tr>
                <td><code>message.clear()</code></td>
                <td>-</td>
                <td>清空所有消息</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>特性</h2>
        <ul className={styles.features}>
          <li>✨ 支持多种消息类型：success、error、warning、info、loading</li>
          <li>🎨 完全基于 Ant Design 设计规范</li>
          <li>📱 响应式设计，支持移动端</li>
          <li>🌙 支持深色模式</li>
          <li>⚡ 流畅的进入和退出动画，无抖动</li>
          <li>🔧 可自定义显示时长</li>
          <li>🎯 支持手动关闭和批量清空</li>
          <li>🔢 默认无数量限制，可手动控制</li>
          <li>🎭 优雅的弹性动画效果</li>
          <li>🌊 消息一条条平滑消失，不会整体跳动</li>
          <li>♿ 良好的无障碍支持</li>
        </ul>
      </div>
    </div>
  );
}

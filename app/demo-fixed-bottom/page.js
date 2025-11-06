"use client";

import React, { useState } from 'react';
import BottomFixedContainer from '../../components/BottomFixedContainer';
import styles from './page.module.css';

export default function DemoFixedBottom() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    amount: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('提交表单:', formData);
    alert('表单已提交！查看控制台获取详细信息。');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>iOS 18 键盘适配示例</h1>
        <p>在 iPhone Safari 浏览器中测试，点击输入框弹出键盘</p>
      </header>

      <main className={styles.main}>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">姓名</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="请输入姓名"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">手机号</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="请输入手机号"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">邮箱</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="请输入邮箱"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="amount">金额（测试数字键盘）</label>
            <input
              id="amount"
              name="amount"
              type="number"
              placeholder="请输入金额"
              value={formData.amount}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">备注</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="请输入备注信息"
              value={formData.notes}
              onChange={handleChange}
              className={styles.textarea}
              rows={4}
            />
          </div>

          {/* 添加一些填充内容以便测试滚动 */}
          <div className={styles.placeholder}>
            <h3>测试说明</h3>
            <p>1. 在 iOS 18 Safari 浏览器中打开此页面</p>
            <p>2. 点击任意输入框，观察键盘弹出时底部按钮的行为</p>
            <p>3. 底部的提交按钮应该会自动上移，不会被键盘遮挡</p>
            <p>4. 输入框会自动滚动到可见区域</p>
          </div>
        </div>
      </main>

      {/* 底部固定容器 - 会自动适配键盘 */}
      <BottomFixedContainer className={styles.bottomBar}>
        <button 
          className={styles.submitButton}
          onClick={handleSubmit}
        >
          提交表单
        </button>
      </BottomFixedContainer>
    </div>
  );
}

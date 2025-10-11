"use client";

import React from "react";
import Button from "../../components/Button";
import styles from "./page.module.css";

const ButtonCustomDemo = () => {
  // 创建一些简单的 SVG 图标用于演示
  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M15.707 14.293l-4.822-4.822a6.018 6.018 0 1 0-1.414 1.414l4.822 4.822a1 1 0 0 0 1.414-1.414zM6 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    </svg>
  );

  const HeartIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 14s-6-3.5-6-9c0-1.5 1.5-3 3-3 1 0 2 .5 2.5 1.5.5-1 1.5-1.5 2.5-1.5 1.5 0 3 1.5 3 3 0 5.5-6 9-6 9z" />
    </svg>
  );

  const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 13.25l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 7.355a.75.75 0 01.416-1.28l4.21-.611L7.327.649A.75.75 0 018 .25z" />
    </svg>
  );

  return (
    <div className={styles.container}>
      <h1>Button 组件图标功能演示</h1>

      <div className={styles.section}>
        <h2>基础图标按钮</h2>
        <div className={styles.buttonGroup}>
          <Button icon={<SearchIcon />}>搜索</Button>
          <Button icon={<HeartIcon />} variant="outlined">
            喜欢
          </Button>
          <Button icon={<StarIcon />} themeColor="#FFA500">
            评分
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>图标位置</h2>
        <div className={styles.buttonGroup}>
          <Button icon={<SearchIcon />} iconPosition="left">
            左侧图标
          </Button>
          <Button icon={<SearchIcon />} iconPosition="right">
            右侧图标
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>仅图标按钮</h2>
        <div className={styles.buttonGroup}>
          <Button icon={<SearchIcon />} width={40} height={40} />
          <Button
            icon={<HeartIcon />}
            variant="outlined"
            width={40}
            height={40}
          />
          <Button
            icon={<StarIcon />}
            themeColor="#FFA500"
            width={40}
            height={40}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h2>不同尺寸的图标按钮</h2>
        <div className={styles.buttonGroup}>
          <Button icon={<SearchIcon />} width={120} height={30}>
            小号按钮
          </Button>
          <Button icon={<SearchIcon />} width={160} height={40}>
            默认按钮
          </Button>
          <Button icon={<SearchIcon />} width={200} height={50}>
            大号按钮
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>禁用状态的图标按钮</h2>
        <div className={styles.buttonGroup}>
          <Button icon={<SearchIcon />} disabled>
            禁用按钮
          </Button>
          <Button icon={<HeartIcon />} variant="outlined" disabled>
            禁用按钮
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonCustomDemo;

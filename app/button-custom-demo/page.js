"use client";

import React, { useState } from "react";
import Button from "../../components/Button";
import styles from "./page.module.css";

/**
 * Button Demo 页面
 * 访问路径: /button-custom-demo
 */
export default function ButtonCustomDemo() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🎨 自定义按钮组件 Demo</h1>
        <p className={styles.subtitle}>
          支持多种样式、主题颜色、尺寸定制和交互状态
        </p>
      </div>

      <div className={styles.content}>
        {/* 示例1: 两种基本样式 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎭 基本样式</h2>
          <div className={styles.buttonGroup}>
            <div className={styles.buttonItem}>
              <h3 className={styles.itemTitle}>Filled（有色背景）</h3>
              <Button variant="filled">Filled Button</Button>
            </div>
            <div className={styles.buttonItem}>
              <h3 className={styles.itemTitle}>Outlined（白色背景+边框）</h3>
              <Button variant="outlined">
                Outlined Button
              </Button>
            </div>
          </div>
        </section>

        {/* 示例2: 不同主题颜色 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🌈 主题颜色</h2>
          <div className={styles.colorDemo}>
            <div className={styles.colorGroup}>
              <h3 className={styles.groupTitle}>Filled 样式</h3>
              <div className={styles.buttonRow}>
                <Button variant="filled" themeColor="#1890ff">
                  蓝色主题
                </Button>
                <Button variant="filled" themeColor="#52c41a">
                  绿色主题
                </Button>
                <Button variant="filled" themeColor="#ff4d4f">
                  红色主题
                </Button>
                <Button variant="filled" themeColor="#faad14">
                  橙色主题
                </Button>
                <Button variant="filled" themeColor="#722ed1">
                  紫色主题
                </Button>
                <Button variant="filled" themeColor="#13c2c2">
                  青色主题
                </Button>
              </div>
            </div>
            <div className={styles.colorGroup}>
              <h3 className={styles.groupTitle}>Outlined 样式</h3>
              <div className={styles.buttonRow}>
                <Button variant="outlined" themeColor="#1890ff">
                  蓝色主题
                </Button>
                <Button variant="outlined" themeColor="#52c41a">
                  绿色主题
                </Button>
                <Button variant="outlined" themeColor="#ff4d4f">
                  红色主题
                </Button>
                <Button variant="outlined" themeColor="#faad14">
                  橙色主题
                </Button>
                <Button variant="outlined" themeColor="#722ed1">
                  紫色主题
                </Button>
                <Button variant="outlined" themeColor="#13c2c2">
                  青色主题
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 示例3: 自定义 hover 和 active 颜色 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎨 自定义交互颜色</h2>
          <p className={styles.description}>鼠标悬停和点击时显示不同的颜色</p>
          <div className={styles.buttonRow}>
            <Button
              variant="filled"
              themeColor="#1890ff"
              hoverColor="#40a9ff"
              activeColor="#096dd9"
            >
              自定义 Hover/Active
            </Button>
            <Button
              variant="outlined"
              themeColor="#52c41a"
              hoverColor="#73d13d"
              activeColor="#389e0d"
            >
              绿色渐变效果
            </Button>
            <Button
              variant="filled"
              themeColor="#722ed1"
              hoverColor="#9254de"
              activeColor="#531dab"
            >
              紫色渐变效果
            </Button>
            <Button
              variant="outlined"
              themeColor="#ff4d4f"
              hoverColor="#ff7875"
              activeColor="#d9363e"
            >
              红色渐变效果
            </Button>
          </div>
        </section>

        {/* 示例4: 自定义尺寸 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📏 自定义尺寸</h2>
          <div className={styles.sizeDemo}>
            <div className={styles.sizeGroup}>
              <h3 className={styles.groupTitle}>高度变化</h3>
              <div className={styles.buttonRow}>
                <Button variant="filled" height="32px">
                  小按钮
                </Button>
                <Button variant="filled" height="40px">
                  中按钮
                </Button>
                <Button variant="filled" height="48px">
                  大按钮
                </Button>
                <Button variant="filled" height="56px">
                  超大按钮
                </Button>
              </div>
            </div>
            <div className={styles.sizeGroup}>
              <h3 className={styles.groupTitle}>宽度变化</h3>
              <div className={styles.buttonColumn}>
                <Button variant="outlined" width="120px">
                  固定120px
                </Button>
                <Button variant="outlined" width="200px">
                  固定200px
                </Button>
                <Button variant="outlined" width="300px">
                  固定300px
                </Button>
                <Button variant="outlined" width="100%">
                  全宽按钮
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 示例5: 禁用状态 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🚫 禁用状态</h2>
          <div className={styles.buttonRow}>
            <Button variant="filled" disabled>
              禁用 Filled
            </Button>
            <Button variant="outlined" disabled>
              禁用 Outlined
            </Button>
            <Button variant="filled" themeColor="#52c41a" disabled>
              禁用绿色按钮
            </Button>
            <Button variant="outlined" themeColor="#ff4d4f" disabled>
              禁用红色按钮
            </Button>
          </div>
        </section>

        {/* 示例6: 综合应用 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>⚡ 综合应用</h2>
          <div className={styles.appDemo}>
            <div className={styles.card}>
              <h3>用户操作面板</h3>
              <p>点击次数: {clickCount}</p>
              <div className={styles.actionButtons}>
                <Button
                  variant="filled"
                  themeColor="#1890ff"
                  width="100px"
                  onClick={() => setClickCount(clickCount + 1)}
                >
                  增加
                </Button>
                <Button
                  variant="outlined"
                  themeColor="#ff4d4f"
                  width="100px"
                  onClick={() => setClickCount(Math.max(0, clickCount - 1))}
                >
                  减少
                </Button>
                <Button
                  variant="outlined"
                  themeColor="#52c41a"
                  width="100px"
                  onClick={() => setClickCount(0)}
                >
                  重置
                </Button>
              </div>
            </div>

            <div className={styles.card}>
              <h3>表单提交示例</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("表单提交成功！");
                }}
              >
                <input
                  type="text"
                  placeholder="请输入内容"
                  className={styles.input}
                />
                <div className={styles.formButtons}>
                  <Button
                    type="submit"
                    variant="filled"
                    themeColor="#52c41a"
                    width="120px"
                    height="40px"
                  >
                    提交
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    themeColor="#d9d9d9"
                    width="120px"
                    height="40px"
                    onClick={() => alert("取消操作")}
                  >
                    取消
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* 示例7: 组合样式 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>💎 组合样式</h2>
          <div className={styles.combinedDemo}>
            <Button
              variant="filled"
              themeColor="#1890ff"
              width="200px"
              height="50px"
              style={{
                fontSize: "18px",
                borderRadius: "25px",
                fontWeight: "600",
              }}
            >
              圆角大按钮
            </Button>
            <Button
              variant="outlined"
              themeColor="#722ed1"
              width="180px"
              height="45px"
              style={{
                fontSize: "16px",
                borderRadius: "8px",
                letterSpacing: "2px",
              }}
            >
              特殊样式
            </Button>
            <Button
              variant="filled"
              themeColor="#ff4d4f"
              width="160px"
              height="48px"
              style={{
                fontSize: "16px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              Danger
            </Button>
          </div>
        </section>
      </div>

      {/* 使用说明 */}
      <div className={styles.footer}>
        <h3>💡 使用说明</h3>
        <div className={styles.usage}>
          <div className={styles.usageItem}>
            <h4>基本用法</h4>
            <pre>{`<Button variant="filled">按钮文字</Button>
<Button variant="outlined">按钮文字</Button>`}</pre>
          </div>
          <div className={styles.usageItem}>
            <h4>自定义颜色</h4>
            <pre>{`<Button 
  variant="filled" 
  themeColor="#1890ff"
  hoverColor="#40a9ff"
  activeColor="#096dd9"
>
  按钮文字
</Button>`}</pre>
          </div>
          <div className={styles.usageItem}>
            <h4>自定义尺寸</h4>
            <pre>{`<Button 
  variant="outlined" 
  width="200px" 
  height="48px"
>
  按钮文字
</Button>`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

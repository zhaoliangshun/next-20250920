'use client';
import React, { useState } from 'react';
import AnimatedRadioGroup from '../../components/AnimatedRadioGroup';
import styles from './page.module.css';

export default function RadioGroupDemo() {
  const [selectedValue1, setSelectedValue1] = useState('option1');
  const [selectedValue2, setSelectedValue2] = useState('medium');
  const [selectedValue3, setSelectedValue3] = useState('home');

  const basicOptions = [
    { label: '选项一', value: 'option1' },
    { label: '选项二', value: 'option2' },
    { label: '选项三', value: 'option3' },
  ];

  const sizeOptions = [
    { label: '小', value: 'small' },
    { label: '中', value: 'medium' },
    { label: '大', value: 'large' },
    { label: '超大', value: 'extra-large' },
  ];

  const navigationOptions = [
    { label: '首页', value: 'home' },
    { label: '产品', value: 'products' },
    { label: '服务', value: 'services' },
    { label: '关于我们', value: 'about' },
    { label: '联系方式', value: 'contact' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>动画单选按钮组演示</h1>
        <p>展示不同样式的单选按钮组，带有流畅的移动动画效果</p>
      </div>

      <div className={styles.demos}>
        {/* Pill 样式 */}
        <div className={styles.demoSection}>
          <h2>Pill 样式</h2>
          <p>圆润的胶囊形状，适合现代化界面</p>
          <AnimatedRadioGroup
            options={basicOptions}
            value={selectedValue1}
            onChange={setSelectedValue1}
            variant="pill"
            name="demo1"
          />
          <div className={styles.result}>
            当前选择: <strong>{selectedValue1}</strong>
          </div>
        </div>

        {/* Button 样式 */}
        <div className={styles.demoSection}>
          <h2>Button 样式</h2>
          <p>类似按钮的外观，适合功能性选择</p>
          <AnimatedRadioGroup
            options={sizeOptions}
            value={selectedValue2}
            onChange={setSelectedValue2}
            variant="button"
            name="demo2"
          />
          <div className={styles.result}>
            当前选择: <strong>{selectedValue2}</strong>
          </div>
        </div>

        {/* Underline 样式 */}
        <div className={styles.demoSection}>
          <h2>Underline 样式</h2>
          <p>下划线样式，适合导航或标签页</p>
          <AnimatedRadioGroup
            options={navigationOptions}
            value={selectedValue3}
            onChange={setSelectedValue3}
            variant="underline"
            name="demo3"
          />
          <div className={styles.result}>
            当前选择: <strong>{selectedValue3}</strong>
          </div>
        </div>

        {/* 功能特性说明 */}
        <div className={styles.features}>
          <h2>功能特性</h2>
          <ul>
            <li>✨ 流畅的移动动画效果</li>
            <li>🎨 三种不同的视觉样式</li>
            <li>📱 响应式设计，适配移动端</li>
            <li>♿ 支持键盘导航和无障碍访问</li>
            <li>🌙 支持深色主题</li>
            <li>⚡ 高性能的 CSS 动画</li>
            <li>🔧 易于自定义和扩展</li>
          </ul>
        </div>

        {/* 使用示例代码 */}
        <div className={styles.codeExample}>
          <h2>使用示例</h2>
          <pre>
            <code>{`import AnimatedRadioGroup from './components/AnimatedRadioGroup';

const options = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' },
];

<AnimatedRadioGroup
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  variant="pill" // 'pill', 'button', 'underline'
  name="my-radio-group"
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
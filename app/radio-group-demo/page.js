'use client';
import React, { useState } from 'react';
import AnimatedRadioGroup from '../../components/AnimatedRadioGroup';
import styles from './page.module.css';

export default function RadioGroupDemo() {
    const [selectedValue1, setSelectedValue1] = useState('option1');
    const [selectedValue2, setSelectedValue2] = useState('button1');

    const basicOptions = [
        { label: '选项一', value: 'option1' },
        { label: '选项二', value: 'option2' }
    ];

    const compactOptions = [
        { label: '按钮1', value: 'button1' },
        { label: '按钮2', value: 'button2' },
        { label: '按钮3', value: 'button3' },
        { label: '按钮4', value: 'button4' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>动画单选按钮组演示</h1>
                <p>紧凑精致的单选按钮组，带有流畅的移动动画效果</p>
            </div>

            <div className={styles.demos}>
                {/* 基础样式 */}
                <div className={styles.demoSection}>
                    <h2>基础样式</h2>
                    <p>紧凑的胶囊形状，适合精致的界面设计</p>
                    <AnimatedRadioGroup
                        options={basicOptions}
                        value={selectedValue1}
                        onChange={setSelectedValue1}
                        name="demo1"
                    />
                    <div className={styles.result}>
                        当前选择: <strong>{selectedValue1}</strong>
                    </div>
                </div>

                {/* 多选项按钮组 */}
                <div className={styles.demoSection}>
                    <h2>多选项按钮组</h2>
                    <p>适合空间有限的界面，保持紧凑美观</p>
                    <AnimatedRadioGroup
                        options={compactOptions}
                        value={selectedValue2}
                        onChange={setSelectedValue2}
                        name="compact-demo"
                    />
                    <div className={styles.result}>
                        当前选择: <strong>{selectedValue2}</strong>
                    </div>
                </div>

                {/* 功能特性说明 */}
                <div className={styles.features}>
                    <h2>功能特性</h2>
                    <ul>
                        <li>✨ 流畅的移动动画效果</li>
                        <li>🎨 紧凑精致的设计</li>
                        <li>📱 响应式设计，适配移动端</li>
                        <li>♿ 支持键盘导航和无障碍访问</li>
                        <li>🌙 支持深色主题</li>
                        <li>⚡ 高性能的 CSS 动画</li>
                        <li>🔧 易于自定义和扩展</li>
                        <li>📏 小尺寸设计，节省空间</li>
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

// 基本用法
<AnimatedRadioGroup
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  name="my-radio-group"
/>`}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
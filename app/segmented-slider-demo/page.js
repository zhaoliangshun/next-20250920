'use client';

import React, { useState } from 'react';
import SegmentedSlider from '../../components/SegmentedSlider';
import styles from './page.module.css';

const SegmentedSliderDemo = () => {
    const [rangeValue, setRangeValue] = useState([0, 100]);

    // 定义区间配置 - 明确展示间隙点
    const segments = [
        { start: 0, end: 20, color: '#52c41a' },    // 区间1: 0-20
        { start: 25, end: 50, color: '#1890ff' },   // 区间2: 25-50 (与区间1有5个单位的间隙)
        { start: 55, end: 75, color: '#faad14' },   // 区间3: 55-75 (与区间2有5个单位的间隙)
        { start: 80, end: 100, color: '#f5222d' }   // 区间4: 80-100 (与区间3有5个单位的间隙)
    ];

    return (
        <div className={styles.container}>
            <h1>分段式滑块演示（仅区间选择）</h1>
            <p>每个区间有不同的背景颜色，只能在区间的起点和终点选中</p>

            <div className={styles.sliderContainer}>
                <h2>区间选择滑块</h2>
                <SegmentedSlider
                    segments={segments}
                    defaultValue={[0, 100]}
                    onChange={setRangeValue}
                />
                <p>当前区间: {rangeValue[0]} - {rangeValue[1]}</p>
            </div>

            <div className={styles.sliderContainer}>
                <h2>受控区间选择滑块</h2>
                <SegmentedSlider
                    segments={segments}
                    value={rangeValue}
                    onChange={setRangeValue}
                />
                <p>当前区间: {rangeValue[0]} - {rangeValue[1]}</p>
            </div>

            <div className={styles.sliderContainer}>
                <h2>禁用状态（区间模式）</h2>
                <SegmentedSlider
                    segments={segments}
                    defaultValue={[20, 75]}
                    disabled={true}
                />
            </div>

            <div className={styles.codeExample}>
                <h3>使用示例:</h3>
                <pre>
                    {`// 区间配置示例 - 展示间隙点处理
const segments = [
  { start: 0, end: 20, color: '#52c41a' },    // 区间1: 0-20
  { start: 25, end: 50, color: '#1890ff' },   // 区间2: 25-50 (5个单位间隙)
  { start: 55, end: 75, color: '#faad14' },   // 区间3: 55-75 (5个单位间隙)
  { start: 80, end: 100, color: '#f5222d' }   // 区间4: 80-100 (5个单位间隙)
];

// 区间模式
<SegmentedSlider 
  segments={segments}
  defaultValue={[0, 100]}
  onChange={setRangeValue}
/>`}
                </pre>
            </div>
        </div>
    );
};

export default SegmentedSliderDemo;
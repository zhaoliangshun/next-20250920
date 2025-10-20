'use client';

import React, { useState } from 'react';
import SegmentedSlider from '../../components/SegmentedSlider';
import styles from './page.module.css';

const SegmentedSliderDemo = () => {
    const [value, setValue] = useState(0);
    const [rangeValue, setRangeValue] = useState([0, 100]);

    // 定义区间配置
    const segments = [
        { start: 0, end: 20, color: '#52c41a', gapBefore: 0, gapAfter: 2 },
        { start: 22, end: 50, color: '#1890ff', gapBefore: 2, gapAfter: 3 },
        { start: 53, end: 75, color: '#faad14', gapBefore: 3, gapAfter: 3 },
        { start: 78, end: 100, color: '#f5222d', gapBefore: 3, gapAfter: 0 }
    ];

    return (
        <div className={styles.container}>
            <h1>分段式滑块演示</h1>
            <p>每个区间有不同的背景颜色，只能在区间的起点和终点选中</p>

            <div className={styles.sliderContainer}>
                <h2>基础分段滑块</h2>
                <SegmentedSlider
                    segments={segments}
                    defaultValue={0}
                    onChange={setValue}
                />
                <p>当前值: {value}</p>
            </div>

            <div className={styles.sliderContainer}>
                <h2>受控分段滑块</h2>
                <SegmentedSlider
                    segments={segments}
                    value={value}
                    onChange={setValue}
                />
                <p>当前值: {value}</p>
            </div>

            <div className={styles.sliderContainer}>
                <h2>区间选择滑块</h2>
                <SegmentedSlider
                    segments={segments}
                    range={true}
                    defaultValue={[20, 75]}
                    onChange={setRangeValue}
                />
                <p>当前区间: {rangeValue[0]} - {rangeValue[1]}</p>
            </div>

            <div className={styles.sliderContainer}>
                <h2>受控区间选择滑块</h2>
                <SegmentedSlider
                    segments={segments}
                    range={true}
                    value={rangeValue}
                    onChange={setRangeValue}
                />
                <p>当前区间: {rangeValue[0]} - {rangeValue[1]}</p>
            </div>

            <div className={styles.sliderContainer}>
                <h2>禁用状态</h2>
                <SegmentedSlider
                    segments={segments}
                    defaultValue={20}
                    disabled={true}
                />
            </div>

            <div className={styles.sliderContainer}>
                <h2>禁用状态（区间模式）</h2>
                <SegmentedSlider
                    segments={segments}
                    range={true}
                    defaultValue={[20, 75]}
                    disabled={true}
                />
            </div>

            <div className={styles.codeExample}>
                <h3>使用示例:</h3>
                <pre>
                    {`// 基础模式
const segments = [
  { start: 0, end: 20, color: '#52c41a' },
  { start: 22, end: 50, color: '#1890ff' },
  { start: 53, end: 75, color: '#faad14' },
  { start: 78, end: 100, color: '#f5222d' }
];

<SegmentedSlider 
  segments={segments}
  defaultValue={0}
  onChange={setValue}
/>

// 区间选择模式
<SegmentedSlider 
  segments={segments}
  range={true}
  defaultValue={[20, 75]}
  onChange={setRangeValue}
/>`}
                </pre>
            </div>
        </div>
    );
};

export default SegmentedSliderDemo;
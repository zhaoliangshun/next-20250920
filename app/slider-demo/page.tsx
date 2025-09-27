'use client';

import { useState } from 'react';
import EnhancedSlider from '../../components/EnhancedSlider';
import styles from './page.module.css';

export default function SliderDemo() {
  const [singleValue, setSingleValue] = useState(30);
  const [rangeValue, setRangeValue] = useState([20, 80]);
  const [stepsValue, setStepsValue] = useState(25);
  const [marksValue, setMarksValue] = useState(50);
  const [verticalValue, setVerticalValue] = useState(40);
  const [themeValue, setThemeValue] = useState([10, 90]);
  
  // 标记配置
  const marks = {
    0: '0°C',
    25: '25°C',
    50: '50°C',
    75: '75°C',
    100: '100°C',
  };
  
  // 区间颜色配置
  const ranges = [
    { start: 0, end: 30, color: '#52c41a' },
    { start: 30, end: 70, color: '#faad14' },
    { start: 70, end: 100, color: '#f5222d' },
  ];
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>增强型滑块组件演示</h1>
      
      <section className={styles.section}>
        <h2>基础滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider 
            value={singleValue} 
            onChange={setSingleValue} 
            tooltip={{ formatter: (value) => `${value}%` }}
          />
          <div className={styles.value}>当前值: {singleValue}</div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2>范围滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider 
            range 
            value={rangeValue} 
            onChange={setRangeValue} 
          />
          <div className={styles.value}>当前值: [{rangeValue.join(', ')}]</div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2>步长滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider 
            value={stepsValue} 
            onChange={setStepsValue} 
            step={5}
          />
          <div className={styles.value}>当前值: {stepsValue} (步长: 5)</div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2>带标记滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider 
            value={marksValue} 
            onChange={setMarksValue} 
            marks={marks}
          />
          <div className={styles.value}>当前值: {marksValue}</div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2>垂直滑块</h2>
        <div className={styles.verticalContainer}>
          <EnhancedSlider 
            value={verticalValue} 
            onChange={setVerticalValue} 
            vertical
            style={{ height: 300 }}
          />
          <div className={styles.value}>当前值: {verticalValue}</div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2>主题滑块</h2>
        <div className={styles.themeContainer}>
          <div className={styles.themeSlider}>
            <h3>默认主题</h3>
            <EnhancedSlider 
              range 
              value={themeValue} 
              onChange={setThemeValue} 
              theme="default"
            />
          </div>
          
          <div className={styles.themeSlider}>
            <h3>成功主题</h3>
            <EnhancedSlider 
              range 
              value={themeValue} 
              onChange={setThemeValue} 
              theme="success"
            />
          </div>
          
          <div className={styles.themeSlider}>
            <h3>警告主题</h3>
            <EnhancedSlider 
              range 
              value={themeValue} 
              onChange={setThemeValue} 
              theme="warning"
            />
          </div>
          
          <div className={styles.themeSlider}>
            <h3>危险主题</h3>
            <EnhancedSlider 
              range 
              value={themeValue} 
              onChange={setThemeValue} 
              theme="danger"
            />
          </div>
          
          <div className={styles.themeSlider}>
            <h3>自定义主题</h3>
            <EnhancedSlider 
              range 
              value={themeValue} 
              onChange={setThemeValue} 
              theme="custom"
              trackColor="#8e44ad"
              handleColor="#8e44ad"
            />
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2>区间颜色滑块</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider 
            value={singleValue} 
            onChange={setSingleValue} 
            ranges={ranges}
          />
          <div className={styles.value}>当前值: {singleValue}</div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2>禁用状态</h2>
        <div className={styles.sliderContainer}>
          <EnhancedSlider 
            value={50} 
            disabled
          />
          <div className={styles.value}>禁用状态</div>
        </div>
      </section>
    </div>
  );
}
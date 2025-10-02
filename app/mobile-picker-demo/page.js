"use client";

import React, { useState } from "react";
import MobilePicker from "../../components/MobilePicker";
import styles from "./page.module.css";

/**
 * MobilePicker Demo 页面
 * 访问路径: /mobile-picker-demo
 */
export default function MobilePickerDemo() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // 城市选项
  const cityOptions = [
    { label: "北京", value: "beijing" },
    { label: "上海", value: "shanghai" },
    { label: "广州", value: "guangzhou" },
    { label: "深圳", value: "shenzhen" },
    { label: "杭州", value: "hangzhou" },
    { label: "成都", value: "chengdu" },
    { label: "重庆", value: "chongqing" },
    { label: "武汉", value: "wuhan" },
    { label: "西安", value: "xian" },
    { label: "南京", value: "nanjing" },
    { label: "天津", value: "tianjin" },
    { label: "苏州", value: "suzhou" },
    { label: "郑州", value: "zhengzhou" },
    { label: "长沙", value: "changsha" },
    { label: "沈阳", value: "shenyang" },
  ];

  // 年份选项 (2000-2049)
  const yearOptions = Array.from({ length: 50 }, (_, i) => {
    const year = 2000 + i;
    return { label: `${year}年`, value: year };
  });

  // 月份选项
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { label: `${month}月`, value: month };
  });

  // 日期选项
  const dayOptions = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return { label: `${day}日`, value: day };
  });

  // 水果选项
  const fruitOptions = [
    { label: "🍎 苹果", value: "apple" },
    { label: "🍌 香蕉", value: "banana" },
    { label: "🍊 橙子", value: "orange" },
    { label: "🍇 葡萄", value: "grape" },
    { label: "🍓 草莓", value: "strawberry" },
    { label: "🍉 西瓜", value: "watermelon" },
    { label: "🍑 桃子", value: "peach" },
    { label: "🥝 猕猴桃", value: "kiwi" },
    { label: "🍍 菠萝", value: "pineapple" },
    { label: "🥭 芒果", value: "mango" },
  ];

  // 时间选项 (小时)
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    return { label: `${i.toString().padStart(2, "0")}时`, value: i };
  });

  // 分钟选项
  const minuteOptions = Array.from({ length: 60 }, (_, i) => {
    return { label: `${i.toString().padStart(2, "0")}分`, value: i };
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📱 移动端选择器 Demo</h1>
        <p className={styles.subtitle}>
          支持滑动选择，选中项高亮，远离项渐变透明
        </p>
      </div>

      <div className={styles.content}>
        {/* 示例1: 城市选择 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏙️ 城市选择</h2>
          <div className={styles.pickerWrapper}>
            <MobilePicker
              options={cityOptions}
              value={selectedCity?.value}
              onChange={(option) => setSelectedCity(option)}
              visibleCount={5}
              itemHeight={44}
              placeholder="请选择城市"
            />
          </div>
          <div className={styles.result}>
            <span className={styles.label}>已选择:</span>
            <span className={styles.value}>
              {selectedCity ? selectedCity.label : "未选择"}
            </span>
          </div>
        </section>

        {/* 示例2: 日期选择（三列） */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📅 日期选择</h2>
          <div className={styles.datePickerGroup}>
            <div className={styles.datePickerItem}>
              <label className={styles.dateLabel}>年</label>
              <MobilePicker
                options={yearOptions}
                defaultValue={2024}
                onChange={(option) => setSelectedYear(option)}
                visibleCount={5}
                itemHeight={40}
              />
            </div>
            <div className={styles.datePickerItem}>
              <label className={styles.dateLabel}>月</label>
              <MobilePicker
                options={monthOptions}
                defaultValue={10}
                onChange={(option) => setSelectedMonth(option)}
                visibleCount={5}
                itemHeight={40}
              />
            </div>
            <div className={styles.datePickerItem}>
              <label className={styles.dateLabel}>日</label>
              <MobilePicker
                options={dayOptions}
                defaultValue={2}
                onChange={(option) => setSelectedDay(option)}
                visibleCount={5}
                itemHeight={40}
              />
            </div>
          </div>
          <div className={styles.result}>
            <span className={styles.label}>已选择:</span>
            <span className={styles.value}>
              {selectedYear && selectedMonth && selectedDay
                ? `${selectedYear.value}年${selectedMonth.value}月${selectedDay.value}日`
                : "未完整选择"}
            </span>
          </div>
        </section>

        {/* 示例3: 水果选择（带 Emoji） */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🍓 水果选择</h2>
          <div className={styles.pickerWrapper}>
            <MobilePicker
              options={fruitOptions}
              onChange={(option) => setSelectedFruit(option)}
              visibleCount={5}
              itemHeight={50}
              placeholder="请选择水果"
            />
          </div>
          <div className={styles.result}>
            <span className={styles.label}>已选择:</span>
            <span className={styles.value}>
              {selectedFruit ? selectedFruit.label : "未选择"}
            </span>
          </div>
        </section>

        {/* 示例4: 时间选择（两列） */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>⏰ 时间选择</h2>
          <div className={styles.timePickerGroup}>
            <div className={styles.timePickerItem}>
              <MobilePicker
                options={hourOptions}
                defaultValue={12}
                onChange={(option) => console.log("小时:", option)}
                visibleCount={7}
                itemHeight={40}
              />
            </div>
            <div className={styles.timeSeparator}>:</div>
            <div className={styles.timePickerItem}>
              <MobilePicker
                options={minuteOptions}
                defaultValue={30}
                onChange={(option) => setSelectedTime(option)}
                visibleCount={7}
                itemHeight={40}
              />
            </div>
          </div>
        </section>

        {/* 示例5: 不同可见数量 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎛️ 可见项数量对比</h2>
          <div className={styles.compareGroup}>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>3项可见</h3>
              <MobilePicker
                options={fruitOptions}
                visibleCount={3}
                itemHeight={50}
              />
            </div>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>7项可见</h3>
              <MobilePicker
                options={fruitOptions}
                visibleCount={7}
                itemHeight={40}
              />
            </div>
          </div>
        </section>

        {/* 示例6: 自定义样式 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎨 自定义样式</h2>
          <div className={styles.pickerWrapper}>
            <MobilePicker
              options={cityOptions}
              onChange={(option) => console.log("自定义样式:", option)}
              visibleCount={5}
              itemHeight={48}
              style={{
                border: "2px solid #1890ff",
                borderRadius: "12px",
                backgroundColor: "#f0f8ff",
                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.15)",
              }}
            />
          </div>
        </section>

        {/* 示例7: 禁用状态 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🚫 禁用状态</h2>
          <div className={styles.pickerWrapper}>
            <MobilePicker
              options={cityOptions}
              defaultValue="beijing"
              disabled={true}
              visibleCount={5}
              itemHeight={44}
            />
          </div>
        </section>
      </div>

      {/* 使用说明 */}
      <div className={styles.footer}>
        <h3>💡 使用提示</h3>
        <ul className={styles.tips}>
          <li>支持鼠标拖动和触摸滑动</li>
          <li>快速滑动会有惯性效果</li>
          <li>选中项为黑色粗体，离选中项越远颜色越淡</li>
          <li>点击任意项可直接选中</li>
          <li>滑动到边界时有阻尼效果</li>
        </ul>
      </div>
    </div>
  );
}

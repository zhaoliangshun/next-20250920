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

  const levelOptions = [
    { label: "A+", value: "A+" },
    { label: "A", value: "A" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B", value: "B" },
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
        {/* 测试页面链接 */}
        <section className={styles.section} style={{ textAlign: 'center', marginBottom: '20px' }}>
          <a
            href="/mobile-picker-demo/test-page"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            前往拖动点击测试页面
          </a>
        </section>
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
        示例7: 上下不对称显示
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>⬆️⬇️ 上下不对称显示</h2>
          <p
            style={{ color: "#666", marginBottom: "20px", textAlign: "center" }}
          >
            支持自定义上方和下方显示的项数，默认选中第一项
          </p>
          <div className={styles.compareGroup}>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>上2下2（默认第一项）</h3>
              <MobilePicker
                options={fruitOptions}
                visibleCountAbove={2}
                visibleCountBelow={2}
                itemHeight={44}
                defaultValue={fruitOptions[0]?.value}
              />
            </div>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>上1下3</h3>
              <MobilePicker
                options={cityOptions}
                visibleCountAbove={1}
                visibleCountBelow={4}
                itemHeight={44}
                defaultValue={cityOptions[0]?.value}
              />
            </div>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>上3下1</h3>
              <MobilePicker
                options={cityOptions}
                visibleCountAbove={3}
                visibleCountBelow={1}
                itemHeight={44}
                defaultValue={cityOptions[0]?.value}
              />
            </div>
          </div>
        </section>
        {/* 示例8: 自定义每项样式 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎨 自定义每项样式</h2>
          <p
            style={{ color: "#666", marginBottom: "20px", textAlign: "center" }}
          >
            可以单独设置每一项的颜色、字体大小和其他样式，无需计算渐变
          </p>
          <div className={styles.compareGroup}>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>自定义颜色</h3>
              <MobilePicker
                options={[
                  { label: "红色项", value: "red", color: "#ff0000" },
                  { label: "蓝色项", value: "blue", color: "#0000ff" },
                  { label: "绿色项", value: "green", color: "#00aa00" },
                  { label: "橙色项", value: "orange", color: "#ff8800" },
                  { label: "紫色项", value: "purple", color: "#aa00aa" },
                ]}
                visibleCount={5}
                itemHeight={44}
                defaultValue="red"
              />
            </div>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>自定义字体大小</h3>
              <MobilePicker
                options={[
                  { label: "12px", value: "12", fontSize: "12px" },
                  { label: "16px", value: "16", fontSize: "16px" },
                  { label: "20px", value: "20", fontSize: "20px" },
                  { label: "24px", value: "24", fontSize: "24px" },
                  { label: "28px", value: "28", fontSize: "28px" },
                ]}
                visibleCount={5}
                itemHeight={44}
                defaultValue="20"
              />
            </div>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>混合自定义</h3>
              <MobilePicker
                options={[
                  {
                    label: "重要",
                    value: "important",
                    color: "#ff0000",
                    fontSize: "18px",
                    customStyle: { fontWeight: 700 },
                  },
                  {
                    label: "普通",
                    value: "normal",
                    color: "#333333",
                    fontSize: "16px",
                  },
                  {
                    label: "次要",
                    value: "secondary",
                    color: "#999999",
                    fontSize: "14px",
                  },
                  {
                    label: "禁用",
                    value: "disabled",
                    color: "#cccccc",
                    fontSize: "14px",
                    customStyle: { textDecoration: "line-through" },
                  },
                ]}
                visibleCount={5}
                itemHeight={44}
                defaultValue="normal"
              />
            </div>
          </div>
        </section>
        {/* 示例9: 对称样式配置 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>⚖️ 对称样式配置</h2>
          <p
            style={{ color: "#666", marginBottom: "20px", textAlign: "center" }}
          >
            以选中项为中心，上下对称位置的项目具有相同的颜色和字体大小
          </p>
          <div className={styles.compareGroup}>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>渐变对称样式</h3>
              <MobilePicker
                options={cityOptions}
                visibleCount={5}
                itemHeight={44}
                defaultValue="beijing"
                symmetricStyles={[
                  {
                    distance: 0,
                    color: "#000000",
                    fontSize: "18px",
                    fontWeight: 600,
                    opacity: 1,
                  },
                  {
                    distance: 1,
                    color: "#333333",
                    fontSize: "16px",
                    fontWeight: 500,
                    opacity: 0.9,
                  },
                  {
                    distance: 2,
                    color: "#666666",
                    fontSize: "14px",
                    fontWeight: 400,
                    opacity: 0.7,
                  },
                  {
                    distance: 3,
                    color: "#999999",
                    fontSize: "12px",
                    fontWeight: 400,
                    opacity: 0.5,
                  },
                ]}
              />
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#999",
                  textAlign: "center",
                }}
              >
                距离0: 黑18px | 距离1: 灰16px | 距离2: 浅灰14px
              </div>
            </div>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>彩色对称样式</h3>
              <MobilePicker
                options={fruitOptions}
                visibleCount={5}
                itemHeight={48}
                defaultValue={fruitOptions[2]?.value}
                symmetricStyles={[
                  {
                    distance: 0,
                    color: "#ff0000",
                    fontSize: "20px",
                    fontWeight: 700,
                    scale: 1.1,
                  },
                  {
                    distance: 1,
                    color: "#ff6600",
                    fontSize: "18px",
                    fontWeight: 600,
                    scale: 1.05,
                  },
                  {
                    distance: 2,
                    color: "#0088ff",
                    fontSize: "16px",
                    fontWeight: 400,
                    scale: 1,
                  },
                ]}
              />
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#999",
                  textAlign: "center",
                }}
              >
                距离0: 红色20px | 距离1: 橙色18px | 距离2: 蓝色16px
              </div>
            </div>
            <div className={styles.compareItem}>
              <h3 className={styles.compareTitle}>简约对称样式</h3>
              <MobilePicker
                options={levelOptions}
                visibleCountAbove={0}
                visibleCountBelow={4}
                itemHeight={37}
                defaultValue={"A+"}
                labelWidth={14}
                labelAlign="left"
                symmetricStyles={[
                  {
                    distance: 0,
                    color: "#000000",
                    fontSize: "21px",
                    fontWeight: 700,
                  },
                  {
                    distance: 1,
                    color: "#8B8B8B",
                    fontSize: "21px",
                    fontWeight: 500,
                  },
                  {
                    distance: 2,
                    color: "#8B8B8B",
                    fontSize: "18px",
                    fontWeight: 500,
                  },
                  {
                    distance: 3,
                    color: "#CCCCCC",
                    fontSize: "16px",
                    fontWeight: 400,
                  },
                  {
                    distance: 4,
                    color: "#CCCCCC",
                    fontSize: "16px",
                    fontWeight: 400,
                  },
                ]}
              />
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#999",
                  textAlign: "center",
                }}
              >
                蓝色渐变：选中项最深，距离越远颜色越浅
              </div>
            </div>
          </div>
        </section>
        {/* 示例10: 禁用状态 */}
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
          <li>支持上下不对称显示，可自定义上方和下方显示的项数</li>
          <li>支持对称样式配置，上下对称位置的项目具有相同的颜色、字体大小</li>
          <li>可为每个项目单独设置颜色、字体大小和其他样式</li>
        </ul>
      </div>
    </div>
  );
}

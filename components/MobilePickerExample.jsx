"use client";

import React, { useState } from "react";
import MobilePicker from "./MobilePicker";

/**
 * MobilePicker 使用示例
 */
const MobilePickerExample = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFruit, setSelectedFruit] = useState(null);

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
  ];

  // 年份选项
  const yearOptions = Array.from({ length: 50 }, (_, i) => {
    const year = 2000 + i;
    return { label: `${year}年`, value: year };
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
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>移动端选择器示例</h1>

      {/* 示例1: 城市选择 */}
      <div style={{ marginBottom: "40px" }}>
        <h3>选择城市</h3>
        <MobilePicker
          options={cityOptions}
          value={selectedCity?.value}
          onChange={(option) => setSelectedCity(option)}
          visibleCount={5}
          itemHeight={44}
          placeholder="请选择城市"
        />
        <p style={{ marginTop: "10px", color: "#666" }}>
          已选择: {selectedCity ? selectedCity.label : "未选择"}
        </p>
      </div>

      {/* 示例2: 年份选择 */}
      <div style={{ marginBottom: "40px" }}>
        <h3>选择年份</h3>
        <MobilePicker
          options={yearOptions}
          defaultValue={2024}
          onChange={(option) => setSelectedYear(option)}
          visibleCount={7}
          itemHeight={40}
        />
        <p style={{ marginTop: "10px", color: "#666" }}>
          已选择: {selectedYear ? selectedYear.label : "未选择"}
        </p>
      </div>

      {/* 示例3: 水果选择 */}
      <div style={{ marginBottom: "40px" }}>
        <h3>选择水果</h3>
        <MobilePicker
          options={fruitOptions}
          onChange={(option) => setSelectedFruit(option)}
          visibleCount={5}
          itemHeight={50}
          placeholder="请选择水果"
        />
        <p style={{ marginTop: "10px", color: "#666" }}>
          已选择: {selectedFruit ? selectedFruit.label : "未选择"}
        </p>
      </div>

      {/* 示例4: 禁用状态 */}
      <div style={{ marginBottom: "40px" }}>
        <h3>禁用状态</h3>
        <MobilePicker
          options={cityOptions}
          defaultValue="beijing"
          disabled={true}
          visibleCount={5}
          itemHeight={44}
        />
      </div>

      {/* 示例5: 自定义样式 */}
      <div style={{ marginBottom: "40px" }}>
        <h3>自定义样式</h3>
        <MobilePicker
          options={fruitOptions}
          onChange={(option) => console.log("选中:", option)}
          visibleCount={3}
          itemHeight={60}
          style={{
            border: "2px solid #1890ff",
            borderRadius: "8px",
            backgroundColor: "#f0f8ff",
          }}
        />
      </div>
    </div>
  );
};

export default MobilePickerExample;

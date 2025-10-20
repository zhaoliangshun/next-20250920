"use client";

import React, { useState } from "react";
import MobilePicker from "../../components/MobilePicker";

export default function MobilePickerTest() {
    const [selectedValue, setSelectedValue] = useState(null);
    const [log, setLog] = useState([]);

    const options = [
        { label: "选项 1", value: "1" },
        { label: "选项 2", value: "2" },
        { label: "选项 3", value: "3" },
        { label: "选项 4", value: "4" },
        { label: "选项 5", value: "5" },
        { label: "选项 6", value: "6" },
        { label: "选项 7", value: "7" },
        { label: "选项 8", value: "8" },
        { label: "选项 9", value: "9" },
        { label: "选项 10", value: "10" },
    ];

    const handleLog = (message) => {
        setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h1>MobilePicker 拖动点击测试</h1>

            <div style={{ marginBottom: "20px" }}>
                <MobilePicker
                    options={options}
                    value={selectedValue}
                    onChange={(option) => {
                        setSelectedValue(option?.value);
                        handleLog(`选中: ${option?.label}`);
                    }}
                    visibleCount={5}
                    itemHeight={44}
                    placeholder="请选择"
                />
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>当前选中值: {selectedValue || "未选择"}</h3>
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>事件日志:</h3>
                <div style={{
                    height: "200px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f5f5f5"
                }}>
                    {log.map((entry, index) => (
                        <div key={index}>{entry}</div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: "20px" }}>
                <button onClick={() => setLog([])}>清空日志</button>
            </div>

            <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#e0f7fa" }}>
                <h3>测试说明:</h3>
                <p>1. 点击选项应该触发选中事件</p>
                <p>2. 拖动选项应该只触发滚动，不触发选中事件</p>
                <p>3. 快速拖动后点击选项应该正常工作</p>
            </div>
        </div>
    );
}
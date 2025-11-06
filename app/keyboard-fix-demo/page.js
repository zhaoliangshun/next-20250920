"use client";

import React, { useState } from "react";
import BottomFixedContainer from "../../components/BottomFixedContainer";
import { useKeyboardDetection } from "../../hooks/useKeyboardDetection";
import styles from "./page.module.css";

const KeyboardFixDemo = () => {
    const [inputValue, setInputValue] = useState("");
    const { isKeyboardOpen, keyboardHeight } = useKeyboardDetection();

    return (
        <div className={styles.container}>
            <h1>iOS 键盘覆盖问题解决方案</h1>

            <div className={styles.content}>
                <p>这是一个演示如何解决 iOS Safari 中虚拟键盘覆盖底部内容问题的示例。</p>

                <div className={styles.infoBox}>
                    <h3>键盘状态信息：</h3>
                    <p>键盘是否弹出: {isKeyboardOpen ? "是" : "否"}</p>
                    <p>键盘高度: {keyboardHeight}px</p>
                </div>

                <div className={styles.spacer}></div>

                {[...Array(30)].map((_, index) => (
                    <p key={index}>
                        这是第 {index + 1} 段内容，用于演示页面滚动效果。
                        在移动设备上滚动到页面底部并点击输入框查看键盘安全区域效果。
                    </p>
                ))}
            </div>

            {/* 使用底部固定容器组件 */}
            <BottomFixedContainer className={styles.bottomContainer}>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="点击我测试键盘安全区域..."
                        className={styles.input}
                    />
                    <button className={styles.button}>提交</button>
                </div>
            </BottomFixedContainer>
        </div>
    );
};

export default KeyboardFixDemo;
import React, { useEffect, useState } from 'react';
import styles from './BottomFixedContainer.module.css';

/**
 * 底部固定容器组件
 * 自动适配 iOS Safari 中虚拟键盘弹出时的布局问题
 */
const BottomFixedContainer = ({
    children,
    className = '',
    adjustForKeyboard = true,
    ...props
}) => {
    const [containerStyle, setContainerStyle] = useState({});

    useEffect(() => {
        // 仅在客户端执行
        if (typeof window === 'undefined' || !window.visualViewport) return;

        const viewport = window.visualViewport;
        let initialViewportHeight = viewport.height;

        // 设置初始样式
        const updateContainerStyle = () => {
            // 获取安全区域底部 inset
            const computedStyle = getComputedStyle(document.documentElement);
            const safeAreaBottom = parseFloat(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0;

            // 设置基础样式
            const baseStyle = {
                paddingBottom: `${safeAreaBottom}px`
            };

            // 如果不需要适配键盘，直接使用基础样式
            if (!adjustForKeyboard) {
                setContainerStyle(baseStyle);
                return;
            }

            // 计算键盘是否弹出
            const heightDiff = initialViewportHeight - viewport.height;
            const isKeyboardOpen = heightDiff > 100; // 阈值为100px

            if (isKeyboardOpen) {
                // 键盘弹出时，调整底部位置
                setContainerStyle({
                    ...baseStyle,
                    bottom: `${heightDiff}px`
                });
            } else {
                // 键盘收起时，使用默认样式
                setContainerStyle(baseStyle);
            }
        };

        // 初始化样式
        updateContainerStyle();

        // 监听 visualViewport 的 resize 事件
        const handleResize = () => {
            // 延迟执行以确保获取到正确的值
            setTimeout(updateContainerStyle, 100);
        };

        viewport.addEventListener('resize', handleResize);

        // 保存初始视口高度
        initialViewportHeight = viewport.height;

        // 清理事件监听器
        return () => {
            viewport.removeEventListener('resize', handleResize);
        };
    }, [adjustForKeyboard]);

    return (
        <div
            className={`${styles.container} ${className}`}
            style={containerStyle}
            {...props}
        >
            {children}
        </div>
    );
};

export default BottomFixedContainer;
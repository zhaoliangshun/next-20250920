import React, { useEffect, useState } from 'react';

/**
 * 键盘安全区域视图组件
 * 自动适配 iOS Safari 中虚拟键盘弹出时的布局问题
 */
const KeyboardSafeAreaView = ({
    children,
    className = '',
    style = {},
    position = 'bottom', // 'bottom' 或 'top'
    ...props
}) => {
    const [safeAreaStyle, setSafeAreaStyle] = useState({});

    useEffect(() => {
        // 仅在客户端执行
        if (typeof window === 'undefined') return;

        // 设置初始安全区域
        const updateSafeArea = () => {
            const computedStyle = getComputedStyle(document.documentElement);
            const topInset = parseFloat(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0;
            const bottomInset = parseFloat(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0;

            // 根据 position 设置相应的安全区域
            if (position === 'bottom') {
                setSafeAreaStyle({
                    paddingBottom: `${bottomInset}px`
                });
            } else {
                setSafeAreaStyle({
                    paddingTop: `${topInset}px`
                });
            }
        };

        // 初始化安全区域
        updateSafeArea();

        // 监听窗口 resize 事件（键盘弹出/收起时会触发）
        const handleResize = () => {
            // 延迟执行以确保获取到正确的值
            setTimeout(updateSafeArea, 100);
        };

        window.addEventListener('resize', handleResize);

        // 如果支持 visualViewport API，也监听其变化
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        }

        // 清理事件监听器
        return () => {
            window.removeEventListener('resize', handleResize);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            }
        };
    }, [position]);

    return (
        <div
            className={className}
            style={{
                ...style,
                ...safeAreaStyle,
                // 确保在键盘弹出时元素不会被覆盖
                position: position === 'bottom' ? 'fixed' : 'static',
                bottom: position === 'bottom' ? 0 : 'auto',
                left: position === 'bottom' ? 0 : 'auto',
                right: position === 'bottom' ? 0 : 'auto',
                width: position === 'bottom' ? '100%' : 'auto'
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export default KeyboardSafeAreaView;
import { useEffect, useState } from 'react';

/**
 * 检测虚拟键盘是否弹出的 Hook
 * @returns {Object} 包含键盘状态和安全区域信息的对象
 */
export function useKeyboardDetection() {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        // 仅在客户端执行
        if (typeof window === 'undefined' || !window.visualViewport) return;

        const viewport = window.visualViewport;
        let initialViewportHeight = viewport.height;

        const handleResize = () => {
            // 计算高度差（可能是键盘高度）
            const heightDiff = initialViewportHeight - viewport.height;

            // 如果高度差超过一定阈值（例如 100px），认为是键盘弹出
            const keyboardThreshold = 100;
            const isKeyboardCurrentlyOpen = heightDiff > keyboardThreshold;

            setIsKeyboardOpen(isKeyboardCurrentlyOpen);

            if (isKeyboardCurrentlyOpen) {
                setKeyboardHeight(heightDiff);
            } else {
                setKeyboardHeight(0);
            }
        };

        // 监听 visualViewport 的 resize 事件
        viewport.addEventListener('resize', handleResize);

        return () => {
            viewport.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        isKeyboardOpen,
        keyboardHeight
    };
}
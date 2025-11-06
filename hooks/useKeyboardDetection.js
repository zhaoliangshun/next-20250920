import { useEffect, useState } from 'react';

/**
 * 检测虚拟键盘是否弹出的 Hook
 * @returns {Object} 包含键盘状态和安全区域信息的对象
 */
export function useKeyboardDetection() {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [safeAreaInsetBottom, setSafeAreaInsetBottom] = useState(0);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        // 仅在客户端执行
        if (typeof window === 'undefined') return;

        // 初始化安全区域底部 inset
        const initialSafeAreaInset = getComputedStyle(document.documentElement)
            .getPropertyValue('env(safe-area-inset-bottom)');
        const initialInset = parseFloat(initialSafeAreaInset) || 0;
        setSafeAreaInsetBottom(initialInset);

        let initialViewportHeight = window.visualViewport?.height || window.innerHeight;

        const handleResize = () => {
            // 使用 visualViewport API 获取更准确的视口高度
            const currentViewportHeight = window.visualViewport?.height || window.innerHeight;

            // 计算高度差（可能是键盘高度）
            const heightDiff = initialViewportHeight - currentViewportHeight;

            // 如果高度差超过一定阈值（例如 100px），认为是键盘弹出
            const keyboardThreshold = 100;
            const isKeyboardCurrentlyOpen = heightDiff > keyboardThreshold;

            setIsKeyboardOpen(isKeyboardCurrentlyOpen);

            if (isKeyboardCurrentlyOpen) {
                setKeyboardHeight(heightDiff);
                // 键盘弹出时，更新安全区域底部 inset
                const currentSafeAreaInset = getComputedStyle(document.documentElement)
                    .getPropertyValue('env(safe-area-inset-bottom)');
                const currentInset = parseFloat(currentSafeAreaInset) || 0;
                setSafeAreaInsetBottom(currentInset);
            } else {
                setKeyboardHeight(0);
                // 键盘收起时，重置安全区域底部 inset
                setSafeAreaInsetBottom(initialInset);
            }
        };

        // 监听 resize 事件
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
    }, []);

    return {
        isKeyboardOpen,
        safeAreaInsetBottom,
        keyboardHeight
    };
}
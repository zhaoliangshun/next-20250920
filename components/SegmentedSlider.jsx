'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import styles from './SegmentedSlider.module.css';

/**
 * 分段式滑块组件
 * 每个区间有不同的背景颜色，只能在区间的起点和终点选中
 * 支持区间选择（多个拖动点）
 */
const SegmentedSlider = ({
    // 区间配置：每个区间包含 start, end, color, gapBefore, gapAfter
    segments = [],
    // 默认值（单值或区间）
    defaultValue = 0,
    // 受控值（单值或区间）
    value,
    // 是否为区间选择模式
    range = false,
    // 值变化回调
    onChange,
    // 是否禁用
    disabled = false,
    // 自定义类名
    className = '',
    // 自定义样式
    style = {},
    ...props
}) => {
    // 状态管理
    const [isDragging, setIsDragging] = useState(false);
    const [activeHandle, setActiveHandle] = useState(null);

    // 引用
    const sliderRef = useRef(null);
    const isDraggingRef = useRef(false);

    // 计算最小值和最大值
    const min = useMemo(() => {
        if (segments.length === 0) return 0;
        return Math.min(...segments.map(seg => seg.start));
    }, [segments]);

    const max = useMemo(() => {
        if (segments.length === 0) return 100;
        return Math.max(...segments.map(seg => seg.end));
    }, [segments]);

    // 计算当前值
    const [currentValue, setCurrentValue] = useState(() => {
        // 区间模式
        if (range) {
            // 检查默认值是否为有效区间
            if (Array.isArray(defaultValue) && defaultValue.length >= 2) {
                const [startVal, endVal] = defaultValue;
                const isValidStart = segments.some(seg =>
                    startVal === seg.start || startVal === seg.end
                );
                const isValidEnd = segments.some(seg =>
                    endVal === seg.start || endVal === seg.end
                );

                if (isValidStart && isValidEnd && startVal <= endVal) {
                    return [startVal, endVal];
                }
            }

            // 如果默认值无效，使用第一个区间的起点和最后一个区间的终点
            if (segments.length > 0) {
                return [segments[0].start, segments[segments.length - 1].end];
            }
            return [0, 100];
        }
        // 单值模式
        else {
            // 检查默认值是否在有效区间内
            const validSegments = segments.filter(seg =>
                defaultValue === seg.start || defaultValue === seg.end
            );

            if (validSegments.length > 0) {
                return defaultValue;
            }

            // 如果默认值不在有效位置，使用第一个区间的起点
            return segments.length > 0 ? segments[0].start : 0;
        }
    });

    // 更新外部受控值
    useEffect(() => {
        if (value !== undefined) {
            if (range && Array.isArray(value) && value.length >= 2) {
                // 检查区间值是否有效
                const [startVal, endVal] = value;
                const isValidStart = segments.some(seg =>
                    startVal === seg.start || startVal === seg.end
                );
                const isValidEnd = segments.some(seg =>
                    endVal === seg.start || endVal === seg.end
                );

                if (isValidStart && isValidEnd && startVal <= endVal &&
                    (startVal !== currentValue[0] || endVal !== currentValue[1])) {
                    setCurrentValue([startVal, endVal]);
                }
            } else if (!range && value !== currentValue) {
                // 检查单值是否在有效位置
                const isValid = segments.some(seg =>
                    value === seg.start || value === seg.end
                );

                if (isValid) {
                    setCurrentValue(value);
                }
            }
        }
    }, [value, range, segments, currentValue]);

    // 计算百分比
    const getPercentage = useCallback((val) => {
        if (max === min) return 0;
        return ((val - min) / (max - min)) * 100;
    }, [min, max]);

    // 获取鼠标位置对应的值
    const getValueFromPosition = useCallback((clientX) => {
        if (!sliderRef.current) return min;

        const rect = sliderRef.current.getBoundingClientRect();
        const position = clientX;
        const size = rect.width;
        const offset = rect.left;

        const percentage = Math.max(0, Math.min(1, (position - offset) / size));
        const rawValue = min + percentage * (max - min);

        // 找到最近的有效位置（区间的起点或终点）
        let closestValue = range ? currentValue[0] : currentValue;
        let minDistance = Infinity;

        segments.forEach(segment => {
            // 检查起点
            const startDistance = Math.abs(rawValue - segment.start);
            if (startDistance < minDistance) {
                minDistance = startDistance;
                closestValue = segment.start;
            }

            // 检查终点
            const endDistance = Math.abs(rawValue - segment.end);
            if (endDistance < minDistance) {
                minDistance = endDistance;
                closestValue = segment.end;
            }
        });

        return closestValue;
    }, [min, max, segments, range, currentValue]);

    // 处理鼠标按下
    const handleMouseDown = useCallback((e, handleIndex = 0) => {
        if (disabled) return;

        e.preventDefault();
        setIsDragging(true);
        isDraggingRef.current = true;
        setActiveHandle(handleIndex);

        // 获取事件位置
        const getEventPosition = (e) => {
            if ("touches" in e && e.touches[0]) {
                return { clientX: e.touches[0].clientX };
            }
            return { clientX: e.clientX };
        };

        // 移动处理函数
        const moveHandler = (e) => {
            if (!isDraggingRef.current) return;

            e.preventDefault();
            const { clientX } = getEventPosition(e);
            const newValue = getValueFromPosition(clientX);

            if (range) {
                const newValues = [...currentValue];
                newValues[handleIndex] = newValue;

                // 确保区间值的顺序正确
                if (handleIndex === 0 && newValues[0] > newValues[1]) {
                    newValues[0] = newValues[1];
                } else if (handleIndex === 1 && newValues[1] < newValues[0]) {
                    newValues[1] = newValues[0];
                }

                // 只有当值发生变化时才更新
                if (newValues[0] !== currentValue[0] || newValues[1] !== currentValue[1]) {
                    setCurrentValue(newValues);
                    onChange?.(newValues);
                }
            } else {
                if (newValue !== currentValue) {
                    setCurrentValue(newValue);
                    onChange?.(newValue);
                }
            }
        };

        // 释放处理函数
        const upHandler = () => {
            isDraggingRef.current = false;
            setIsDragging(false);
            setActiveHandle(null);

            // 移除事件监听器
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", upHandler);
            document.removeEventListener("touchmove", moveHandler);
            document.removeEventListener("touchend", upHandler);
        };

        // 添加全局事件监听
        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", upHandler);
        document.addEventListener("touchmove", moveHandler, { passive: false });
        document.addEventListener("touchend", upHandler);
    }, [disabled, range, currentValue, getValueFromPosition, onChange]);

    // 处理轨道点击
    const handleTrackClick = useCallback((e) => {
        if (disabled || isDragging) return;

        const newValue = getValueFromPosition(e.clientX);

        if (range) {
            // 在区间模式下，找到最近的手柄
            const distanceToStart = Math.abs(newValue - currentValue[0]);
            const distanceToEnd = Math.abs(newValue - currentValue[1]);

            if (distanceToStart < distanceToEnd) {
                const newValues = [newValue, currentValue[1]];
                setCurrentValue(newValues);
                onChange?.(newValues);
            } else {
                const newValues = [currentValue[0], newValue];
                setCurrentValue(newValues);
                onChange?.(newValues);
            }
        } else {
            setCurrentValue(newValue);
            onChange?.(newValue);
        }
    }, [disabled, isDragging, range, currentValue, getValueFromPosition, onChange]);

    // 处理键盘事件
    const handleKeyDown = useCallback((e, handleIndex = 0) => {
        if (disabled) return;

        let newValue;
        let foundNewValue = false;

        const currentValueToUse = range ? currentValue[handleIndex] : currentValue;

        switch (e.key) {
            case "ArrowLeft":
            case "ArrowDown":
                e.preventDefault();
                // 找到前一个有效位置
                for (let i = segments.length - 1; i >= 0; i--) {
                    const segment = segments[i];
                    if (currentValueToUse === segment.end) {
                        newValue = segment.start;
                        foundNewValue = true;
                        break;
                    } else if (currentValueToUse === segment.start && i > 0) {
                        newValue = segments[i - 1].end;
                        foundNewValue = true;
                        break;
                    }
                }
                break;
            case "ArrowRight":
            case "ArrowUp":
                e.preventDefault();
                // 找到后一个有效位置
                for (let i = 0; i < segments.length; i++) {
                    const segment = segments[i];
                    if (currentValueToUse === segment.start) {
                        newValue = segment.end;
                        foundNewValue = true;
                        break;
                    } else if (currentValueToUse === segment.end && i < segments.length - 1) {
                        newValue = segments[i + 1].start;
                        foundNewValue = true;
                        break;
                    }
                }
                break;
            case "Home":
                e.preventDefault();
                newValue = segments.length > 0 ? segments[0].start : min;
                foundNewValue = true;
                break;
            case "End":
                e.preventDefault();
                newValue = segments.length > 0 ? segments[segments.length - 1].end : max;
                foundNewValue = true;
                break;
        }

        if (foundNewValue) {
            if (range) {
                const newValues = [...currentValue];
                newValues[handleIndex] = newValue;

                // 确保区间值的顺序正确
                if (handleIndex === 0 && newValues[0] > newValues[1]) {
                    newValues[0] = newValues[1];
                } else if (handleIndex === 1 && newValues[1] < newValues[0]) {
                    newValues[1] = newValues[0];
                }

                // 只有当值发生变化时才更新
                if (newValues[0] !== currentValue[0] || newValues[1] !== currentValue[1]) {
                    setCurrentValue(newValues);
                    onChange?.(newValues);
                }
            } else {
                if (newValue !== currentValue) {
                    setCurrentValue(newValue);
                    onChange?.(newValue);
                }
            }
        }
    }, [disabled, range, currentValue, segments, min, max, onChange]);

    // 清理事件监听器
    useEffect(() => {
        return () => {
            if (isDraggingRef.current) {
                document.removeEventListener("mousemove", () => { });
                document.removeEventListener("mouseup", () => { });
                document.removeEventListener("touchmove", () => { });
                document.removeEventListener("touchend", () => { });
            }
        };
    }, []);

    // 计算手柄位置
    const handlePositions = useMemo(() => {
        if (range) {
            return currentValue.map(val => getPercentage(val));
        } else {
            return [getPercentage(currentValue)];
        }
    }, [range, currentValue, getPercentage]);

    // 渲染区间
    const renderSegments = () => {
        return segments.map((segment, index) => {
            const startPercent = getPercentage(segment.start);
            const endPercent = getPercentage(segment.end);
            const widthPercent = endPercent - startPercent;

            return (
                <div
                    key={index}
                    className={styles.segment}
                    style={{
                        left: `${startPercent}%`,
                        width: `${widthPercent}%`,
                        backgroundColor: segment.color || '#1890ff',
                    }}
                />
            );
        });
    };

    // 渲染区间标记点
    const renderSegmentPoints = () => {
        const points = [];
        const pointValues = new Set();

        segments.forEach((segment, index) => {
            // 添加起点
            if (!pointValues.has(segment.start)) {
                pointValues.add(segment.start);
                const position = getPercentage(segment.start);
                const isActive = range
                    ? (currentValue[0] === segment.start || currentValue[1] === segment.start)
                    : (currentValue === segment.start);

                points.push(
                    <div
                        key={`start-${index}`}
                        className={`${styles.point} ${isActive ? styles.pointActive : ''}`}
                        style={{
                            left: `${position}%`,
                        }}
                    />
                );
            }

            // 添加终点
            if (!pointValues.has(segment.end)) {
                pointValues.add(segment.end);
                const position = getPercentage(segment.end);
                const isActive = range
                    ? (currentValue[0] === segment.end || currentValue[1] === segment.end)
                    : (currentValue === segment.end);

                points.push(
                    <div
                        key={`end-${index}`}
                        className={`${styles.point} ${isActive ? styles.pointActive : ''}`}
                        style={{
                            left: `${position}%`,
                        }}
                    />
                );
            }
        });

        return points;
    };

    // 渲染选中区间（仅在区间模式下）
    const renderSelectedRange = () => {
        if (!range) return null;

        const startPercent = getPercentage(currentValue[0]);
        const endPercent = getPercentage(currentValue[1]);

        return (
            <div
                className={styles.selectedRange}
                style={{
                    left: `${startPercent}%`,
                    width: `${endPercent - startPercent}%`,
                }}
            />
        );
    };

    // 渲染拖动点
    const renderHandles = () => {
        return handlePositions.map((position, index) => (
            <div
                key={index}
                className={`${styles.handle} ${activeHandle === index ? styles.handleActive : ''} ${disabled ? styles.handleDisabled : ''
                    }`}
                style={{
                    left: `${position}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, index)}
                onTouchStart={(e) => handleMouseDown(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                tabIndex={disabled ? -1 : 0}
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={range ? currentValue[index] : currentValue}
                aria-disabled={disabled}
                aria-label={range ? (index === 0 ? "最小值" : "最大值") : "滑块值"}
            />
        ));
    };

    // 计算滑块类名
    const sliderClassName = useMemo(() => {
        return `${styles.slider} ${disabled ? styles.sliderDisabled : ''} ${isDragging ? styles.sliderDragging : ''
            } ${range ? styles.sliderRange : ''} ${className}`;
    }, [disabled, isDragging, range, className]);

    return (
        <div
            ref={sliderRef}
            className={sliderClassName}
            style={style}
            {...props}
        >
            <div className={styles.track} onClick={handleTrackClick}>
                <div className={styles.rail} />
                {renderSegments()}
                {renderSelectedRange()}
                {renderSegmentPoints()}
            </div>

            {renderHandles()}
        </div>
    );
};

export default SegmentedSlider;
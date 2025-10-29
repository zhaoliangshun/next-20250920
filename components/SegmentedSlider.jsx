'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import styles from './SegmentedSlider.module.css';

/**
 * 分段式滑块组件（仅支持区间选择）
 * 每个区间有不同的背景颜色，只能在区间的起点和终点选中
 * 支持两个拖动点来选择一个区间
 */
const SegmentedSlider = ({
    // 区间配置：每个区间包含 start, end, color
    segments: realSegments = [],
    // 默认值（区间）
    defaultValue = [0, 100],
    // 受控值（区间）
    value,
    // 值变化回调
    onChange: realChange,
    // 是否禁用
    disabled = false,
    // 自定义类名
    className = '',
    // 自定义样式
    style = {},
    // 是否显示 tooltip
    showTooltip = true,
    // 自定义 tooltip 格式化函数
    formatTooltip = (value) => value,
    // tooltip 显示策略：'always' | 'hover' | 'drag'
    tooltipVisible = 'drag',
    ...props
}) => {
    // 状态管理
    const [isDragging, setIsDragging] = useState(false);
    const [activeHandle, setActiveHandle] = useState(null);
    const [hoveredHandle, setHoveredHandle] = useState(null);

    // 引用
    const sliderRef = useRef(null);
    const isDraggingRef = useRef(false);

    const segments = useMemo(() => {
        let total = 0;
        realSegments.forEach((segment) => {
            total = total + (segment.end - segment.start)
        })
        let add = 0
        return realSegments.map((segment) => {
            const start = add
            const end = Math.round((add/100 + (segment.end - segment.start)/total) * 100)
            add = end
            segment.mapStart = start
            segment.mapEnd = end
            return {...segment, start, end}
        })
    }, [realSegments]);
    
    const onChange = useCallback((value) => {
        let realValue = []
        realSegments.forEach((segment) => {
            if(segment.mapStart === value[0]) {
                realValue[0] = segment.start
            }
            if(segment.mapEnd === value[1]) {
                realValue[1] = segment.end
            }
        })
        if (typeof realChange === 'function') {
            realChange(realValue)
        }
    }, [realChange, realSegments]); 

    // 计算最小值和最大值
    const min = useMemo(() => {
        if (segments.length === 0) return 0;
        return Math.min(...segments.map(seg => seg.start));
    }, [segments]);

    const max = useMemo(() => {
        if (segments.length === 0) return 100;
        return Math.max(...segments.map(seg => seg.end));
    }, [segments]);

    // 计算当前值（始终为区间）
    const [currentValue, setCurrentValue] = useState(() => {
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
    });

    // 更新外部受控值
    useEffect(() => {
        if (value !== undefined && Array.isArray(value) && value.length >= 2) {
            // 检查区间值是否有效
            const [startVal, endVal] = value;
            const newValue = [];
            realSegments.forEach(seg => {
                if(startVal === seg.start ) {
                    newValue[0] = seg.mapStart
                }
            }
                
            );
            realSegments.forEach(seg => {
                if(endVal === seg.end ) {
                    newValue[1] = seg.mapEnd
                }
            });

            console.log(newValue)

            if(newValue[0] && newValue[1] && (newValue[0] < newValue[1])&&
                (newValue[0] !== currentValue[0] || newValue[1] !== currentValue[1])) {
                setCurrentValue(newValue);
            }
        }
    }, [value, realSegments, currentValue]);

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
        let closestValue = currentValue[0];
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
    }, [min, max, segments, currentValue]);

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

            if(handleIndex === 0 && newValue >= currentValue[1]) {
                return false
            }

            if (handleIndex === 1 && newValue <= currentValue[0]) {
                return false
            }

            const newValues = [...currentValue];
            newValues[handleIndex] = newValue;

            // 确保区间值的顺序正确
            // if (handleIndex === 0 && newValues[0] > newValues[1]) {
            //     newValues[0] = newValues[1];
            // } else if (handleIndex === 1 && newValues[1] < newValues[0]) {
            //     newValues[1] = newValues[0];
            // }

            // 只有当值发生变化时才更新
            // if (newValues[0] !== currentValue[0] || newValues[1] !== currentValue[1]) {
                setCurrentValue(newValues);
                onChange?.(newValues);
            // }
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
    }, [disabled, currentValue, getValueFromPosition, onChange]);

    // 处理轨道点击
    const handleTrackClick = useCallback((e) => {
        if (disabled || isDragging) return;

        const newValue = getValueFromPosition(e.clientX);

        // 在区间模式下，找到最近的手柄
        const distanceToStart = Math.abs(newValue - currentValue[0]);
        const distanceToEnd = Math.abs(newValue - currentValue[1]);

        if (distanceToStart <= distanceToEnd) {
            const newValues = [newValue, currentValue[1]];
            setCurrentValue(newValues);
            onChange?.(newValues);
        } else {
            const newValues = [currentValue[0], newValue];
            setCurrentValue(newValues);
            onChange?.(newValues);
        }
    }, [disabled, isDragging, currentValue, getValueFromPosition, onChange]);

    // 处理键盘事件
    const handleKeyDown = useCallback((e, handleIndex = 0) => {
        if (disabled) return;

        let newValue;
        let foundNewValue = false;

        const currentValueToUse = currentValue[handleIndex];

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
        }
    }, [disabled, currentValue, segments, min, max, onChange]);


    // 计算手柄位置
    const handlePositions = useMemo(() => {
        return currentValue.map(val => getPercentage(val));
    }, [currentValue, getPercentage]);

    // 渲染区间
    const renderSegments = () => {
        return segments.map((segment, index) => {
            const startPercent = getPercentage(segment.start);
            const endPercent = getPercentage(segment.end);
            const widthPercent = endPercent - startPercent;
            
            // 判断当前区间是否在选中范围内
            const isPartiallySelected = (
                (segment.start >= currentValue[0] && segment.end <= currentValue[1])
            );

            return (
                <div
                    key={index}
                    className={`${styles.segment} ${!isPartiallySelected ? styles.segmentGray : ''}`}
                    style={{
                        left: `${startPercent}%`,
                        width: `${widthPercent}%`,
                        backgroundColor: isPartiallySelected ? (segment.color || '#1890ff') : undefined,
                    }}
                />
            );
        });
    };

    // 渲染区间标记点
    const renderSegmentPoints = () => {
        const points = [];
        const renderedPoints = new Set();

        // 创建一个包含所有点的数组
        const allPoints = [];

        // 添加每个区间的起点和终点
        segments.forEach((segment, index) => {
            allPoints.push({
                value: segment.start,
                type: 'start',
                segmentIndex: index,
                segment
            });

            allPoints.push({
                value: segment.end,
                type: 'end',
                segmentIndex: index,
                segment
            });
        });

        // 按值排序
        allPoints.sort((a, b) => a.value - b.value);

        // 处理点的渲染，确保间隙点只显示一个
        for (let i = 1; i < allPoints.length - 1; i++) {
            const currentPoint = allPoints[i];
            const pointKey = currentPoint.value;

            // 如果这个点已经渲染过，跳过
            if (renderedPoints.has(pointKey)) {
                continue;
            }

            // 查找所有具有相同值的点
            const sameValuePoints = [currentPoint];
            let j = i + 1;
            while (j < allPoints.length && allPoints[j].value === currentPoint.value) {
                sameValuePoints.push(allPoints[j]);
                j++;
            }

            // 对于相同值的点，我们只渲染一个
            const position = getPercentage(currentPoint.value);
            const isActive = (currentValue[0] === currentPoint.value || currentValue[1] === currentPoint.value);

            points.push(
                <div
                    key={`point-${currentPoint.value}`}
                    className={`${styles.point} ${isActive ? styles.pointActive : ''}`}
                    style={{
                        left: `${position}%`,
                    }}
                />
            );

            renderedPoints.add(pointKey);

            // 跳过已处理的相同值点
            i = j - 1;
        }

        return points;
    };

    // 渲染选中区间

    // 判断是否显示 tooltip
    const shouldShowTooltip = useCallback((handleIndex) => {
        if (!showTooltip) return false;
        
        switch (tooltipVisible) {
            case 'always':
                return true;
            case 'hover':
                return hoveredHandle === handleIndex || activeHandle === handleIndex;
            case 'drag':
                return activeHandle === handleIndex;
            default:
                return activeHandle === handleIndex;
        }
    }, [showTooltip, tooltipVisible, hoveredHandle, activeHandle]);

    // 获取真实值用于显示
    const getRealValue = useCallback((mappedValue) => {
        let realValue = null;
        realSegments.forEach((segment) => {
            if (segment.mapStart === mappedValue) {
                realValue = segment.start;
            }
            if (segment.mapEnd === mappedValue) {
                realValue = segment.end;
            }
        });
        return realValue !== null ? realValue : mappedValue;
    }, [realSegments]);

    // 渲染拖动点
    const renderHandles = () => {
        return handlePositions.map((position, index) => {
            const showCurrentTooltip = shouldShowTooltip(index);
            const realValue = getRealValue(currentValue[index]);
            
            // 判断 tooltip 的对齐方式
            // 左端：位置 <= 10%，右端：位置 >= 90%
            let tooltipAlignClass = '';
            if (position <= 10) {
                tooltipAlignClass = styles.tooltipLeft;
            } else if (position >= 90) {
                tooltipAlignClass = styles.tooltipRight;
            }
            
            return (
                <div
                    key={index}
                    className={`${styles.handleWrapper}`}
                    style={{
                        left: `${position}%`,
                    }}
                >
                    <div
                        className={`${styles.handle} ${activeHandle === index ? styles.handleActive : ''} ${disabled ? styles.handleDisabled : ''
                            }`}
                        onMouseDown={(e) => handleMouseDown(e, index)}
                        onTouchStart={(e) => handleMouseDown(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onMouseEnter={() => setHoveredHandle(index)}
                        onMouseLeave={() => setHoveredHandle(null)}
                        tabIndex={disabled ? -1 : 0}
                        role="slider"
                        aria-valuemin={min}
                        aria-valuemax={max}
                        aria-valuenow={realValue}
                        aria-disabled={disabled}
                        aria-label={index === 0 ? "最小值" : "最大值"}
                    />
                    {showCurrentTooltip && (
                        <div className={`${styles.tooltip} ${tooltipAlignClass} ${index === 0 ? styles.tooltip0 : ''} ${activeHandle === index ? styles.tooltipActive : ''}`}>
                            <div className={styles.tooltipContent}>
                                {formatTooltip(realValue)}
                            </div>
                            <div className={styles.tooltipArrow} />
                        </div>
                    )}
                </div>
            );
        });
    };

    // 计算滑块类名
    const sliderClassName = useMemo(() => {
        return `${styles.slider} ${disabled ? styles.sliderDisabled : ''} ${isDragging ? styles.sliderDragging : ''
            } ${styles.sliderRange} ${className}`;
    }, [disabled, isDragging, className]);

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
                {renderSegmentPoints()}
            </div>

            {renderHandles()}
        </div>
    );
};

export default SegmentedSlider;
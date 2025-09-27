'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseSliderStateProps {
  min?: number;
  max?: number;
  step?: number | null;
  value?: number | number[];
  defaultValue?: number | number[];
  range?: boolean | {
    editable?: boolean;
    draggableTrack?: boolean;
    minCount?: number;
    maxCount?: number;
  };
  onChange?: (value: number | number[]) => void;
  onChangeComplete?: (value: number | number[]) => void;
}

export interface UseSliderStateReturn {
  values: number[];
  setValues: (newValues: number[]) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  activeHandle: number | null;
  setActiveHandle: (index: number | null) => void;
  getStepValue: (rawValue: number) => number;
  getPercentage: (value: number) => number;
  rangeConfig: {
    enabled: boolean;
    editable: boolean;
    draggableTrack: boolean;
    minCount: number;
    maxCount: number;
  };
  handleChange: (newValues: number[]) => void;
  handleChangeComplete: (newValues: number[]) => void;
}

/**
 * 滑块状态管理钩子
 */
export default function useSliderState({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  range = false,
  onChange,
  onChangeComplete,
}: UseSliderStateProps): UseSliderStateReturn {
  // 解析range配置
  const rangeConfig = {
    enabled: typeof range === 'boolean' ? range : true,
    editable: typeof range === 'object' ? range.editable || false : false,
    draggableTrack: typeof range === 'object' ? range.draggableTrack || false : false,
    minCount: typeof range === 'object' ? range.minCount || 2 : 2,
    maxCount: typeof range === 'object' ? range.maxCount || 2 : 2,
  };
  
  // 初始化值
  const initialValues = (): number[] => {
    if (rangeConfig.enabled) {
      if (Array.isArray(value)) {
        return [...value].sort((a, b) => a - b);
      }
      if (Array.isArray(defaultValue)) {
        return [...defaultValue].sort((a, b) => a - b);
      }
      return [min, max];
    }
    
    const singleValue = value !== undefined ? value : defaultValue !== undefined ? defaultValue : min;
    return [typeof singleValue === 'number' ? singleValue : min];
  };
  
  // 状态
  const [values, setValuesState] = useState<number[]>(initialValues);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<number | null>(null);
  
  // 引用
  const isControlled = useRef(value !== undefined);
  
  // 更新外部受控值
  useEffect(() => {
    if (isControlled.current) {
      if (rangeConfig.enabled && Array.isArray(value)) {
        setValuesState([...value].sort((a, b) => a - b));
      } else if (!rangeConfig.enabled && typeof value === 'number') {
        setValuesState([value]);
      }
    }
  }, [value, rangeConfig.enabled]);
  
  // 计算步长值
  const getStepValue = useCallback((rawValue: number): number => {
    if (step === null) {
      return Math.min(max, Math.max(min, rawValue));
    }
    
    const stepCount = Math.round((rawValue - min) / step);
    return Math.min(max, Math.max(min, min + stepCount * step));
  }, [min, max, step]);
  
  // 计算百分比
  const getPercentage = useCallback((val: number): number => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);
  
  // 设置值
  const setValues = useCallback((newValues: number[]): void => {
    // 确保值在范围内
    const clampedValues = newValues.map(val => Math.min(max, Math.max(min, val)));
    
    // 排序（如果是范围模式）
    const sortedValues = rangeConfig.enabled ? [...clampedValues].sort((a, b) => a - b) : clampedValues;
    
    // 更新内部状态
    if (!isControlled.current) {
      setValuesState(sortedValues);
    }
  }, [min, max, rangeConfig.enabled]);
  
  // 处理值变化
  const handleChange = useCallback((newValues: number[]): void => {
    // 确保值在范围内
    const clampedValues = newValues.map(val => Math.min(max, Math.max(min, val)));
    
    // 排序（如果是范围模式）
    const sortedValues = rangeConfig.enabled ? [...clampedValues].sort((a, b) => a - b) : clampedValues;
    
    // 更新内部状态
    if (!isControlled.current) {
      setValuesState(sortedValues);
    }
    
    // 触发外部回调
    if (onChange) {
      onChange(rangeConfig.enabled ? sortedValues : sortedValues[0]);
    }
  }, [min, max, rangeConfig.enabled, onChange]);
  
  // 处理值变化完成
  const handleChangeComplete = useCallback((newValues: number[]): void => {
    // 确保值在范围内
    const clampedValues = newValues.map(val => Math.min(max, Math.max(min, val)));
    
    // 排序（如果是范围模式）
    const sortedValues = rangeConfig.enabled ? [...clampedValues].sort((a, b) => a - b) : clampedValues;
    
    // 触发外部回调
    if (onChangeComplete) {
      onChangeComplete(rangeConfig.enabled ? sortedValues : sortedValues[0]);
    }
  }, [min, max, rangeConfig.enabled, onChangeComplete]);
  
  return {
    values,
    setValues,
    isDragging,
    setIsDragging,
    activeHandle,
    setActiveHandle,
    getStepValue,
    getPercentage,
    rangeConfig,
    handleChange,
    handleChangeComplete,
  };
}
// 导入React相关依赖
import type React from 'react';

// 方向类型定义
export type Direction = 'rtl' | 'ltr' | 'ttb' | 'btt';

// 开始移动事件类型
export type OnStartMove = (
  e: React.MouseEvent | React.TouchEvent, // 鼠标或触摸事件
  valueIndex: number, // 值索引
  startValues?: number[], // 起始值数组
) => void;

// ARIA值格式化器类型
export type AriaValueFormat = (value: number) => string;

// 语义化名称类型
export type SemanticName = 'tracks' | 'track' | 'rail' | 'handle';

// 滑块类名类型
export type SliderClassNames = Partial<Record<SemanticName, string>>;

// 滑块样式类型
export type SliderStyles = Partial<Record<SemanticName, React.CSSProperties>>;

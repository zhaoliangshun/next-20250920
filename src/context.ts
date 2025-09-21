// 导入React相关依赖
import * as React from 'react';
import type { AriaValueFormat, Direction, SliderClassNames, SliderStyles } from './interface';

// 滑块上下文属性接口
export interface SliderContextProps {
  min: number; // 最小值
  max: number; // 最大值
  includedStart: number; // 包含范围的起始值
  includedEnd: number; // 包含范围的结束值
  direction: Direction; // 方向
  disabled?: boolean; // 是否禁用
  keyboard?: boolean; // 是否支持键盘操作
  included?: boolean; // 是否包含轨道
  step: number | null; // 步长
  range?: boolean; // 是否为范围模式
  tabIndex: number | number[]; // Tab索引
  ariaLabelForHandle?: string | string[]; // 手柄的aria标签
  ariaLabelledByForHandle?: string | string[]; // 手柄的aria标签引用
  ariaRequired?: boolean; // 是否必需
  ariaValueTextFormatterForHandle?: AriaValueFormat | AriaValueFormat[]; // 手柄值的aria文本格式化器
  classNames: SliderClassNames; // 语义化类名
  styles: SliderStyles; // 语义化样式
}

// 创建滑块上下文
const SliderContext = React.createContext<SliderContextProps>({
  min: 0,
  max: 0,
  direction: 'ltr',
  step: 1,
  includedStart: 0,
  includedEnd: 0,
  tabIndex: 0,
  keyboard: true,
  styles: {},
  classNames: {},
});

export default SliderContext;

// 不稳定上下文属性接口（用于内部调试）
export interface UnstableContextProps {
  onDragStart?: (info: {
    rawValues: number[]; // 原始值数组
    draggingIndex: number; // 拖拽索引
    draggingValue: number; // 拖拽值
  }) => void;
  onDragChange?: (info: {
    rawValues: number[]; // 原始值数组
    deleteIndex: number; // 删除索引
    draggingIndex: number; // 拖拽索引
    draggingValue: number; // 拖拽值
  }) => void;
}

/** @private 不稳定上下文，不承诺可用性。请勿在生产环境中使用。 */
export const UnstableContext = React.createContext<UnstableContextProps>({});

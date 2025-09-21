// 导入依赖
import { warning } from '@rc-component/util/lib/warning';
import { useMemo } from 'react';
import type { SliderProps } from '../Slider';

// 范围钩子
export default function useRange(
  range?: SliderProps['range'], // 范围配置
): [
  range: boolean, // 是否为范围模式
  rangeEditable: boolean, // 是否可编辑范围
  rangeDraggableTrack: boolean, // 是否可拖拽轨道
  minCount: number, // 最小数量
  maxCount?: number, // 最大数量
] {
  return useMemo(() => {
    // 如果range为true或未定义，返回基本范围配置
    if (range === true || !range) {
      return [!!range, false, false, 0];
    }

    // 解构范围配置
    const { editable, draggableTrack, minCount, maxCount } = range;

    // 开发环境警告
    if (process.env.NODE_ENV !== 'production') {
      warning(!editable || !draggableTrack, '`editable` can not work with `draggableTrack`.');
    }

    // 返回范围配置
    return [true, editable, !editable && draggableTrack, minCount || 0, maxCount];
  }, [range]);
}

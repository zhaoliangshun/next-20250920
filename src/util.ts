// 导入类型定义
import type { Direction } from './interface';

// 获取偏移量：计算值在[min, max]范围内的相对位置
export function getOffset(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

// 根据方向获取样式：计算元素在不同方向下的位置样式
export function getDirectionStyle(direction: Direction, value: number, min: number, max: number) {
  const offset = getOffset(value, min, max);

  const positionStyle: React.CSSProperties = {};

  switch (direction) {
    case 'rtl': // 从右到左
      positionStyle.right = `${offset * 100}%`;
      positionStyle.transform = 'translateX(50%)';
      break;

    case 'btt': // 从下到上
      positionStyle.bottom = `${offset * 100}%`;
      positionStyle.transform = 'translateY(50%)';
      break;

    case 'ttb': // 从上到下
      positionStyle.top = `${offset * 100}%`;
      positionStyle.transform = 'translateY(-50%)';
      break;

    default: // 从左到右（ltr）
      positionStyle.left = `${offset * 100}%`;
      positionStyle.transform = 'translateX(-50%)';
      break;
  }

  return positionStyle;
}

// 获取索引值：如果是数组则返回指定索引的值，否则直接返回值
export function getIndex<T>(value: T | T[], index: number) {
  return Array.isArray(value) ? value[index] : value;
}

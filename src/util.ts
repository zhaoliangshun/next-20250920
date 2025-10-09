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

// 判断是否为浏览器环境
function isBrowser() {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
}

// 判断是否为移动端设备（SSR 安全）
export function isMobileDevice(options?: {
  userAgent?: string;
  maxMobileWidth?: number; // 视口宽度阈值兜底
}): boolean {
  const ua = options?.userAgent ?? (isBrowser() ? navigator.userAgent : '');
  const maxMobileWidth = options?.maxMobileWidth ?? 1024;

  // 基于 UA 的主要判断
  const uaLower = ua.toLowerCase();
  const uaMobile = /(android|iphone|ipod|ipad|windows phone|mobile|blackberry|bb10|silk|opera mini|opera mobi|kindle|fennec)/i.test(uaLower);

  if (uaMobile) return true;

  // iPadOS 13+ 在 UA 上可能伪装为 macOS，使用触控点数兜底
  if (isBrowser()) {
    const isIpadOSLike =
      navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1;
    if (isIpadOSLike) return true;

    // 视口宽度兜底（可选）
    if (window.innerWidth && window.innerWidth <= maxMobileWidth) {
      return true;
    }
  }

  return false;
}

// 获取设备类型：'mobile' 或 'pc'
export function getDeviceType(options?: { userAgent?: string; maxMobileWidth?: number }): 'mobile' | 'pc' {
  return isMobileDevice(options) ? 'mobile' : 'pc';
}
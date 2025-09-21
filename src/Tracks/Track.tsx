// 导入依赖
import cls from 'classnames';
import * as React from 'react';
import SliderContext from '../context';
import type { OnStartMove } from '../interface';
import { getOffset } from '../util';

// 轨道组件属性接口
export interface TrackProps {
  prefixCls: string; // CSS类名前缀
  style?: React.CSSProperties; // 样式
  /** 用原始前缀连接类名替换 */
  replaceCls?: string; // 替换类名
  start: number; // 起始值
  end: number; // 结束值
  index: number; // 索引
  onStartMove?: OnStartMove; // 开始移动回调
}

// 轨道组件
const Track: React.FC<TrackProps> = (props) => {
  const { prefixCls, style, start, end, index, onStartMove, replaceCls } = props;
  
  // 从上下文获取值
  const { direction, min, max, disabled, range, classNames } = React.useContext(SliderContext);

  const trackPrefixCls = `${prefixCls}-track`;

  // 计算偏移量
  const offsetStart = getOffset(start, min, max);
  const offsetEnd = getOffset(end, min, max);

  // ============================ 事件处理 ============================
  // 内部开始移动事件
  const onInternalStartMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!disabled && onStartMove) {
      onStartMove(e, -1); // 轨道拖拽使用-1作为索引
    }
  };

  // ============================ 渲染 ============================
  const positionStyle: React.CSSProperties = {};

  // 根据方向计算位置样式
  switch (direction) {
    case 'rtl': // 从右到左
      positionStyle.right = `${offsetStart * 100}%`;
      positionStyle.width = `${offsetEnd * 100 - offsetStart * 100}%`;
      break;

    case 'btt': // 从下到上
      positionStyle.bottom = `${offsetStart * 100}%`;
      positionStyle.height = `${offsetEnd * 100 - offsetStart * 100}%`;
      break;

    case 'ttb': // 从上到下
      positionStyle.top = `${offsetStart * 100}%`;
      positionStyle.height = `${offsetEnd * 100 - offsetStart * 100}%`;
      break;

    default: // 从左到右（ltr）
      positionStyle.left = `${offsetStart * 100}%`;
      positionStyle.width = `${offsetEnd * 100 - offsetStart * 100}%`;
  }

  // 计算类名
  const className =
    replaceCls ||
    cls(
      trackPrefixCls,
      {
        [`${trackPrefixCls}-${index + 1}`]: index !== null && range, // 范围模式下的轨道编号
        [`${prefixCls}-track-draggable`]: onStartMove, // 可拖拽轨道
      },
      classNames.track,
    );

  return (
    <div
      className={className}
      style={{ ...positionStyle, ...style }}
      onMouseDown={onInternalStartMove}
      onTouchStart={onInternalStartMove}
    />
  );
};

export default Track;

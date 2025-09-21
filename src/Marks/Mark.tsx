// 导入依赖
import classNames from 'classnames';
import * as React from 'react';
import SliderContext from '../context';
import { getDirectionStyle } from '../util';

// 标记组件属性接口
export interface MarkProps {
  prefixCls: string; // CSS类名前缀
  children?: React.ReactNode; // 子元素
  style?: React.CSSProperties; // 样式
  value: number; // 值
  onClick: (value: number) => void; // 点击回调
}

// 标记组件
const Mark: React.FC<MarkProps> = (props) => {
  const { prefixCls, style, children, value, onClick } = props;
  
  // 从上下文获取值
  const { min, max, direction, includedStart, includedEnd, included } =
    React.useContext(SliderContext);

  const textCls = `${prefixCls}-text`;

  // ============================ 位置计算 ============================
  const positionStyle = getDirectionStyle(direction, value, min, max);

  return (
    <span
      className={classNames(textCls, {
        [`${textCls}-active`]: included && includedStart <= value && value <= includedEnd, // 激活状态
      })}
      style={{ ...positionStyle, ...style }}
      onMouseDown={(e) => {
        e.stopPropagation(); // 阻止事件冒泡
      }}
      onClick={() => {
        onClick(value); // 触发点击回调
      }}
    >
      {children}
    </span>
  );
};

export default Mark;

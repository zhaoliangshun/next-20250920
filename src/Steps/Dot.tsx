// 导入依赖
import classNames from 'classnames';
import * as React from 'react';
import SliderContext from '../context';
import { getDirectionStyle } from '../util';

// 点组件属性接口
export interface DotProps {
  prefixCls: string; // CSS类名前缀
  value: number; // 值
  style?: React.CSSProperties | ((dotValue: number) => React.CSSProperties); // 样式
  activeStyle?: React.CSSProperties | ((dotValue: number) => React.CSSProperties); // 激活样式
}

// 点组件
const Dot: React.FC<DotProps> = (props) => {
  const { prefixCls, value, style, activeStyle } = props;
  
  // 从上下文获取值
  const { min, max, direction, included, includedStart, includedEnd } =
    React.useContext(SliderContext);

  const dotClassName = `${prefixCls}-dot`;
  const active = included && includedStart <= value && value <= includedEnd; // 是否激活

  // ============================ 位置计算 ============================
  let mergedStyle: React.CSSProperties = {
    ...getDirectionStyle(direction, value, min, max),
    ...(typeof style === 'function' ? style(value) : style), // 处理函数式样式
  };

  // 如果是激活状态，应用激活样式
  if (active) {
    mergedStyle = {
      ...mergedStyle,
      ...(typeof activeStyle === 'function' ? activeStyle(value) : activeStyle), // 处理函数式激活样式
    };
  }

  return (
    <span
      className={classNames(dotClassName, { [`${dotClassName}-active`]: active })}
      style={mergedStyle}
    />
  );
};

export default Dot;

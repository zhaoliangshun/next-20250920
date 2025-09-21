// 导入依赖
import * as React from 'react';
import Mark from './Mark';

// 标记对象接口
export interface MarkObj {
  style?: React.CSSProperties; // 样式
  label?: React.ReactNode; // 标签
}

// 内部标记对象接口
export interface InternalMarkObj extends MarkObj {
  value: number; // 值
}

// 标记集合组件属性接口
export interface MarksProps {
  prefixCls: string; // CSS类名前缀
  marks?: InternalMarkObj[]; // 标记数组
  onClick: (value: number) => void; // 点击回调
}

// 标记集合组件
const Marks: React.FC<MarksProps> = (props) => {
  const { prefixCls, marks, onClick } = props;

  const markPrefixCls = `${prefixCls}-mark`;

  // 如果没有标记则不渲染
  if (!marks.length) {
    return null;
  }

  return (
    <div className={markPrefixCls}>
      {marks.map<React.ReactNode>(({ value, style, label }) => (
        <Mark key={value} prefixCls={markPrefixCls} style={style} value={value} onClick={onClick}>
          {label}
        </Mark>
      ))}
    </div>
  );
};

export default Marks;

// 导入依赖
import * as React from 'react';
import type { InternalMarkObj } from '../Marks';
import SliderContext from '../context';
import Dot from './Dot';

// 步骤组件属性接口
export interface StepsProps {
  prefixCls: string; // CSS类名前缀
  marks: InternalMarkObj[]; // 标记数组
  dots?: boolean; // 是否显示点
  style?: React.CSSProperties | ((dotValue: number) => React.CSSProperties); // 样式
  activeStyle?: React.CSSProperties | ((dotValue: number) => React.CSSProperties); // 激活样式
}

// 步骤组件
const Steps: React.FC<StepsProps> = (props) => {
  const { prefixCls, marks, dots, style, activeStyle } = props;
  
  // 从上下文获取值
  const { min, max, step } = React.useContext(SliderContext);

  // 计算步骤点
  const stepDots = React.useMemo<number[]>(() => {
    const dotSet = new Set<number>();

    // 添加标记点
    marks.forEach((mark) => {
      dotSet.add(mark.value);
    });

    // 填充步骤点
    if (dots && step !== null) {
      let current = min;
      while (current <= max) {
        dotSet.add(current);
        current += step;
      }
    }

    return Array.from(dotSet);
  }, [min, max, step, dots, marks]);

  return (
    <div className={`${prefixCls}-step`}>
      {stepDots.map<React.ReactNode>((dotValue) => (
        <Dot
          prefixCls={prefixCls}
          key={dotValue}
          value={dotValue}
          style={style}
          activeStyle={activeStyle}
        />
      ))}
    </div>
  );
};

export default Steps;

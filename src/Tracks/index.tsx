// 导入依赖
import cls from 'classnames';
import * as React from 'react';
import SliderContext from '../context';
import type { OnStartMove } from '../interface';
import { getIndex } from '../util';
import Track from './Track';

// 轨道集合组件属性接口
export interface TrackProps {
  prefixCls: string; // CSS类名前缀
  style?: React.CSSProperties | React.CSSProperties[]; // 样式
  values: number[]; // 值数组
  onStartMove?: OnStartMove; // 开始移动回调
  startPoint?: number; // 起始点
}

// 轨道集合组件
const Tracks: React.FC<TrackProps> = (props) => {
  const { prefixCls, style, values, startPoint, onStartMove } = props;
  
  // 从上下文获取值
  const { included, range, min, styles, classNames } = React.useContext(SliderContext);

  // =========================== 轨道列表 ===========================
  const trackList = React.useMemo(() => {
    if (!range) {
      // 单值模式：空值没有轨道
      if (values.length === 0) {
        return [];
      }

      const startValue = startPoint ?? min;
      const endValue = values[0];

      return [{ start: Math.min(startValue, endValue), end: Math.max(startValue, endValue) }];
    }

    // 多值模式
    const list: { start: number; end: number }[] = [];

    for (let i = 0; i < values.length - 1; i += 1) {
      list.push({ start: values[i], end: values[i + 1] });
    }

    return list;
  }, [values, range, startPoint, min]);

  // 如果不包含轨道则不渲染
  if (!included) {
    return null;
  }

  // ========================== 渲染 ==========================
  // 轨道节点（用于整体轨道样式）
  const tracksNode =
      trackList?.length && (classNames.tracks || styles.tracks) ? (
      <Track
        index={null}
        prefixCls={prefixCls}
        start={trackList[0].start}
        end={trackList[trackList.length - 1].end}
        replaceCls={cls(classNames.tracks, `${prefixCls}-tracks`)}
        style={styles.tracks}
      />
    ) : null;

  return (
    <>
      {tracksNode}
      {/* 渲染各个轨道 */}
      {trackList.map<React.ReactNode>(({ start, end }, index) => (
        <Track
          index={index}
          prefixCls={prefixCls}
          style={{ ...getIndex(style, index), ...styles.track }}
          start={start}
          end={end}
          key={index}
          onStartMove={onStartMove}
        />
      ))}
    </>
  );
};

export default Tracks;

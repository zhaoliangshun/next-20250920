// 导入依赖
import * as React from 'react';
import { flushSync } from 'react-dom';
import type { OnStartMove } from '../interface';
import { getIndex } from '../util';
import type { HandleProps } from './Handle';
import Handle from './Handle';

// 手柄集合组件属性接口
export interface HandlesProps {
  prefixCls: string; // CSS类名前缀
  style?: React.CSSProperties | React.CSSProperties[]; // 样式
  values: number[]; // 值数组
  onStartMove: OnStartMove; // 开始移动回调
  onOffsetChange: (value: number | 'min' | 'max', valueIndex: number) => void; // 偏移改变回调
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void; // 聚焦回调
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void; // 失焦回调
  onDelete?: (index: number) => void; // 删除回调
  handleRender?: HandleProps['render']; // 自定义手柄渲染
  /**
   * 当配置`activeHandleRender`时，
   * 它会为激活使用渲染另一个隐藏的手柄。
   * 这对于无障碍或工具提示使用很有用。
   */
  activeHandleRender?: HandleProps['render']; // 自定义激活手柄渲染
  draggingIndex: number; // 拖拽索引
  draggingDelete: boolean; // 是否拖拽删除
  onChangeComplete?: () => void; // 改变完成回调
}

// 手柄集合引用接口
export interface HandlesRef {
  focus: (index: number) => void; // 聚焦指定索引的手柄
  hideHelp: VoidFunction; // 隐藏帮助
}

// 手柄集合组件
const Handles = React.forwardRef<HandlesRef, HandlesProps>((props, ref) => {
  // 解构属性
  const {
    prefixCls,
    style,
    onStartMove,
    onOffsetChange,
    values,
    handleRender,
    activeHandleRender,
    draggingIndex,
    draggingDelete,
    onFocus,
    ...restProps
  } = props;

  // 手柄引用映射
  const handlesRef = React.useRef<Record<number, HTMLDivElement>>({});

  // =========================== 激活状态 ===========================
  const [activeVisible, setActiveVisible] = React.useState(false); // 激活可见性
  const [activeIndex, setActiveIndex] = React.useState(-1); // 激活索引

  // 激活指定索引的手柄
  const onActive = (index: number) => {
    setActiveIndex(index);
    setActiveVisible(true);
  };

  // 手柄聚焦事件
  const onHandleFocus = (e: React.FocusEvent<HTMLDivElement>, index: number) => {
    onActive(index);
    onFocus?.(e);
  };

  // 手柄鼠标进入事件
  const onHandleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    onActive(index);
  };

  // =========================== 渲染 ===========================
  React.useImperativeHandle(ref, () => ({
    focus: (index: number) => {
      handlesRef.current[index]?.focus(); // 聚焦指定索引的手柄
    },
    hideHelp: () => {
      flushSync(() => {
        setActiveVisible(false); // 同步隐藏帮助
      });
    },
  }));

  // =========================== 渲染 ===========================
  // 手柄属性
  const handleProps = {
    prefixCls,
    onStartMove,
    onOffsetChange,
    render: handleRender,
    onFocus: onHandleFocus,
    onMouseEnter: onHandleMouseEnter,
    ...restProps,
  };

  return (
    <>
      {/* 渲染所有手柄 */}
      {values.map<React.ReactNode>((value, index) => {
        const dragging = draggingIndex === index;

        return (
          <Handle
            ref={(node) => {
              if (!node) {
                delete handlesRef.current[index]; // 清理引用
              } else {
                handlesRef.current[index] = node; // 设置引用
              }
            }}
            dragging={dragging}
            draggingDelete={dragging && draggingDelete}
            style={getIndex(style, index)}
            key={index}
            value={value}
            valueIndex={index}
            {...handleProps}
          />
        );
      })}

      {/* 用于渲染工具提示的隐藏手柄，这不是真正的手柄 */}
      {activeHandleRender && activeVisible && (
        <Handle
          key="a11y"
          {...handleProps}
          value={values[activeIndex]}
          valueIndex={null}
          dragging={draggingIndex !== -1}
          draggingDelete={draggingDelete}
          render={activeHandleRender}
          style={{ pointerEvents: 'none' }} // 禁用指针事件
          tabIndex={null}
          aria-hidden // 隐藏ARIA
        />
      )}
    </>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Handles.displayName = 'Handles';
}

export default Handles;

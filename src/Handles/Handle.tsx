// 导入依赖
import cls from 'classnames';
import KeyCode from '@rc-component/util/lib/KeyCode';
import * as React from 'react';
import SliderContext from '../context';
import type { OnStartMove } from '../interface';
import { getDirectionStyle, getIndex } from '../util';

// 渲染属性接口
interface RenderProps {
  index: number; // 索引
  prefixCls: string; // CSS类名前缀
  value: number; // 值
  dragging: boolean; // 是否正在拖拽
  draggingDelete: boolean; // 是否正在拖拽删除
}

// 手柄组件属性接口
export interface HandleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onFocus' | 'onMouseEnter'> {
  prefixCls: string; // CSS类名前缀
  style?: React.CSSProperties; // 样式
  value: number; // 值
  valueIndex: number; // 值索引
  dragging: boolean; // 是否正在拖拽
  draggingDelete: boolean; // 是否正在拖拽删除
  onStartMove: OnStartMove; // 开始移动回调
  onDelete?: (index: number) => void; // 删除回调
  onOffsetChange: (value: number | 'min' | 'max', valueIndex: number) => void; // 偏移改变回调
  onFocus: (e: React.FocusEvent<HTMLDivElement>, index: number) => void; // 聚焦回调
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>, index: number) => void; // 鼠标进入回调
  render?: (
    origin: React.ReactElement<React.HTMLAttributes<HTMLDivElement>>,
    props: RenderProps,
  ) => React.ReactElement; // 自定义渲染函数
  onChangeComplete?: () => void; // 改变完成回调
  mock?: boolean; // 是否为模拟
}

// 手柄组件
const Handle = React.forwardRef<HTMLDivElement, HandleProps>((props, ref) => {
  // 解构属性
  const {
    prefixCls,
    value,
    valueIndex,
    onStartMove,
    onDelete,
    style,
    render,
    dragging,
    draggingDelete,
    onOffsetChange,
    onChangeComplete,
    onFocus,
    onMouseEnter,
    ...restProps
  } = props;

  // 从上下文获取值
  const {
    min,
    max,
    direction,
    disabled,
    keyboard,
    range,
    tabIndex,
    ariaLabelForHandle,
    ariaLabelledByForHandle,
    ariaRequired,
    ariaValueTextFormatterForHandle,
    styles,
    classNames,
  } = React.useContext(SliderContext);

  const handlePrefixCls = `${prefixCls}-handle`;

  // ============================ 事件处理 ============================
  // 内部开始移动事件
  const onInternalStartMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!disabled) {
      onStartMove(e, valueIndex);
    }
  };

  // 内部聚焦事件
  const onInternalFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    onFocus?.(e, valueIndex);
  };

  // 内部鼠标进入事件
  const onInternalMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseEnter(e, valueIndex);
  };

  // =========================== 键盘事件处理 ===========================
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!disabled && keyboard) {
      let offset: number | 'min' | 'max' = null;

      // 根据按键改变值
      switch (e.which || e.keyCode) {
        case KeyCode.LEFT: // 左箭头
          offset = direction === 'ltr' || direction === 'btt' ? -1 : 1;
          break;

        case KeyCode.RIGHT: // 右箭头
          offset = direction === 'ltr' || direction === 'btt' ? 1 : -1;
          break;

        // 上键是加
        case KeyCode.UP: // 上箭头
          offset = direction !== 'ttb' ? 1 : -1;
          break;

        // 下键是减
        case KeyCode.DOWN: // 下箭头
          offset = direction !== 'ttb' ? -1 : 1;
          break;

        case KeyCode.HOME: // Home键
          offset = 'min';
          break;

        case KeyCode.END: // End键
          offset = 'max';
          break;

        case KeyCode.PAGE_UP: // Page Up键
          offset = 2;
          break;

        case KeyCode.PAGE_DOWN: // Page Down键
          offset = -2;
          break;

        case KeyCode.BACKSPACE: // 退格键
        case KeyCode.DELETE: // 删除键
          onDelete?.(valueIndex);
          break;
      }

      if (offset !== null) {
        e.preventDefault();
        onOffsetChange(offset, valueIndex);
      }
    }
  };

  // 键盘按键释放事件
  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.which || e.keyCode) {
      case KeyCode.LEFT:
      case KeyCode.RIGHT:
      case KeyCode.UP:
      case KeyCode.DOWN:
      case KeyCode.HOME:
      case KeyCode.END:
      case KeyCode.PAGE_UP:
      case KeyCode.PAGE_DOWN:
        onChangeComplete?.(); // 触发改变完成事件
        break;
    }
  };

  // ============================ 位置计算 ============================
  const positionStyle = getDirectionStyle(direction, value, min, max);

  // ============================ 渲染 ============================
  let divProps: React.HtmlHTMLAttributes<HTMLDivElement> = {};

  if (valueIndex !== null) {
    divProps = {
      tabIndex: disabled ? null : getIndex(tabIndex, valueIndex), // Tab索引
      role: 'slider', // ARIA角色
      'aria-valuemin': min, // ARIA最小值
      'aria-valuemax': max, // ARIA最大值
      'aria-valuenow': value, // ARIA当前值
      'aria-disabled': disabled, // ARIA禁用状态
      'aria-label': getIndex(ariaLabelForHandle, valueIndex), // ARIA标签
      'aria-labelledby': getIndex(ariaLabelledByForHandle, valueIndex), // ARIA标签引用
      'aria-required': getIndex(ariaRequired, valueIndex), // ARIA必需状态
      'aria-valuetext': getIndex(ariaValueTextFormatterForHandle, valueIndex)?.(value), // ARIA值文本
      'aria-orientation': direction === 'ltr' || direction === 'rtl' ? 'horizontal' : 'vertical', // ARIA方向
      onMouseDown: onInternalStartMove, // 鼠标按下事件
      onTouchStart: onInternalStartMove, // 触摸开始事件
      onFocus: onInternalFocus, // 聚焦事件
      onMouseEnter: onInternalMouseEnter, // 鼠标进入事件
      onKeyDown, // 键盘按下事件
      onKeyUp: handleKeyUp, // 键盘释放事件
    };
  }

  // 创建手柄节点
  let handleNode = (
    <div
      ref={ref}
      className={cls(
        handlePrefixCls,
        {
          [`${handlePrefixCls}-${valueIndex + 1}`]: valueIndex !== null && range, // 范围模式下的手柄编号
          [`${handlePrefixCls}-dragging`]: dragging, // 拖拽状态
          [`${handlePrefixCls}-dragging-delete`]: draggingDelete, // 拖拽删除状态
        },
        classNames.handle,
      )}
      style={{
        ...positionStyle,
        ...style,
        ...styles.handle,
      }}
      {...divProps}
      {...restProps}
    />
  );

  // 自定义渲染
  if (render) {
    handleNode = render(handleNode, {
      index: valueIndex,
      prefixCls,
      value,
      dragging,
      draggingDelete,
    });
  }

  return handleNode;
});

if (process.env.NODE_ENV !== 'production') {
  Handle.displayName = 'Handle';
}

export default Handle;

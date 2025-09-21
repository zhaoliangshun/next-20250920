// 导入React相关依赖
import useControlledState from '@rc-component/util/lib/hooks/useControlledState';
import useEvent from '@rc-component/util/lib/hooks/useEvent';
import isEqual from '@rc-component/util/lib/isEqual';
import warning from '@rc-component/util/lib/warning';
import cls from 'classnames';
import * as React from 'react';

// 导入组件类型和实现
import type { HandlesProps, HandlesRef } from './Handles';
import Handles from './Handles';
import type { InternalMarkObj, MarkObj } from './Marks';
import Marks from './Marks';
import Steps from './Steps';
import Tracks from './Tracks';

// 导入上下文和钩子
import type { SliderContextProps } from './context';
import SliderContext from './context';
import useDrag from './hooks/useDrag';
import useOffset from './hooks/useOffset';
import useRange from './hooks/useRange';

// 导入类型定义
import type {
  AriaValueFormat,
  Direction,
  OnStartMove,
  SliderClassNames,
  SliderStyles,
} from './interface';

/**
 * 滑块组件的新特性说明：
 * - 点击标记来更新范围值
 * - 自定义手柄渲染
 * - 修复了手柄数量不正确的问题
 * - 修复了在某些情况下pushable不工作的问题
 * - 不再使用FindDOMNode
 * - 将所有位置相关的样式移到内联样式中
 * - 键盘操作：上键是加，下键是减
 * - 修复了step为null时与marks不对齐的问题
 * - 改变范围时不应该触发onChange
 * - 键盘支持pushable功能
 */

// 范围配置类型定义
export type RangeConfig = {
  editable?: boolean; // 是否可编辑（添加/删除手柄）
  draggableTrack?: boolean; // 是否可拖拽轨道
  /** 当`editable`为true时设置最小数量 */
  minCount?: number;
  /** 当`editable`为true时设置最大数量 */
  maxCount?: number;
};

// 滑块组件属性接口
export interface SliderProps<ValueType = number | number[]> {
  // 样式相关
  prefixCls?: string; // CSS类名前缀
  className?: string; // 自定义CSS类名
  style?: React.CSSProperties; // 自定义样式

  classNames?: SliderClassNames; // 语义化类名
  styles?: SliderStyles; // 语义化样式

  id?: string; // DOM元素ID

  // 状态相关
  disabled?: boolean; // 是否禁用
  keyboard?: boolean; // 是否支持键盘操作
  autoFocus?: boolean; // 是否自动聚焦
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void; // 聚焦事件
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void; // 失焦事件

  // 值相关
  range?: boolean | RangeConfig; // 是否为范围滑块
  /** @deprecated 使用`range.minCount`或`range.maxCount`来处理 */
  count?: number; // 手柄数量（已废弃）
  min?: number; // 最小值
  max?: number; // 最大值
  step?: number | null; // 步长
  value?: ValueType; // 当前值
  defaultValue?: ValueType; // 默认值
  onChange?: (value: ValueType) => void; // 值改变回调
  /** @deprecated 最好使用`onChange`替代 */
  onBeforeChange?: (value: ValueType) => void; // 值改变前回调（已废弃）
  /** @deprecated 使用`onChangeComplete`替代 */
  onAfterChange?: (value: ValueType) => void; // 值改变后回调（已废弃）
  onChangeComplete?: (value: ValueType) => void; // 值改变完成回调

  // 交叉相关
  allowCross?: boolean; // 是否允许交叉
  pushable?: boolean | number; // 是否可推动

  // 方向相关
  reverse?: boolean; // 是否反向
  vertical?: boolean; // 是否垂直

  // 样式相关
  included?: boolean; // 是否包含轨道
  startPoint?: number; // 起始点
  /** @deprecated 请使用`styles.track`替代 */
  trackStyle?: React.CSSProperties | React.CSSProperties[]; // 轨道样式（已废弃）
  /** @deprecated 请使用`styles.handle`替代 */
  handleStyle?: React.CSSProperties | React.CSSProperties[]; // 手柄样式（已废弃）
  /** @deprecated 请使用`styles.rail`替代 */
  railStyle?: React.CSSProperties; // 轨道样式（已废弃）
  dotStyle?: React.CSSProperties | ((dotValue: number) => React.CSSProperties); // 点样式
  activeDotStyle?: React.CSSProperties | ((dotValue: number) => React.CSSProperties); // 激活点样式

  // 装饰相关
  marks?: Record<string | number, React.ReactNode | MarkObj>; // 标记
  dots?: boolean; // 是否显示点

  // 组件相关
  handleRender?: HandlesProps['handleRender']; // 自定义手柄渲染
  activeHandleRender?: HandlesProps['handleRender']; // 自定义激活手柄渲染
  track?: boolean; // 是否显示轨道

  // 无障碍相关
  tabIndex?: number | number[]; // Tab索引
  ariaLabelForHandle?: string | string[]; // 手柄的aria标签
  ariaLabelledByForHandle?: string | string[]; // 手柄的aria标签引用
  ariaRequired?: boolean; // 是否必需
  ariaValueTextFormatterForHandle?: AriaValueFormat | AriaValueFormat[]; // 手柄值的aria文本格式化器
}

// 滑块组件引用接口
export interface SliderRef {
  focus: () => void; // 聚焦方法
  blur: () => void; // 失焦方法
}

// 滑块组件主函数
const Slider = React.forwardRef<SliderRef, SliderProps<number | number[]>>((props, ref) => {
  // 解构props并设置默认值
  const {
    prefixCls = 'rc-slider', // 默认CSS类名前缀
    className,
    style,
    classNames,
    styles,

    id,

    // 状态相关默认值
    disabled = false, // 默认不禁用
    keyboard = true, // 默认支持键盘操作
    autoFocus,
    onFocus,
    onBlur,

    // 值相关默认值
    min = 0, // 默认最小值
    max = 100, // 默认最大值
    step = 1, // 默认步长
    value,
    defaultValue,
    range,
    count,
    onChange,
    onBeforeChange,
    onAfterChange,
    onChangeComplete,

    // 交叉相关默认值
    allowCross = true, // 默认允许交叉
    pushable = false, // 默认不可推动

    // 方向相关
    reverse,
    vertical,

    // 样式相关默认值
    included = true, // 默认包含轨道
    startPoint,
    trackStyle,
    handleStyle,
    railStyle,
    dotStyle,
    activeDotStyle,

    // 装饰相关
    marks,
    dots,

    // 组件相关
    handleRender,
    activeHandleRender,
    track,

    // 无障碍相关默认值
    tabIndex = 0, // 默认Tab索引
    ariaLabelForHandle,
    ariaLabelledByForHandle,
    ariaRequired,
    ariaValueTextFormatterForHandle,
  } = props;

  // 创建引用
  const handlesRef = React.useRef<HandlesRef>(null); // 手柄组件引用
  const containerRef = React.useRef<HTMLDivElement>(null); // 容器引用

  // 计算方向
  const direction = React.useMemo<Direction>(() => {
    if (vertical) {
      return reverse ? 'ttb' : 'btt'; // 垂直：从上到下或从下到上
    }
    return reverse ? 'rtl' : 'ltr'; // 水平：从右到左或从左到右
  }, [reverse, vertical]);

  // ============================ 范围处理 =============================
  const [rangeEnabled, rangeEditable, rangeDraggableTrack, minCount, maxCount] = useRange(range);

  // 合并最小值和最大值，确保它们是有限数字
  const mergedMin = React.useMemo(() => (isFinite(min) ? min : 0), [min]);
  const mergedMax = React.useMemo(() => (isFinite(max) ? max : 100), [max]);

  // ============================= 步长处理 =============================
  const mergedStep = React.useMemo(() => (step !== null && step <= 0 ? 1 : step), [step]);

  // ============================= 推动处理 =============================
  const mergedPush = React.useMemo(() => {
    if (typeof pushable === 'boolean') {
      return pushable ? mergedStep : false; // 布尔值：true时使用步长，false时不可推动
    }
    return pushable >= 0 ? pushable : false; // 数字：大于等于0时使用该值
  }, [pushable, mergedStep]);

  // ============================ 标记处理 =============================
  const markList = React.useMemo<InternalMarkObj[]>(() => {
    return Object.keys(marks || {})
      .map<InternalMarkObj>((key) => {
        const mark = marks[key];
        const markObj: InternalMarkObj = {
          value: Number(key), // 标记的值
        };

        // 处理标记对象（包含样式和标签）
        if (
          mark &&
          typeof mark === 'object' &&
          !React.isValidElement(mark) &&
          ('label' in mark || 'style' in mark)
        ) {
          markObj.style = mark.style; // 标记样式
          markObj.label = mark.label; // 标记标签
        } else {
          markObj.label = mark as React.ReactNode; // 直接使用标记作为标签
        }

        return markObj;
      })
      .filter(({ label }) => label || typeof label === 'number') // 过滤掉空标签
      .sort((a, b) => a.value - b.value); // 按值排序
  }, [marks]);

  // ============================ 格式化处理 ============================
  const [formatValue, offsetValues] = useOffset(
    mergedMin,
    mergedMax,
    mergedStep,
    markList,
    allowCross,
    mergedPush,
  );

  // ============================ 值处理 ============================
  const [mergedValue, setValue] = useControlledState(defaultValue, value);

  const rawValues = React.useMemo(() => {
    // 将值转换为数组格式
    const valueList =
      mergedValue === null || mergedValue === undefined
        ? []
        : Array.isArray(mergedValue)
        ? mergedValue
        : [mergedValue];

    const [val0 = mergedMin] = valueList;
    let returnValues = mergedValue === null ? [] : [val0];

    // 格式化为范围模式
    if (rangeEnabled) {
      returnValues = [...valueList];

      // 当提供count或值为undefined时，填充值
      if (count || mergedValue === undefined) {
        const pointCount = count >= 0 ? count + 1 : 2;
        returnValues = returnValues.slice(0, pointCount);

        // 用count填充
        while (returnValues.length < pointCount) {
          returnValues.push(returnValues[returnValues.length - 1] ?? mergedMin);
        }
      }
      returnValues.sort((a, b) => a - b); // 排序
    }

    // 在范围内对齐
    returnValues.forEach((val, index) => {
      returnValues[index] = formatValue(val);
    });

    return returnValues;
  }, [mergedValue, rangeEnabled, mergedMin, count, formatValue]);

  // =========================== 值改变处理 ===========================
  // 获取触发值：范围模式返回数组，单值模式返回第一个值
  const getTriggerValue = (triggerValues: number[]) =>
    rangeEnabled ? triggerValues : triggerValues[0];

  // 触发值改变事件
  const triggerChange = useEvent((nextValues: number[]) => {
    // 先排序
    const cloneNextValues = [...nextValues].sort((a, b) => a - b);

    // 如果需要，触发事件
    if (onChange && !isEqual(cloneNextValues, rawValues, true)) {
      onChange(getTriggerValue(cloneNextValues));
    }

    // 稍后设置这个值，因为它会立即重新渲染组件
    setValue(cloneNextValues);
  });

  // 完成值改变
  const finishChange = useEvent((draggingDelete?: boolean) => {
    // 来自`useDrag`的触发会告诉是否是删除操作
    if (draggingDelete) {
      handlesRef.current.hideHelp();
    }

    const finishValue = getTriggerValue(rawValues);
    onAfterChange?.(finishValue);
    warning(
      !onAfterChange,
      '[rc-slider] `onAfterChange` is deprecated. Please use `onChangeComplete` instead.',
    );
    onChangeComplete?.(finishValue);
  });

  const onDelete = (index: number) => {
    if (disabled || !rangeEditable || rawValues.length <= minCount) {
      return;
    }

    const cloneNextValues = [...rawValues];
    cloneNextValues.splice(index, 1);

    onBeforeChange?.(getTriggerValue(cloneNextValues));
    triggerChange(cloneNextValues);

    const nextFocusIndex = Math.max(0, index - 1);
    handlesRef.current.hideHelp();
    handlesRef.current.focus(nextFocusIndex);
  };

  const [draggingIndex, draggingValue, draggingDelete, cacheValues, onStartDrag] = useDrag(
    containerRef,
    direction,
    rawValues,
    mergedMin,
    mergedMax,
    formatValue,
    triggerChange,
    finishChange,
    offsetValues,
    rangeEditable,
    minCount,
  );

  /**
   * When `rangeEditable` will insert a new value in the values array.
   * Else it will replace the value in the values array.
   */
  const changeToCloseValue = (newValue: number, e?: React.MouseEvent) => {
    if (!disabled) {
      // Create new values
      const cloneNextValues = [...rawValues];

      let valueIndex = 0;
      let valueBeforeIndex = 0; // Record the index which value < newValue
      let valueDist = mergedMax - mergedMin;

      rawValues.forEach((val, index) => {
        const dist = Math.abs(newValue - val);
        if (dist <= valueDist) {
          valueDist = dist;
          valueIndex = index;
        }

        if (val < newValue) {
          valueBeforeIndex = index;
        }
      });

      let focusIndex = valueIndex;

      if (rangeEditable && valueDist !== 0 && (!maxCount || rawValues.length < maxCount)) {
        cloneNextValues.splice(valueBeforeIndex + 1, 0, newValue);
        focusIndex = valueBeforeIndex + 1;
      } else {
        cloneNextValues[valueIndex] = newValue;
      }

      // Fill value to match default 2 (only when `rawValues` is empty)
      if (rangeEnabled && !rawValues.length && count === undefined) {
        cloneNextValues.push(newValue);
      }

      const nextValue = getTriggerValue(cloneNextValues);
      onBeforeChange?.(nextValue);
      triggerChange(cloneNextValues);

      if (e) {
        (document.activeElement as HTMLElement)?.blur?.();
        handlesRef.current.focus(focusIndex);
        onStartDrag(e, focusIndex, cloneNextValues);
      } else {
        // https://github.com/ant-design/ant-design/issues/49997
        onAfterChange?.(nextValue);
        warning(
          !onAfterChange,
          '[rc-slider] `onAfterChange` is deprecated. Please use `onChangeComplete` instead.',
        );
        onChangeComplete?.(nextValue);
      }
    }
  };

  // ============================ Click =============================
  const onSliderMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    const { width, height, left, top, bottom, right } =
      containerRef.current.getBoundingClientRect();
    const { clientX, clientY } = e;

    let percent: number;
    switch (direction) {
      case 'btt':
        percent = (bottom - clientY) / height;
        break;

      case 'ttb':
        percent = (clientY - top) / height;
        break;

      case 'rtl':
        percent = (right - clientX) / width;
        break;

      default:
        percent = (clientX - left) / width;
    }

    const nextValue = mergedMin + percent * (mergedMax - mergedMin);
    changeToCloseValue(formatValue(nextValue), e);
  };

  // =========================== Keyboard ===========================
  const [keyboardValue, setKeyboardValue] = React.useState<number>(null);

  const onHandleOffsetChange = (offset: number | 'min' | 'max', valueIndex: number) => {
    if (!disabled) {
      const next = offsetValues(rawValues, offset, valueIndex);

      onBeforeChange?.(getTriggerValue(rawValues));
      triggerChange(next.values);

      setKeyboardValue(next.value);
    }
  };

  React.useEffect(() => {
    if (keyboardValue !== null) {
      const valueIndex = rawValues.indexOf(keyboardValue);
      if (valueIndex >= 0) {
        handlesRef.current.focus(valueIndex);
      }
    }

    setKeyboardValue(null);
  }, [keyboardValue]);

  // ============================= Drag =============================
  const mergedDraggableTrack = React.useMemo(() => {
    if (rangeDraggableTrack && mergedStep === null) {
      if (process.env.NODE_ENV !== 'production') {
        warning(false, '`draggableTrack` is not supported when `step` is `null`.');
      }
      return false;
    }
    return rangeDraggableTrack;
  }, [rangeDraggableTrack, mergedStep]);

  const onStartMove: OnStartMove = useEvent((e, valueIndex) => {
    onStartDrag(e, valueIndex);

    onBeforeChange?.(getTriggerValue(rawValues));
  });

  // Auto focus for updated handle
  const dragging = draggingIndex !== -1;
  React.useEffect(() => {
    if (!dragging) {
      const valueIndex = rawValues.lastIndexOf(draggingValue);
      handlesRef.current.focus(valueIndex);
    }
  }, [dragging]);

  // =========================== Included ===========================
  const sortedCacheValues = React.useMemo(
    () => [...cacheValues].sort((a, b) => a - b),
    [cacheValues],
  );

  // Provide a range values with included [min, max]
  // Used for Track, Mark & Dot
  const [includedStart, includedEnd] = React.useMemo(() => {
    if (!rangeEnabled) {
      return [mergedMin, sortedCacheValues[0]];
    }

    return [sortedCacheValues[0], sortedCacheValues[sortedCacheValues.length - 1]];
  }, [sortedCacheValues, rangeEnabled, mergedMin]);

  // ============================= Refs =============================
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      handlesRef.current.focus(0);
    },
    blur: () => {
      const { activeElement } = document;
      if (containerRef.current?.contains(activeElement)) {
        (activeElement as HTMLElement)?.blur();
      }
    },
  }));

  // ========================== Auto Focus ==========================
  React.useEffect(() => {
    if (autoFocus) {
      handlesRef.current.focus(0);
    }
  }, []);

  // =========================== Context ============================
  const context = React.useMemo<SliderContextProps>(
    () => ({
      min: mergedMin,
      max: mergedMax,
      direction,
      disabled,
      keyboard,
      step: mergedStep,
      included,
      includedStart,
      includedEnd,
      range: rangeEnabled,
      tabIndex,
      ariaLabelForHandle,
      ariaLabelledByForHandle,
      ariaRequired,
      ariaValueTextFormatterForHandle,
      styles: styles || {},
      classNames: classNames || {},
    }),
    [
      mergedMin,
      mergedMax,
      direction,
      disabled,
      keyboard,
      mergedStep,
      included,
      includedStart,
      includedEnd,
      rangeEnabled,
      tabIndex,
      ariaLabelForHandle,
      ariaLabelledByForHandle,
      ariaRequired,
      ariaValueTextFormatterForHandle,
      styles,
      classNames,
    ],
  );

  // ============================ Render ============================
  return (
    <SliderContext.Provider value={context}>
      <div
        ref={containerRef}
        className={cls(prefixCls, className, {
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-vertical`]: vertical,
          [`${prefixCls}-horizontal`]: !vertical,
          [`${prefixCls}-with-marks`]: markList.length,
        })}
        style={style}
        onMouseDown={onSliderMouseDown}
        id={id}
      >
        <div
          className={cls(`${prefixCls}-rail`, classNames?.rail)}
          style={{ ...railStyle, ...styles?.rail }}
        />

        {track !== false && (
          <Tracks
            prefixCls={prefixCls}
            style={trackStyle}
            values={rawValues}
            startPoint={startPoint}
            onStartMove={mergedDraggableTrack ? onStartMove : undefined}
          />
        )}

        <Steps
          prefixCls={prefixCls}
          marks={markList}
          dots={dots}
          style={dotStyle}
          activeStyle={activeDotStyle}
        />

        <Handles
          ref={handlesRef}
          prefixCls={prefixCls}
          style={handleStyle}
          values={cacheValues}
          draggingIndex={draggingIndex}
          draggingDelete={draggingDelete}
          onStartMove={onStartMove}
          onOffsetChange={onHandleOffsetChange}
          onFocus={onFocus}
          onBlur={onBlur}
          handleRender={handleRender}
          activeHandleRender={activeHandleRender}
          onChangeComplete={finishChange}
          onDelete={rangeEditable ? onDelete : undefined}
        />

        <Marks prefixCls={prefixCls} marks={markList} onClick={changeToCloseValue} />
      </div>
    </SliderContext.Provider>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Slider.displayName = 'Slider';
}

export default Slider;

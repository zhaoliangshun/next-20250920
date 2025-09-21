// 导入依赖
import * as React from 'react';
import useEvent from '@rc-component/util/lib/hooks/useEvent';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import { UnstableContext } from '../context';
import type { Direction, OnStartMove } from '../interface';
import type { OffsetValues } from './useOffset';

/** 拖拽删除偏移量。这是用户拖拽出去的体验数字 */
const REMOVE_DIST = 130;

// 获取位置信息
function getPosition(e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) {
  const obj = 'targetTouches' in e ? e.targetTouches[0] : e;

  return { pageX: obj.pageX, pageY: obj.pageY };
}

// 拖拽钩子
function useDrag(
  containerRef: React.RefObject<HTMLDivElement>, // 容器引用
  direction: Direction, // 方向
  rawValues: number[], // 原始值数组
  min: number, // 最小值
  max: number, // 最大值
  formatValue: (value: number) => number, // 格式化值函数
  triggerChange: (values: number[]) => void, // 触发改变函数
  finishChange: (draggingDelete: boolean) => void, // 完成改变函数
  offsetValues: OffsetValues, // 偏移值函数
  editable: boolean, // 是否可编辑
  minCount: number, // 最小数量
): [
  draggingIndex: number, // 拖拽索引
  draggingValue: number, // 拖拽值
  draggingDelete: boolean, // 是否拖拽删除
  returnValues: number[], // 返回值数组
  onStartMove: OnStartMove, // 开始移动函数
] {
  // 状态管理
  const [draggingValue, setDraggingValue] = React.useState(null); // 拖拽值
  const [draggingIndex, setDraggingIndex] = React.useState(-1); // 拖拽索引
  const [draggingDelete, setDraggingDelete] = React.useState(false); // 是否拖拽删除
  const [cacheValues, setCacheValues] = React.useState(rawValues); // 缓存值
  const [originValues, setOriginValues] = React.useState(rawValues); // 原始值

  // 事件引用
  const mouseMoveEventRef = React.useRef<(event: MouseEvent) => void>(null);
  const mouseUpEventRef = React.useRef<(event: MouseEvent) => void>(null);
  const touchEventTargetRef = React.useRef<EventTarget>(null);

  // 获取不稳定上下文
  const { onDragStart, onDragChange } = React.useContext(UnstableContext);

  // 同步缓存值
  useLayoutEffect(() => {
    if (draggingIndex === -1) {
      setCacheValues(rawValues);
    }
  }, [rawValues, draggingIndex]);

  // 清理事件监听器
  React.useEffect(
    () => () => {
      document.removeEventListener('mousemove', mouseMoveEventRef.current);
      document.removeEventListener('mouseup', mouseUpEventRef.current);
      if (touchEventTargetRef.current) {
        touchEventTargetRef.current.removeEventListener('touchmove', mouseMoveEventRef.current);
        touchEventTargetRef.current.removeEventListener('touchend', mouseUpEventRef.current);
      }
    },
    [],
  );

  // 刷新值
  const flushValues = (nextValues: number[], nextValue?: number, deleteMark?: boolean) => {
    // 性能优化：只有当值改变时才更新状态
    if (nextValue !== undefined) {
      setDraggingValue(nextValue);
    }
    setCacheValues(nextValues);

    let changeValues = nextValues;
    if (deleteMark) {
      changeValues = nextValues.filter((_, i) => i !== draggingIndex);
    }
    triggerChange(changeValues);

    if (onDragChange) {
      onDragChange({
        rawValues: nextValues,
        deleteIndex: deleteMark ? draggingIndex : -1,
        draggingIndex,
        draggingValue: nextValue,
      });
    }
  };

  const updateCacheValue = useEvent(
    (valueIndex: number, offsetPercent: number, deleteMark: boolean) => {
      if (valueIndex === -1) {
        // >>>> Dragging on the track
        const startValue = originValues[0];
        const endValue = originValues[originValues.length - 1];
        const maxStartOffset = min - startValue;
        const maxEndOffset = max - endValue;

        // Get valid offset
        let offset = offsetPercent * (max - min);
        offset = Math.max(offset, maxStartOffset);
        offset = Math.min(offset, maxEndOffset);

        // Use first value to revert back of valid offset (like steps marks)
        const formatStartValue = formatValue(startValue + offset);
        offset = formatStartValue - startValue;
        const cloneCacheValues = originValues.map<number>((val) => val + offset);
        flushValues(cloneCacheValues);
      } else {
        // >>>> Dragging on the handle
        const offsetDist = (max - min) * offsetPercent;

        // Always start with the valueIndex origin value
        const cloneValues = [...cacheValues];
        cloneValues[valueIndex] = originValues[valueIndex];

        const next = offsetValues(cloneValues, offsetDist, valueIndex, 'dist');

        flushValues(next.values, next.value, deleteMark);
      }
    },
  );

  const onStartMove: OnStartMove = (e, valueIndex, startValues?: number[]) => {
    e.stopPropagation();

    // 如果是点击 track 触发的，需要传入变化后的初始值，而不能直接用 rawValues
    const initialValues = startValues || rawValues;
    const originValue = initialValues[valueIndex];

    setDraggingIndex(valueIndex);
    setDraggingValue(originValue);
    setOriginValues(initialValues);
    setCacheValues(initialValues);
    setDraggingDelete(false);

    const { pageX: startX, pageY: startY } = getPosition(e);

    // We declare it here since closure can't get outer latest value
    let deleteMark = false;

    // Internal trigger event
    if (onDragStart) {
      onDragStart({
        rawValues: initialValues,
        draggingIndex: valueIndex,
        draggingValue: originValue,
      });
    }

    // Moving
    const onMouseMove = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      const { pageX: moveX, pageY: moveY } = getPosition(event);
      const offsetX = moveX - startX;
      const offsetY = moveY - startY;

      const { width, height } = containerRef.current.getBoundingClientRect();

      let offSetPercent: number;
      let removeDist: number;

      switch (direction) {
        case 'btt':
          offSetPercent = -offsetY / height;
          removeDist = offsetX;
          break;

        case 'ttb':
          offSetPercent = offsetY / height;
          removeDist = offsetX;
          break;

        case 'rtl':
          offSetPercent = -offsetX / width;
          removeDist = offsetY;
          break;

        default:
          offSetPercent = offsetX / width;
          removeDist = offsetY;
      }

      // Check if need mark remove
      deleteMark = editable
        ? Math.abs(removeDist) > REMOVE_DIST && minCount < cacheValues.length
        : false;
      setDraggingDelete(deleteMark);

      updateCacheValue(valueIndex, offSetPercent, deleteMark);
    };

    // End
    const onMouseUp = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      if (touchEventTargetRef.current) {
        touchEventTargetRef.current.removeEventListener('touchmove', mouseMoveEventRef.current);
        touchEventTargetRef.current.removeEventListener('touchend', mouseUpEventRef.current);
      }
      mouseMoveEventRef.current = null;
      mouseUpEventRef.current = null;
      touchEventTargetRef.current = null;

      finishChange(deleteMark);

      setDraggingIndex(-1);
      setDraggingDelete(false);
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    e.currentTarget.addEventListener('touchend', onMouseUp);
    e.currentTarget.addEventListener('touchmove', onMouseMove);
    mouseMoveEventRef.current = onMouseMove;
    mouseUpEventRef.current = onMouseUp;
    touchEventTargetRef.current = e.currentTarget;
  };

  // Only return cache value when it mapping with rawValues
  const returnValues = React.useMemo(() => {
    const sourceValues = [...rawValues].sort((a, b) => a - b);
    const targetValues = [...cacheValues].sort((a, b) => a - b);

    const counts: Record<number, number> = {};
    targetValues.forEach((val) => {
      counts[val] = (counts[val] || 0) + 1;
    });
    sourceValues.forEach((val) => {
      counts[val] = (counts[val] || 0) - 1;
    });

    const maxDiffCount = editable ? 1 : 0;
    const diffCount: number = Object.values(counts).reduce(
      (prev, next) => prev + Math.abs(next),
      0,
    );

    return diffCount <= maxDiffCount ? cacheValues : rawValues;
  }, [rawValues, cacheValues, editable]);

  return [draggingIndex, draggingValue, draggingDelete, returnValues, onStartMove];
}

export default useDrag;

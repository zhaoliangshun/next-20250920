// 导入依赖
import * as React from 'react';
import type { InternalMarkObj } from '../Marks';

/** 在[min, max]范围内格式化值 */
type FormatRangeValue = (value: number) => number;

/** 与步长对齐格式化值 */
type FormatStepValue = (value: number) => number;

/** 与步长和标记对齐格式化值 */
type FormatValue = (value: number) => number;

// 偏移模式
type OffsetMode = 'unit' | 'dist';

// 偏移值函数类型
type OffsetValue = (
  values: number[],
  offset: number | 'min' | 'max',
  valueIndex: number,
  mode?: OffsetMode,
) => number;

// 偏移值集合函数类型
export type OffsetValues = (
  values: number[],
  offset: number | 'min' | 'max',
  valueIndex: number,
  mode?: OffsetMode,
) => {
  value: number;
  values: number[];
};

// 偏移钩子
export default function useOffset(
  min: number, // 最小值
  max: number, // 最大值
  step: number, // 步长
  markList: InternalMarkObj[], // 标记列表
  allowCross: boolean, // 是否允许交叉
  pushable: false | number, // 是否可推动
): [FormatValue, OffsetValues] {
  // 格式化范围值
  const formatRangeValue: FormatRangeValue = React.useCallback(
    (val) => Math.max(min, Math.min(max, val)),
    [min, max],
  );

  // 格式化步长值
  const formatStepValue: FormatStepValue = React.useCallback(
    (val) => {
      if (step !== null) {
        const stepValue = min + Math.round((formatRangeValue(val) - min) / step) * step;

        // 处理浮点数精度问题，避免出现0.30000000000000004这样的情况
        const getDecimal = (num: number) => (String(num).split('.')[1] || '').length;
        const maxDecimal = Math.max(getDecimal(step), getDecimal(max), getDecimal(min));
        const fixedValue = Number(stepValue.toFixed(maxDecimal));

        return min <= fixedValue && fixedValue <= max ? fixedValue : null;
      }
      return null;
    },
    [step, min, max, formatRangeValue],
  );

  // 格式化值（与步长和标记对齐）
  const formatValue = React.useCallback<FormatValue>(
    (val) => {
      const formatNextValue = formatRangeValue(val);

      // 对齐值列表
      const alignValues = markList.map<number>((mark) => mark.value);
      if (step !== null) {
        alignValues.push(formatStepValue(val));
      }

      // 最小值和最大值
      alignValues.push(min, max);

      // 与标记对齐
      let closeValue = alignValues[0];
      let closeDist = max - min;

      alignValues.forEach((alignValue) => {
        const dist = Math.abs(formatNextValue - alignValue);
        if (dist <= closeDist) {
          closeValue = alignValue;
          closeDist = dist;
        }
      });

      return closeValue;
    },
    [min, max, markList, step, formatRangeValue, formatStepValue],
  );

  // ========================== Offset ==========================
  // Single Value
  const offsetValue: OffsetValue = (values, offset, valueIndex, mode = 'unit') => {
    if (typeof offset === 'number') {
      let nextValue: number;
      const originValue = values[valueIndex];

      // Only used for `dist` mode
      const targetDistValue = originValue + offset;

      // Compare next step value & mark value which is best match
      let potentialValues: number[] = [];
      markList.forEach((mark) => {
        potentialValues.push(mark.value);
      });

      // Min & Max
      potentialValues.push(min, max);

      // In case origin value is align with mark but not with step
      potentialValues.push(formatStepValue(originValue));

      // Put offset step value also
      const sign = offset > 0 ? 1 : -1;

      if (mode === 'unit') {
        potentialValues.push(formatStepValue(originValue + sign * step));
      } else {
        potentialValues.push(formatStepValue(targetDistValue));
      }

      // Find close one
      potentialValues = potentialValues
        .filter((val) => val !== null)
        // Remove reverse value
        .filter((val) => (offset < 0 ? val <= originValue : val >= originValue));

      if (mode === 'unit') {
        // `unit` mode can not contain itself
        potentialValues = potentialValues.filter((val) => val !== originValue);
      }

      const compareValue = mode === 'unit' ? originValue : targetDistValue;

      nextValue = potentialValues[0];
      let valueDist = Math.abs(nextValue - compareValue);

      potentialValues.forEach((potentialValue) => {
        const dist = Math.abs(potentialValue - compareValue);
        if (dist < valueDist) {
          nextValue = potentialValue;
          valueDist = dist;
        }
      });

      // Out of range will back to range
      if (nextValue === undefined) {
        return offset < 0 ? min : max;
      }

      // `dist` mode
      if (mode === 'dist') {
        return nextValue;
      }

      // `unit` mode may need another round
      if (Math.abs(offset) > 1) {
        const cloneValues = [...values];
        cloneValues[valueIndex] = nextValue;

        return offsetValue(cloneValues, offset - sign, valueIndex, mode);
      }

      return nextValue;
    } else if (offset === 'min') {
      return min;
    } else if (offset === 'max') {
      return max;
    }
  };

  /** Same as `offsetValue` but return `changed` mark to tell value changed */
  const offsetChangedValue = (
    values: number[],
    offset: number,
    valueIndex: number,
    mode: OffsetMode = 'unit',
  ) => {
    const originValue = values[valueIndex];
    const nextValue = offsetValue(values, offset, valueIndex, mode);
    return {
      value: nextValue,
      changed: nextValue !== originValue,
    };
  };

  const needPush = (dist: number) => {
    return (pushable === null && dist === 0) || (typeof pushable === 'number' && dist < pushable);
  };

  // Values
  const offsetValues: OffsetValues = (values, offset, valueIndex, mode = 'unit') => {
    const nextValues = values.map<number>(formatValue);
    const originValue = nextValues[valueIndex];
    const nextValue = offsetValue(nextValues, offset, valueIndex, mode);
    nextValues[valueIndex] = nextValue;

    if (allowCross === false) {
      // >>>>> Allow Cross
      const pushNum = pushable || 0;

      // ============ AllowCross ===============
      if (valueIndex > 0 && nextValues[valueIndex - 1] !== originValue) {
        nextValues[valueIndex] = Math.max(
          nextValues[valueIndex],
          nextValues[valueIndex - 1] + pushNum,
        );
      }

      if (valueIndex < nextValues.length - 1 && nextValues[valueIndex + 1] !== originValue) {
        nextValues[valueIndex] = Math.min(
          nextValues[valueIndex],
          nextValues[valueIndex + 1] - pushNum,
        );
      }
    } else if (typeof pushable === 'number' || pushable === null) {
      // >>>>> Pushable
      // =============== Push ==================

      // >>>>>> Basic push
      // End values
      for (let i = valueIndex + 1; i < nextValues.length; i += 1) {
        let changed = true;
        while (needPush(nextValues[i] - nextValues[i - 1]) && changed) {
          ({ value: nextValues[i], changed } = offsetChangedValue(nextValues, 1, i));
        }
      }

      // Start values
      for (let i = valueIndex; i > 0; i -= 1) {
        let changed = true;
        while (needPush(nextValues[i] - nextValues[i - 1]) && changed) {
          ({ value: nextValues[i - 1], changed } = offsetChangedValue(nextValues, -1, i - 1));
        }
      }

      // >>>>> Revert back to safe push range
      // End to Start
      for (let i = nextValues.length - 1; i > 0; i -= 1) {
        let changed = true;
        while (needPush(nextValues[i] - nextValues[i - 1]) && changed) {
          ({ value: nextValues[i - 1], changed } = offsetChangedValue(nextValues, -1, i - 1));
        }
      }

      // Start to End
      for (let i = 0; i < nextValues.length - 1; i += 1) {
        let changed = true;
        while (needPush(nextValues[i + 1] - nextValues[i]) && changed) {
          ({ value: nextValues[i + 1], changed } = offsetChangedValue(nextValues, 1, i + 1));
        }
      }
    }

    return {
      value: nextValues[valueIndex],
      values: nextValues,
    };
  };

  return [formatValue, offsetValues];
}

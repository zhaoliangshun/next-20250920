import { useCallback, useEffect, useMemo, useRef } from 'react'
import { usePickerActions, usePickerData } from './Picker'
import { useColumnData } from './PickerColumn'

/**
 * 检查是否为函数的工具函数
 * @param functionToCheck 要检查的值
 * @returns 是否为函数
 */
function isFunction(functionToCheck) {
  return typeof functionToCheck === 'function'
}

/**
 * 选择项组件
 * 表示选择器中的一个可选项
 */
function PickerItem({
  style,
  children,
  value,
  ...restProps
}) {
  // DOM 元素引用
  const optionRef = useRef(null)
  
  // 从上下文获取选择器数据
  const { itemHeight, value: pickerValue } = usePickerData('Picker.Item')
  const pickerActions = usePickerActions('Picker.Item')
  const { key } = useColumnData('Picker.Item')

  // 注册选项到选择器
  useEffect(
    () => pickerActions.registerOption(key, { value, element: optionRef }),
    [key, pickerActions, value],
  )

  // 选择项样式
  const itemStyle = useMemo(
    () => ({
      height: `${itemHeight}px`, // 固定高度
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    [itemHeight],
  )

  /**
   * 点击事件处理函数
   * 点击时选中当前项
   */
  const handleClick = useCallback(() => {
    pickerActions.change(key, value)
  }, [pickerActions, key, value])

  return (
    <div
      style={{
        ...itemStyle,
        ...style,
      }}
      ref={optionRef}
      onClick={handleClick}
      {...restProps}
    >
      {/* 支持函数子元素，传递选中状态 */}
      {isFunction(children) ? children({ selected: pickerValue[key] === value }) : children}
    </div>
  )
}

export default PickerItem
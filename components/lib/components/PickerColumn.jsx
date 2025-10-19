/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { usePickerActions, usePickerData } from "./Picker"

// 列数据上下文，用于向下传递列相关信息
const PickerColumnDataContext = createContext(null)
PickerColumnDataContext.displayName = 'PickerColumnDataContext'

/**
 * 使用列数据的 Hook
 * @param componentName 组件名称，用于错误提示
 * @returns 列数据上下文
 */
export function useColumnData(componentName) {
  const context = useContext(PickerColumnDataContext)
  if (context === null) {
    const error = new Error(`<${componentName} /> is missing a parent <Picker.Column /> component.`)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, useColumnData)
    }
    throw error
  }
  return context
}

/**
 * 选择器列组件
 * 处理单列的滚动和选择逻辑
 */
function PickerColumn({
  style,
  children,
  name: key,
  ...restProps
}) {
  // 从父组件获取选择器数据
  const { height, itemHeight, wheelMode, value: groupValue, optionGroups } = usePickerData('Picker.Column')

  // 计算当前选中值
  const value = useMemo(
    () => groupValue[key],
    [groupValue, key],
  )
  
  // 获取当前列的选项
  const options = useMemo(
    () => optionGroups[key] || [],
    [key, optionGroups],
  )
  
  // 计算选中项的索引
  const selectedIndex = useMemo(
    () => {
      let index = options.findIndex((o) => o.value === value)
      if (index < 0) {
        index = 0 // 如果没有找到匹配项，默认选中第一个
      }
      return index
    },
    [options, value],
  )

  // 计算滚动器的平移范围
  const minTranslate = useMemo(
    () => height / 2 - itemHeight * options.length + itemHeight / 2, // 最小平移值（滚动到底部）
    [height, itemHeight, options],
  )
  const maxTranslate = useMemo(
    () => height / 2 - itemHeight / 2, // 最大平移值（滚动到顶部）
    [height, itemHeight],
  )
  
  // 滚动器平移状态
  const [scrollerTranslate, setScrollerTranslate] = useState(0)
  
  // 当选中项变化时更新滚动位置
  useEffect(() => {
    setScrollerTranslate(height / 2 - itemHeight / 2 - selectedIndex * itemHeight)
  }, [height, itemHeight, selectedIndex])

  // 获取选择器操作函数
  const pickerActions = usePickerActions('Picker.Column')
  const translateRef = useRef(scrollerTranslate)
  translateRef.current = scrollerTranslate
  
  /**
   * 处理滚动器平移结束时的回调
   * 确定最终选中的项并触发值变化
   */
  const handleScrollerTranslateSettled = useCallback(() => {
    let nextActiveIndex = 0
    const currentTrans = translateRef.current
    
    // 根据当前位置计算选中索引
    if (currentTrans >= maxTranslate) {
      nextActiveIndex = 0 // 滚动到顶部，选中第一个
    } else if (currentTrans <= minTranslate) {
      nextActiveIndex = options.length - 1 // 滚动到底部，选中最后一个
    } else {
      nextActiveIndex = -Math.round((currentTrans - maxTranslate) / itemHeight) // 计算中间位置
    }

    // 触发值变化
    const changed = pickerActions.change(key, options[nextActiveIndex].value)
    if (!changed) {
      // 如果值没有变化，回滚到正确位置
      setScrollerTranslate(height / 2 - itemHeight / 2 - nextActiveIndex * itemHeight)
    }
  }, [pickerActions, height, itemHeight, key, maxTranslate, minTranslate, options])
  
  // 触摸事件相关状态
  const [startScrollerTranslate, setStartScrollerTranslate] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [startTouchY, setStartTouchY] = useState(0)

  /**
   * 更新移动过程中的滚动器位置
   * 添加边界弹性效果
   */
  const updateScrollerWhileMoving = useCallback((nextScrollerTranslate) => {
    if (nextScrollerTranslate < minTranslate) {
      // 超出底部边界，添加弹性效果
      nextScrollerTranslate = minTranslate - Math.pow(minTranslate - nextScrollerTranslate, 0.8)
    } else if (nextScrollerTranslate > maxTranslate) {
      // 超出顶部边界，添加弹性效果
      nextScrollerTranslate = maxTranslate + Math.pow(nextScrollerTranslate - maxTranslate, 0.8)
    }
    setScrollerTranslate(nextScrollerTranslate)
  }, [maxTranslate, minTranslate])

  // 触摸开始事件处理
  const handleTouchStart = useCallback((event) => {
    setStartTouchY(event.targetTouches[0].pageY) // 记录起始触摸位置
    setStartScrollerTranslate(scrollerTranslate) // 记录起始滚动位置
  }, [scrollerTranslate])

  // 触摸移动事件处理
  const handleTouchMove = useCallback((event) => {
    if (event.cancelable) {
      event.preventDefault() // 阻止默认滚动行为
    }

    if (!isMoving) {
      setIsMoving(true) // 标记为移动状态
    }

    // 计算新的滚动位置
    const nextScrollerTranslate = startScrollerTranslate + event.targetTouches[0].pageY - startTouchY
    updateScrollerWhileMoving(nextScrollerTranslate)
  }, [isMoving, startScrollerTranslate, startTouchY, updateScrollerWhileMoving])

  // 触摸结束事件处理
  const handleTouchEnd = useCallback(() => {
    if (!isMoving) {
      return
    }
    setIsMoving(false)
    setStartTouchY(0)
    setStartScrollerTranslate(0)

    handleScrollerTranslateSettled() // 处理滚动结束
  }, [handleScrollerTranslateSettled, isMoving])

  // 触摸取消事件处理
  const handleTouchCancel = useCallback(() => {
    if (!isMoving) {
      return
    }
    setIsMoving(false)
    setStartTouchY(0)
    setScrollerTranslate(startScrollerTranslate) // 回滚到起始位置
    setStartScrollerTranslate(0)
  }, [isMoving, startScrollerTranslate])

  // 滚轮事件相关
  const wheelingTimer = useRef(null)

  /**
   * 处理滚轮滚动
   */
  const handleWheeling = useCallback((event) => {
    if (event.deltaY === 0) {
      return
    }
    let delta = event.deltaY * 0.1 // 缩放滚轮增量
    if (Math.abs(delta) < itemHeight) {
      delta = itemHeight * Math.sign(delta) // 确保最小滚动距离
    }
    if (wheelMode === 'normal') {
      delta = -delta // 反转滚轮方向
    }

    const nextScrollerTranslate = scrollerTranslate + delta
    updateScrollerWhileMoving(nextScrollerTranslate)
  }, [itemHeight, scrollerTranslate, updateScrollerWhileMoving, wheelMode])

  /**
   * 处理滚轮滚动结束
   */
  const handleWheelEnd = useCallback(() => {
    handleScrollerTranslateSettled()
  }, [handleScrollerTranslateSettled])

  /**
   * 滚轮事件处理函数
   */
  const handleWheel = useCallback((event) => {
    if (wheelMode === 'off') {
      return // 如果滚轮模式关闭，不处理
    }

    if (event.cancelable) {
      event.preventDefault() // 阻止默认滚动行为
    }

    handleWheeling(event)

    // 设置滚轮结束定时器
    if (wheelingTimer.current) {
      clearTimeout(wheelingTimer.current)
    }

    wheelingTimer.current = setTimeout(() => {
      handleWheelEnd()
    }, 200)
  }, [handleWheelEnd, handleWheeling, wheelingTimer, wheelMode])

  // 添加事件监听器
  // 'touchmove' 和 'wheel' 事件不能是被动的，以便调用 preventDefault()
  const containerRef = useRef(null)
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
      container.addEventListener('wheel', handleWheel, { passive: false })
    }
    return () => {
      if (container) {
        container.removeEventListener('touchmove', handleTouchMove)
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [handleTouchMove, handleWheel])

  // 列样式
  const columnStyle = useMemo(
    () => ({
      flex: '1 1 0%', // 弹性布局
      maxHeight: '100%',
      transitionProperty: 'transform', // 过渡效果
      transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)', // 缓动函数
      transitionDuration: isMoving ? '0ms' : '300ms', // 移动时不使用过渡
      transform: `translate3d(0, ${scrollerTranslate}px, 0)`, // 3D 变换提升性能
    }),
    [scrollerTranslate, isMoving],
  )

  // 列数据上下文值
  const columnData = useMemo(
    () => ({ key }),
    [key],
  )

  return (
    <div
      style={{
        ...columnStyle,
        ...style,
      }}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      {...restProps}
    >
      {/* 提供列数据上下文 */}
      <PickerColumnDataContext.Provider value={columnData}>
        {children}
      </PickerColumnDataContext.Provider>
    </div>
  )
}

export default PickerColumn
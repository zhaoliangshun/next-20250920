/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'

// 默认配置常量
const DEFAULT_HEIGHT = 216 // 选择器默认高度
const DEFAULT_ITEM_HEIGHT = 36 // 选择项默认高度
const DEFAULT_WHEEL_MODE = 'off' // 默认滚轮模式

// 选择器数据上下文，用于向下传递选择器状态
const PickerDataContext = createContext(null)
PickerDataContext.displayName = 'PickerDataContext'

/**
 * 使用选择器数据的 Hook
 * @param componentName 组件名称，用于错误提示
 * @returns 选择器数据上下文
 */
export function usePickerData(componentName) {
  const context = useContext(PickerDataContext)
  if (context === null) {
    const error = new Error(`<${componentName} /> is missing a parent <Picker /> component.`)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, usePickerData)
    }
    throw error
  }
  return context
}

// 选择器操作上下文，用于向下传递选择器操作方法
const PickerActionsContext = createContext(null)
PickerActionsContext.displayName = 'PickerActionsContext'

/**
 * 使用选择器操作的 Hook
 * @param componentName 组件名称，用于错误提示
 * @returns 选择器操作上下文
 */
export function usePickerActions(componentName) {
  const context = useContext(PickerActionsContext)
  if (context === null) {
    const error = new Error(`<${componentName} /> is missing a parent <Picker /> component.`)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, usePickerActions)
    }
    throw error
  }
  return context
}

/**
 * 根据 DOM 节点位置排序数组
 * @param nodes 要排序的数组
 * @param resolveKey 解析 DOM 节点的函数
 * @returns 排序后的数组
 */
function sortByDomNode(nodes, resolveKey = (i) => i) {
  return nodes.slice().sort((aItem, zItem) => {
    const a = resolveKey(aItem)
    const z = resolveKey(zItem)

    if (a === null || z === null) return 0

    const position = a.compareDocumentPosition(z)

    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })
}

/**
 * 选择器选项组 reducer 函数
 * 管理选项的注册和注销
 */
function pickerReducer(optionGroups, action) {
  switch (action.type) {
    case 'REGISTER_OPTION': {
      const { key, option } = action
      let nextOptionsForKey = [...(optionGroups[key] || []), option]
      // 按 DOM 节点位置排序选项
      nextOptionsForKey = sortByDomNode(nextOptionsForKey, (o) => o.element.current)
      return {
        ...optionGroups,
        [key]: nextOptionsForKey,
      }
    }
    case 'UNREGISTER_OPTION': {
      const { key, option } = action
      return {
        ...optionGroups,
        [key]: (optionGroups[key] || []).filter((o) => o !== option),
      }
    }
    default: {
      throw Error(`Unknown action: ${action.type}`)
    }
  }
}

/**
 * 选择器根组件
 * 提供选择器的容器和基本功能
 */
function PickerRoot(props) {
  const {
    style,
    children,
    value,
    onChange,
    height = DEFAULT_HEIGHT,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    wheelMode = DEFAULT_WHEEL_MODE,
    ...restProps
  } = props

  // 高亮样式，用于显示当前选中项的指示器
  const highlightStyle = useMemo(
    () => ({
      height: itemHeight,
      marginTop: -(itemHeight / 2),
      position: 'absolute',
      top: '50%',
      left: 0,
      width: '100%',
      pointerEvents: 'none',
    }),
    [itemHeight]
  )
  
  // 容器样式，包含遮罩效果
  const containerStyle = useMemo(
    () => ({
      height: `${height}px`,
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      overflow: 'hidden',
      maskImage: 'linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent)',
      WebkitMaskImage: 'linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent)',
    }),
    [height]
  )

  // 使用 reducer 管理选项组状态
  const [optionGroups, dispatch] = useReducer(pickerReducer, {})

  // 选择器数据，通过上下文传递给子组件
  const pickerData = useMemo(
    () => ({ height, itemHeight, wheelMode, value, optionGroups }),
    [height, itemHeight, value, optionGroups, wheelMode]
  )
  
  // 触发值变化的回调函数
  const triggerChange = useCallback((key, nextValue) => {
    if (value[key] === nextValue) return false
    const nextPickerValue = { ...value, [key]: nextValue }
    onChange(nextPickerValue, key)
    return true
  }, [onChange, value])
  
  // 注册选项的函数
  const registerOption = useCallback((key, option) => {
    dispatch({ type: 'REGISTER_OPTION', key, option })
    return () => dispatch({ type: 'UNREGISTER_OPTION', key, option })
  }, [])
  
  // 选择器操作，通过上下文传递给子组件
  const pickerActions = useMemo(
    () => ({ registerOption, change: triggerChange }),
    [registerOption, triggerChange]
  )

  return (
    <div
      style={{
        ...containerStyle,
        ...style,
      }}
      {...restProps}
    >
      {/* 提供操作上下文 */}
      <PickerActionsContext.Provider value={pickerActions}>
        {/* 提供数据上下文 */}
        <PickerDataContext.Provider value={pickerData}>
          {children}
        </PickerDataContext.Provider>
      </PickerActionsContext.Provider>
      {/* 高亮指示器 */}
      <div
        style={highlightStyle}
      >
        {/* 上边框 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 'auto',
            left: 0,
            right: 'auto',
            width: '100%',
            height: '1px',
            background: '#d9d9d9',
            transform: 'scaleY(0.5)',
          }}
        />
        {/* 下边框 */}
        <div
          style={{
            position: 'absolute',
            top: 'auto',
            bottom: 0,
            left: 0,
            right: 'auto',
            width: '100%',
            height: '1px',
            background: '#d9d9d9',
            transform: 'scaleY(0.5)',
          }}
        />
      </div>
    </div>
  )
}

export default PickerRoot
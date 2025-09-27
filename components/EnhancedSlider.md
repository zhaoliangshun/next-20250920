# 增强型滑块组件 (EnhancedSlider)

一个功能丰富、高性能的 React 滑块组件，支持单值、范围、步长、标记、区间颜色、主题、动画等功能。

## 特性

- 支持单值和范围滑块
- 支持垂直和水平方向
- 支持步长设置
- 支持标记显示
- 支持区间颜色配置
- 支持多种主题
- 支持自定义样式
- 支持工具提示
- 支持键盘操作
- 支持无障碍访问
- 高性能拖拽体验

## 安装

```bash
# 组件已包含在项目中，无需额外安装
```

## 基本用法

```jsx
import EnhancedSlider from '../components/EnhancedSlider';

// 基础滑块
<EnhancedSlider 
  value={50} 
  onChange={(value) => console.log(value)} 
/>

// 范围滑块
<EnhancedSlider 
  range 
  value={[20, 80]} 
  onChange={(value) => console.log(value)} 
/>
```

## API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `min` | 最小值 | `number` | `0` |
| `max` | 最大值 | `number` | `100` |
| `step` | 步长，设置为 `null` 时为连续滑块 | `number \| null` | `1` |
| `value` | 当前值 | `number \| number[]` | - |
| `defaultValue` | 默认值 | `number \| number[]` | - |
| `range` | 是否为范围滑块 | `boolean \| object` | `false` |
| `marks` | 标记配置 | `object` | `{}` |
| `ranges` | 区间颜色配置 | `Array<{ start, end, color }>` | `[]` |
| `onChange` | 值变化时的回调函数 | `(value) => void` | - |
| `onChangeComplete` | 值变化完成时的回调函数 | `(value) => void` | - |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `vertical` | 是否垂直方向 | `boolean` | `false` |
| `tooltip` | 工具提示配置 | `boolean \| object` | `true` |
| `showMarks` | 是否显示标记 | `boolean` | `true` |
| `theme` | 主题 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'custom'` | `'default'` |
| `trackColor` | 轨道颜色 | `string` | - |
| `railColor` | 轨道背景颜色 | `string` | - |
| `handleColor` | 手柄颜色 | `string` | - |
| `animation` | 是否启用动画 | `boolean` | `true` |
| `animationDuration` | 动画持续时间（毫秒） | `number` | `200` |
| `className` | 自定义类名 | `string` | - |
| `style` | 自定义样式 | `React.CSSProperties` | - |
| `id` | 组件 ID | `string` | - |
| `ariaLabel` | 无障碍标签 | `string \| string[]` | - |
| `ariaValueText` | 无障碍值文本 | `string \| string[]` | - |

### range 对象属性

当 `range` 为对象时，可以设置以下属性：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `editable` | 是否可编辑（添加/删除手柄） | `boolean` | `false` |
| `draggableTrack` | 是否可拖拽轨道 | `boolean` | `false` |
| `minCount` | 最小手柄数量 | `number` | `2` |
| `maxCount` | 最大手柄数量 | `number` | `2` |

### tooltip 对象属性

当 `tooltip` 为对象时，可以设置以下属性：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `formatter` | 格式化函数 | `(value) => React.ReactNode` | - |
| `placement` | 位置 | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |
| `visible` | 是否始终可见 | `boolean` | - |

## 示例

查看 `app/slider-demo/page.tsx` 获取更多使用示例。

## 自定义主题

可以通过 CSS 变量自定义主题：

```css
:root {
  --slider-primary-color: #1890ff;
  --slider-success-color: #52c41a;
  --slider-warning-color: #faad14;
  --slider-danger-color: #f5222d;
  
  --slider-track-color: #1890ff;
  --slider-rail-color: #f5f5f5;
  --slider-handle-color: #fff;
  --slider-handle-border-color: #1890ff;
  --slider-handle-active-color: #1890ff;
  --slider-handle-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  --slider-handle-active-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  
  --slider-mark-color: #e8e8e8;
  --slider-mark-active-color: #1890ff;
  
  --slider-tooltip-bg: rgba(0, 0, 0, 0.75);
  --slider-tooltip-color: #fff;
  --slider-tooltip-arrow-size: 4px;
  
  --slider-animation-duration: 200ms;
}
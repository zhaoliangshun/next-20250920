# BottomFixedContainer 使用文档

## 问题背景

在 iOS 18 iPhone Safari 浏览器中，当使用 `position: fixed` 和 `bottom: env(safe-area-inset-bottom, 0)` 布局时，数字键盘弹出会覆盖底部固定内容，导致用户无法看到或操作被遮挡的元素。

## 解决方案

`BottomFixedContainer` 组件通过以下方式解决了这个问题：

1. **自动检测键盘状态**：监听 `visualViewport` API 变化来检测键盘弹出
2. **动态调整位置**：使用 `transform: translateY()` 在 iOS Safari 中移动容器
3. **智能滚动**：自动将输入框滚动到可见区域
4. **平滑过渡**：添加过渡动画使布局变化更自然

## 使用方法

### 基础用法

```jsx
import BottomFixedContainer from '@/components/BottomFixedContainer';

function MyPage() {
  return (
    <div>
      <main>
        {/* 页面内容 */}
        <input type="text" placeholder="姓名" />
        <input type="number" placeholder="手机号" />
      </main>
      
      <BottomFixedContainer>
        <button>提交</button>
      </BottomFixedContainer>
    </div>
  );
}
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | ReactNode | - | 容器内容 |
| `className` | string | '' | 自定义类名 |
| `adjustForKeyboard` | boolean | true | 是否自动适配键盘 |
| `...props` | object | - | 其他 div 属性 |

### 高级用法

#### 禁用键盘自动适配

```jsx
<BottomFixedContainer adjustForKeyboard={false}>
  <div>不需要适配键盘的固定内容</div>
</BottomFixedContainer>
```

#### 自定义样式

```jsx
<BottomFixedContainer 
  className="custom-bottom-bar"
  style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.1)' }}
>
  <button>确认</button>
</BottomFixedContainer>
```

## 工作原理

### 1. 键盘检测

```javascript
// 通过视口高度变化检测键盘
const keyboardHeight = initialHeight - currentHeight;
const isKeyboardOpen = keyboardHeight > 50;
```

### 2. iOS 18 特殊处理

在 iOS 18 Safari 中，使用 `transform` 替代 `bottom` 属性：

```javascript
if (isIOS && isSafari) {
  setContainerStyle({
    transform: `translateY(-${keyboardHeight}px)`,
    transition: 'transform 0.3s ease-out',
  });
}
```

### 3. 输入框滚动

当输入框获得焦点时，自动滚动到可见区域：

```javascript
target.scrollIntoView({
  behavior: 'smooth',
  block: 'center',
  inline: 'nearest'
});
```

## 必需的 HTML 设置

确保在 `<head>` 中包含以下 meta 标签：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

## 浏览器兼容性

| 浏览器 | 版本 | 支持情况 |
|--------|------|---------|
| iOS Safari | 15+ | ✅ 完全支持 |
| iOS Safari | 18+ | ✅ 特别优化 |
| Android Chrome | 所有版本 | ✅ 支持 |
| 桌面浏览器 | 所有版本 | ✅ 支持（无键盘问题） |

## 常见问题

### Q1: 键盘弹出时内容仍然被遮挡

**解决方案**：
1. 检查是否正确导入组件
2. 确保 viewport meta 标签正确设置
3. 检查是否有其他 CSS 影响了 fixed 定位

### Q2: 过渡动画不够流畅

**解决方案**：
```css
/* 添加硬件加速 */
.your-container {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: transform;
}
```

### Q3: 在某些输入框上不生效

**解决方案**：
确保输入框的 `type` 属性正确设置（如 `type="number"`, `type="tel"` 等）

### Q4: 需要在键盘弹出时执行自定义逻辑

**解决方案**：
可以通过监听 `visualViewport` 事件：

```javascript
useEffect(() => {
  const handleKeyboard = () => {
    const keyboardHeight = window.innerHeight - window.visualViewport.height;
    if (keyboardHeight > 50) {
      // 键盘弹出时的自定义逻辑
    }
  };
  
  window.visualViewport?.addEventListener('resize', handleKeyboard);
  return () => {
    window.visualViewport?.removeEventListener('resize', handleKeyboard);
  };
}, []);
```

## 性能优化建议

1. **使用 CSS transform**：比修改 top/bottom 性能更好
2. **启用硬件加速**：使用 `translateZ(0)`
3. **避免频繁重绘**：使用 `will-change` 属性
4. **合理设置防抖延迟**：默认 300ms 适合大多数场景

## 示例项目

查看完整示例：
- `/app/demo-fixed-bottom` - 基础示例
- `/app/form-demo` - 表单示例

## 更新日志

### v1.1.0 (2025-11-06)
- ✅ 特别优化 iOS 18 兼容性
- ✅ 使用 transform 替代 bottom 在 iOS Safari 中
- ✅ 添加自动滚动到输入框功能
- ✅ 改进键盘检测算法
- ✅ 添加硬件加速支持

### v1.0.0
- ✅ 初始版本
- ✅ 基础键盘适配功能

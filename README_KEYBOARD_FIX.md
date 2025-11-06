# iOS Safari 虚拟键盘安全区域适配解决方案

## 问题描述

在 iOS 18 Safari 浏览器中，当虚拟键盘弹出时，使用 `position: fixed` 的底部固定元素可能会被键盘覆盖，导致用户无法正常操作这些元素。

## 解决方案

本项目提供了多种解决方案来处理 iOS Safari 中的虚拟键盘覆盖问题：

### 1. useKeyboardDetection Hook

动态检测虚拟键盘是否弹出，并获取键盘高度和安全区域信息。

```javascript
import { useKeyboardDetection } from '../hooks/useKeyboardDetection';

const MyComponent = () => {
  const { isKeyboardOpen, keyboardHeight, safeAreaInsetBottom } = useKeyboardDetection();
  
  return (
    <div>
      <p>键盘是否弹出: {isKeyboardOpen ? '是' : '否'}</p>
      <p>键盘高度: {keyboardHeight}px</p>
      <p>安全区域底部 inset: {safeAreaInsetBottom}px</p>
    </div>
  );
};
```

### 2. KeyboardSafeAreaView 组件

自动适配安全区域的容器组件，可以用于顶部或底部固定元素。

```javascript
import KeyboardSafeAreaView from '../components/KeyboardSafeAreaView';

const MyComponent = () => {
  return (
    <KeyboardSafeAreaView position="bottom">
      <input type="text" placeholder="底部输入框" />
    </KeyboardSafeAreaView>
  );
};
```

### 3. BottomFixedContainer 组件

专门用于底部固定的容器组件，自动适配虚拟键盘弹出时的位置调整。

```javascript
import BottomFixedContainer from '../components/BottomFixedContainer';

const MyComponent = () => {
  return (
    <BottomFixedContainer>
      <div className="input-container">
        <input type="text" placeholder="底部输入框" />
        <button>提交</button>
      </div>
    </BottomFixedContainer>
  );
};
```

### 4. CSS 样式适配

在全局样式中添加了对安全区域的支持：

```css
html,
body {
  /* 支持安全区域 */
  padding: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0) env(safe-area-inset-left, 0);
}

body {
  /* 确保内容区域适应安全区域 */
  min-height: calc(100vh - env(safe-area-inset-top, 0) - env(safe-area-inset-bottom, 0));
}
```

## 使用示例

查看 [/keyboard-safe-demo](file:///Users/webtest/next-20250920/app/keyboard-safe-demo/page.js#L1-L53) 页面获取完整的使用示例。

## 实现原理

1. 使用 `window.visualViewport` API 监听视口变化，检测虚拟键盘弹出
2. 通过比较视口高度变化判断键盘状态
3. 动态调整底部固定元素的位置，避免被键盘覆盖
4. 利用 `env(safe-area-inset-bottom)` 适配设备的安全区域

## 兼容性

- 支持 iOS 11.2+ Safari 浏览器
- 在不支持的浏览器中会优雅降级
- 适用于各种 iPhone 型号（包括 iPhone X 及更新型号）

## 注意事项

1. 确保在移动端设备上测试效果
2. 在不同 iOS 版本上验证兼容性
3. 注意性能优化，避免频繁的重排重绘
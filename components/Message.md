# Message 全局提示组件

基于 Ant Design 风格的全局消息提示组件，支持多种消息类型和自定义配置。

## 快速开始

### 1. 基本用法

```jsx
import { useMessage } from '../components/MessageProvider';

function MyComponent() {
  const message = useMessage();

  const handleClick = () => {
    message.success('操作成功！');
  };

  return <button onClick={handleClick}>显示成功消息</button>;
}
```

### 2. 数量控制

Message 组件默认不限制消息数量，可以根据需要手动设置限制：

```jsx
// 默认无限制
<MessageProvider>
  <App />
</MessageProvider>

// 手动设置最大数量为 5 条
<MessageProvider maxCount={5}>
  <App />
</MessageProvider>

// 设置为 3 条消息限制
<MessageProvider maxCount={3}>
  <App />
</MessageProvider>
```

### 3. 支持的消息类型

```jsx
// 成功消息
message.success('操作成功！');

// 错误消息
message.error('操作失败！');

// 警告消息
message.warning('请注意！');

// 信息消息
message.info('这是一条信息');

// 加载消息
const loadingId = message.loading('加载中...');
// 手动关闭
message.destroy(loadingId);
```

### 4. 自定义配置

```jsx
// 自定义显示时长（毫秒）
message.info('这条消息将在10秒后关闭', 10000);

// 不自动关闭
message.loading('正在处理...', 0);

// 清空所有消息
message.clear();
```

## API 参考

### MessageProvider

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `maxCount` | number \| null | null | 最大显示消息数量，null 表示无限制 |
| `children` | ReactNode | - | 子组件 |

### useMessage()

返回消息 API 对象，包含以下方法：

| 方法 | 参数 | 说明 |
|------|------|------|
| `success(content, duration?)` | content: string, duration?: number | 显示成功消息 |
| `error(content, duration?)` | content: string, duration?: number | 显示错误消息 |
| `warning(content, duration?)` | content: string, duration?: number | 显示警告消息 |
| `info(content, duration?)` | content: string, duration?: number | 显示信息消息 |
| `loading(content, duration?)` | content: string, duration?: number | 显示加载消息 |
| `destroy(id)` | id: number | 手动关闭指定消息 |
| `clear()` | - | 清空所有消息 |

### 参数说明

- `content`: 消息内容
- `duration`: 显示时长，单位为毫秒，默认为 3000ms，设置为 0 则不自动关闭
- `id`: 消息的唯一标识符

## 特性

- ✨ 支持多种消息类型：success、error、warning、info、loading
- 🎨 完全基于 Ant Design 设计规范
- 📱 响应式设计，支持移动端
- 🌙 支持深色模式
- ⚡ 流畅的进入和退出动画
- 🔧 可自定义显示时长
- 🎯 支持手动关闭和批量清空
- 🔢 默认无数量限制，可手动控制
- 🎭 优雅的弹性动画效果
- 🌊 消息一条条平滑消失，不会整体跳动
- ♿ 良好的无障碍支持

## 注意事项

1. 确保在应用的根组件中使用 `MessageProvider` 包裹
2. `useMessage` hook 必须在 `MessageProvider` 的子组件中使用
3. 默认情况下消息无数量限制，会堆叠显示所有消息
4. 可以通过 `maxCount` 参数手动控制最大显示数量
5. 在移动端会自动调整布局以适应小屏幕

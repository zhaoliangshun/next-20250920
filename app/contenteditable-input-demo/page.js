'use client';

import { useState } from 'react';
import ContentEditableInput from '../../components/ContentEditableInput';
import styles from './page.module.css';

export default function ContentEditableInputDemo() {
  const [text, setText] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [decimalValue, setDecimalValue] = useState('');
  const [focusStatus, setFocusStatus] = useState(false);
  const [log, setLog] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  const handleChange = (value) => {
    setText(value);
    addLog(`文本改变: "${value}"`);
  };

  const handleFocus = () => {
    setFocusStatus(true);
    addLog('获得焦点 (onfocus)');
  };

  const handleBlur = () => {
    setFocusStatus(false);
    addLog('失去焦点 (onblur)');
  };

  const handleReset = () => {
    setText('');
    setNumberValue('');
    setPhoneValue('');
    setEmailValue('');
    setUrlValue('');
    setDecimalValue('');
    setLog([]);
    addLog('已重置');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>ContentEditable Input 组件演示</h1>
        <p>基于 div contenteditable 的自定义输入框</p>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          {/* 组件演示区域 */}
          <div className={styles.demoSection}>
            <h2>输入框演示</h2>
            
            {/* 文本输入 */}
            <div className={styles.formGroup}>
              <label>📝 文本输入</label>
              <ContentEditableInput
                type="text"
                value={text}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="请输入文本..."
              />
            </div>

            {/* 数字输入 - 唤醒数字键盘 */}
            <div className={styles.formGroup}>
              <label>🔢 数字输入 (唤醒数字键盘)</label>
              <ContentEditableInput
                type="number"
                value={numberValue}
                onChange={(val) => {
                  setNumberValue(val);
                  addLog(`数字改变: ${val}`);
                }}
                placeholder="点击唤醒数字键盘..."
              />
            </div>

            {/* 电话输入 - 唤醒电话键盘 */}
            <div className={styles.formGroup}>
              <label>☎️ 电话输入 (唤醒电话键盘)</label>
              <ContentEditableInput
                type="tel"
                value={phoneValue}
                onChange={(val) => {
                  setPhoneValue(val);
                  addLog(`电话改变: ${val}`);
                }}
                placeholder="输入电话号码 +86 138..."
              />
            </div>

            {/* 邮箱输入 - 唤醒邮箱键盘 */}
            <div className={styles.formGroup}>
              <label>📧 邮箱输入 (唤醒邮箱键盘)</label>
              <ContentEditableInput
                type="email"
                value={emailValue}
                onChange={(val) => {
                  setEmailValue(val);
                  addLog(`邮箱改变: ${val}`);
                }}
                placeholder="user@example.com"
              />
            </div>

            {/* URL 输入 - 唤醒 URL 键盘 */}
            <div className={styles.formGroup}>
              <label>🔗 URL 输入 (唤醒 URL 键盘)</label>
              <ContentEditableInput
                type="url"
                value={urlValue}
                onChange={(val) => {
                  setUrlValue(val);
                  addLog(`URL 改变: ${val}`);
                }}
                placeholder="https://example.com"
              />
            </div>

            {/* 小数输入 - 唤醒小数键盘 */}
            <div className={styles.formGroup}>
              <label>💰 小数输入 (唤醒小数键盘)</label>
              <ContentEditableInput
                type="decimal"
                value={decimalValue}
                onChange={(val) => {
                  setDecimalValue(val);
                  addLog(`小数改变: ${val}`);
                }}
                placeholder="输入价格 0.00"
              />
            </div>

            {/* 禁用状态 */}
            <div className={styles.formGroup}>
              <label>🚫 禁用状态</label>
              <ContentEditableInput
                value="这是禁用状态"
                disabled={true}
                placeholder="禁用输入框"
              />
            </div>

            {/* 状态显示 */}
            <div className={styles.statusBox}>
              <h3>当前状态</h3>
              <p>
                <strong>焦点状态:</strong>
                <span className={focusStatus ? styles.active : styles.inactive}>
                  {focusStatus ? '已获得焦点' : '未获得焦点'}
                </span>
              </p>
              <p>
                <strong>文本内容:</strong>
                <span className={styles.content}>&quot;{text}&quot;</span>
              </p>
              <p>
                <strong>内容长度:</strong>
                <span>{text.length} 字符</span>
              </p>
            </div>

            {/* 控制按钮 */}
            <div className={styles.buttonGroup}>
              <button 
                onClick={handleReset}
                className={styles.resetButton}
              >
                重置全部
              </button>
              <button 
                onClick={() => setText(text + '✨')}
                className={styles.actionButton}
              >
                追加 ✨
              </button>
              <button 
                onClick={() => setText(text + '😀')}
                className={styles.actionButton}
              >
                追加 😀
              </button>
            </div>
          </div>

          {/* 事件日志 */}
          <div className={styles.logSection}>
            <h2>事件日志</h2>
            <div className={styles.logBox}>
              {log.length === 0 ? (
                <p className={styles.emptyLog}>等待事件触发...</p>
              ) : (
                log.map((item, index) => (
                  <div key={index} className={styles.logItem}>
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className={styles.docSection}>
          <h2>🎯 组件特性</h2>
          <ul>
            <li>✅ 文本改变事件 (onChange)</li>
            <li>✅ 获得焦点事件 (onFocus)</li>
            <li>✅ 失去焦点事件 (onBlur)</li>
            <li>✅ 手机键盘唤醒支持</li>
            <li>✅ 输入类型过滤</li>
            <li>✅ 自定义占位符</li>
            <li>✅ 禁用状态支持</li>
            <li>✅ 纯文本粘贴</li>
            <li>✅ 响应式设计</li>
            <li>✅ 无障碍支持</li>
          </ul>

          <h3>📱 键盘类型支持</h3>
          <div className={styles.keyboardTable}>
            <div className={styles.keyboardRow}>
              <span className={styles.keyboardType}>text</span>
              <span>文本键盘（默认）</span>
            </div>
            <div className={styles.keyboardRow}>
              <span className={styles.keyboardType}>number</span>
              <span>数字键盘 🔢</span>
            </div>
            <div className={styles.keyboardRow}>
              <span className={styles.keyboardType}>tel</span>
              <span>电话键盘 ☎️</span>
            </div>
            <div className={styles.keyboardRow}>
              <span className={styles.keyboardType}>email</span>
              <span>邮箱键盘 📧</span>
            </div>
            <div className={styles.keyboardRow}>
              <span className={styles.keyboardType}>url</span>
              <span>URL 键盘 🔗</span>
            </div>
            <div className={styles.keyboardRow}>
              <span className={styles.keyboardType}>decimal</span>
              <span>小数键盘 💰</span>
            </div>
          </div>

          <h3>📖 API 文档</h3>
          <pre className={styles.code}>{`<ContentEditableInput
  value={string}              // 输入框值
  onChange={function}         // 文本改变回调
  onFocus={function}          // 获得焦点回调
  onBlur={function}           // 失去焦点回调
  placeholder={string}        // 占位符文本
  type={string}               // 输入类型: text|number|tel|email|url|decimal
  inputMode={string}          // 手动设置 inputMode
  disabled={boolean}          // 禁用状态
  maxLength={number}          // 最大长度
  className={string}          // 自定义类名
/>`}</pre>

          <h3>💡 使用示例</h3>
          <pre className={styles.code}>{`// 数字输入 - 唤醒数字键盘
<ContentEditableInput
  type="number"
  value={number}
  onChange={setNumber}
  placeholder="请输入数字..."
/>

// 电话输入 - 唤醒电话键盘
<ContentEditableInput
  type="tel"
  value={phone}
  onChange={setPhone}
  placeholder="+86 138..."
/>

// 邮箱输入 - 唤醒邮箱键盘
<ContentEditableInput
  type="email"
  value={email}
  onChange={setEmail}
  placeholder="user@example.com"
/>`}</pre>
        </div>
      </main>
    </div>
  );
}

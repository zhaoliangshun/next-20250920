"use client";

import { useState } from 'react';
import useLocalForage, { useLocalForageKeys, useLocalForageClear } from '../../hooks/useLocalForage';
import styles from './page.module.css';

export default function LocalForageDemo() {
  // 示例 1: 基本使用 - 存储字符串
  const {
    value: stringValue,
    loading: stringLoading,
    error: stringError,
    setValue: setStringValue,
    removeValue: removeStringValue,
  } = useLocalForage('demo-string', 'Hello LocalForage');

  // 示例 2: 存储对象
  const {
    value: objectValue,
    loading: objectLoading,
    error: objectError,
    setValue: setObjectValue,
    removeValue: removeObjectValue,
  } = useLocalForage('demo-object', { name: 'User', age: 25 });

  // 示例 3: 存储数组
  const {
    value: arrayValue,
    loading: arrayLoading,
    error: arrayError,
    setValue: setArrayValue,
    removeValue: removeObjectArray,
  } = useLocalForage('demo-array', ['item1', 'item2', 'item3']);

  // 示例 4: 存储数字（计数器）
  const {
    value: counterValue,
    loading: counterLoading,
    setValue: setCounterValue,
  } = useLocalForage('demo-counter', 0);



  // 表单输入状态
  const [stringInput, setStringInput] = useState('');
  const [objectNameInput, setObjectNameInput] = useState('');
  const [objectAgeInput, setObjectAgeInput] = useState('');
  const [arrayInput, setArrayInput] = useState('');

  // 处理字符串设置
  const handleSetString = () => {
    if (stringInput.trim()) {
      setStringValue(stringInput);
      setStringInput('');
    }
  };

  // 处理对象设置
  const handleSetObject = () => {
    const name = objectNameInput.trim() || objectValue?.name || 'User';
    const age = parseInt(objectAgeInput) || objectValue?.age || 25;
    setObjectValue({ name, age });
    setObjectNameInput('');
    setObjectAgeInput('');
  };

  // 处理数组添加
  const handleAddToArray = () => {
    if (arrayInput.trim()) {
      setArrayValue((prev) => [...(prev || []), arrayInput]);
      setArrayInput('');
    }
  };

  // 处理计数器增加
  const handleIncrement = () => {
    setCounterValue((prev) => (prev || 0) + 1);
  };

  // 处理计数器减少
  const handleDecrement = () => {
    setCounterValue((prev) => Math.max(0, (prev || 0) - 1));
  };

  // 处理清空所有


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>LocalForage Hook Demo</h1>
      <p className={styles.description}>
        这个演示展示了如何使用 useLocalForage Hook 来管理本地存储
      </p>

      {/* 字符串存储示例 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. 字符串存储</h2>
        <div className={styles.content}>
          <div className={styles.status}>
            <span className={styles.label}>当前值:</span>
            <span className={styles.value}>
              {stringLoading ? '加载中...' : stringValue || '(空)'}
            </span>
            {stringError && (
              <span className={styles.error}>错误: {stringError.message}</span>
            )}
          </div>
          <div className={styles.controls}>
            <input
              type="text"
              value={stringInput}
              onChange={(e) => setStringInput(e.target.value)}
              placeholder="输入新字符串"
              className={styles.input}
            />
            <button
              onClick={handleSetString}
              disabled={stringLoading}
              className={styles.button}
            >
              设置
            </button>
            <button
              onClick={() => removeStringValue()}
              disabled={stringLoading}
              className={styles.buttonDanger}
            >
              删除
            </button>
          </div>
        </div>
      </section>

      {/* 对象存储示例 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. 对象存储</h2>
        <div className={styles.content}>
          <div className={styles.status}>
            <span className={styles.label}>当前值:</span>
            <pre className={styles.value}>
              {objectLoading
                ? '加载中...'
                : JSON.stringify(objectValue, null, 2) || '(空)'}
            </pre>
            {objectError && (
              <span className={styles.error}>错误: {objectError.message}</span>
            )}
          </div>
          <div className={styles.controls}>
            <input
              type="text"
              value={objectNameInput}
              onChange={(e) => setObjectNameInput(e.target.value)}
              placeholder="姓名"
              className={styles.input}
            />
            <input
              type="number"
              value={objectAgeInput}
              onChange={(e) => setObjectAgeInput(e.target.value)}
              placeholder="年龄"
              className={styles.input}
            />
            <button
              onClick={handleSetObject}
              disabled={objectLoading}
              className={styles.button}
            >
              设置
            </button>
            <button
              onClick={() => removeObjectValue()}
              disabled={objectLoading}
              className={styles.buttonDanger}
            >
              删除
            </button>
          </div>
        </div>
      </section>

      {/* 数组存储示例 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. 数组存储</h2>
        <div className={styles.content}>
          <div className={styles.status}>
            <span className={styles.label}>当前值:</span>
            <pre className={styles.value}>
              {arrayLoading
                ? '加载中...'
                : JSON.stringify(arrayValue, null, 2) || '(空)'}
            </pre>
            {arrayError && (
              <span className={styles.error}>错误: {arrayError.message}</span>
            )}
          </div>
          <div className={styles.controls}>
            <input
              type="text"
              value={arrayInput}
              onChange={(e) => setArrayInput(e.target.value)}
              placeholder="添加新项"
              className={styles.input}
            />
            <button
              onClick={handleAddToArray}
              disabled={arrayLoading}
              className={styles.button}
            >
              添加
            </button>
            <button
              onClick={() => setArrayValue([])}
              disabled={arrayLoading}
              className={styles.button}
            >
              清空数组
            </button>
            <button
              onClick={() => removeObjectArray()}
              disabled={arrayLoading}
              className={styles.buttonDanger}
            >
              删除
            </button>
          </div>
        </div>
      </section>

      {/* 计数器示例 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. 计数器（数字存储）</h2>
        <div className={styles.content}>
          <div className={styles.status}>
            <span className={styles.label}>当前值:</span>
            <span className={styles.counterValue}>
              {counterLoading ? '加载中...' : counterValue || 0}
            </span>
          </div>
          <div className={styles.controls}>
            <button
              onClick={handleDecrement}
              disabled={counterLoading}
              className={styles.button}
            >
              -1
            </button>
            <button
              onClick={handleIncrement}
              disabled={counterLoading}
              className={styles.button}
            >
              +1
            </button>
            <button
              onClick={() => setCounterValue(0)}
              disabled={counterLoading}
              className={styles.button}
            >
              重置
            </button>
          </div>
        </div>
      </section>

      

      {/* 使用说明 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>使用说明</h2>
        <div className={styles.content}>
          <pre className={styles.code}>
{`// 基本使用
const { value, loading, error, setValue, removeValue } = 
  useLocalForage('my-key', 'initial-value');

// 设置值
setValue('new value');

// 使用函数更新（类似 setState）
setValue(prev => prev + 1);

// 删除值
removeValue();

// 重新加载
refresh();`}
          </pre>
        </div>
      </section>
    </div>
  );
}


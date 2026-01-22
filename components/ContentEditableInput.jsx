'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './ContentEditableInput.module.css';

/**
 * 基于 contenteditable 的 Input 组件
 * 支持手机键盘唤醒（数字键盘、电话键盘等）
 * @param {Object} props
 * @param {string} props.value - 输入框的值
 * @param {Function} props.onChange - 文本改变回调函数
 * @param {Function} props.onFocus - 获得焦点回调函数
 * @param {Function} props.onBlur - 失去焦点回调函数
 * @param {string} props.placeholder - 占位符文本
 * @param {string} props.className - 自定义类名
 * @param {boolean} props.disabled - 是否禁用
 * @param {string} props.type - 输入类型 (text|number|tel|email|url|decimal)，用于唤醒对应的手机键盘
 * @param {string} props.inputMode - 直接设置 inputMode (text|numeric|tel|email|url|decimal)
 * @param {number} props.maxLength - 最大输入长度
 */
export default function ContentEditableInput({
  value = '',
  onChange,
  onFocus,
  onBlur,
  placeholder = '',
  className = '',
  disabled = false,
  type = 'text',
  inputMode = null,
  maxLength = null,
  ...props
}) {
  const contentEditableRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const isUpdatingRef = useRef(false);
  const cursorPositionRef = useRef(0);

  // 保存光标位置
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preRange = range.cloneRange();
      preRange.selectNodeContents(contentEditableRef.current);
      preRange.setEnd(range.endContainer, range.endOffset);
      cursorPositionRef.current = preRange.toString().length;
    }
  };

  // 恢复光标位置（保持在末尾）
  const restoreCursorPosition = () => {
    if (!contentEditableRef.current) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    // 将光标设置在末尾
    range.selectNodeContents(contentEditableRef.current);
    range.collapse(false);
    
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // 根据 type 自动确定 inputMode
  const getInputMode = () => {
    if (inputMode) return inputMode;
    
    const inputModeMap = {
      'text': 'text',
      'number': 'numeric',
      'tel': 'tel',
      'email': 'email',
      'url': 'url',
      'decimal': 'decimal',
      'search': 'search',
    };
    
    return inputModeMap[type] || 'text';
  };

  // 根据类型过滤输入内容
  const filterByType = (text) => {
    switch (type) {
      case 'number':
        return text.replace(/[^0-9-]/g, '');
      case 'tel':
        return text.replace(/[^0-9+\-\s()]/g, '');
      case 'email':
        return text.replace(/[^a-zA-Z0-9@._-]/g, '');
      case 'url':
        return text.replace(/[^a-zA-Z0-9:/.?=&_-]/g, '');
      case 'decimal':
        return text.replace(/[^0-9.-]/g, '');
      default:
        return text;
    }
  };

  // 当 value prop 改变时，更新 DOM 内容
  useEffect(() => {
    if (contentEditableRef.current && !isUpdatingRef.current) {
      if (value !== contentEditableRef.current.textContent) {
        contentEditableRef.current.textContent = value;
      }
    }
  }, [value]);

  // 处理文本改变事件
  const handleInput = (e) => {
    // 保存光标位置（用于后续需要时）
    saveCursorPosition();
    
    let newValue = e.currentTarget.textContent || '';
    
    // 根据类型过滤内容
    newValue = filterByType(newValue);
    
    // 检查长度限制
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    
    // 更新 DOM 内容
    if (newValue !== e.currentTarget.textContent) {
      isUpdatingRef.current = true;
      e.currentTarget.textContent = newValue;
      isUpdatingRef.current = false;
      
      // 文本被修改后，恢复光标到末尾
      // 使用 setTimeout 确保 DOM 更新完成后再恢复
      setTimeout(() => {
        restoreCursorPosition();
      }, 0);
    }
    
    onChange?.(newValue);
  };

  // 处理 focus 事件
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // 处理 blur 事件
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // 处理粘贴事件，确保只粘贴纯文本
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
  };

  // 处理按键事件
  const handleKeyDown = (e) => {
    // 阻止 Enter 键创建新行（如果需要）
    if (e.key === 'Enter') {
      // 取消注释下面的代码来阻止换行
      // e.preventDefault();
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        ref={contentEditableRef}
        contentEditable={!disabled}
        inputMode={getInputMode()}
        className={`${styles.input} ${isFocused ? styles.focused : ''} ${disabled ? styles.disabled : ''}`}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
        role="textbox"
        aria-label={placeholder}
        data-type={type}
        {...props}
      />
      {!value && isFocused === false && (
        <div className={styles.placeholder}>{placeholder}</div>
      )}
    </div>
  );
}

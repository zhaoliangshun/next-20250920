import { useState, useEffect, useCallback, useRef } from "react";
import localforage from "localforage";

/**
 * useLocalForage Hook
 *
 * 一个用于管理 localforage 存储的 React Hook
 * 提供读取、设置、删除等操作，并自动管理加载状态和错误处理
 *
 * @param {string} key - 存储的键名
 * @param {any} initialValue - 初始值（如果存储中没有数据时使用）
 * @param {Object} options - 配置选项
 * @param {boolean} options.autoLoad - 是否在组件挂载时自动加载数据（默认 true）
 * @param {Object} options.storeConfig - localforage 配置选项（如 driver, name, version 等）
 *
 * @returns {Object} 返回包含以下属性的对象：
 *   - value: 当前存储的值
 *   - loading: 是否正在加载
 *   - error: 错误信息（如果有）
 *   - setValue: 设置值的函数
 *   - removeValue: 删除值的函数
 *   - refresh: 重新加载值的函数
 */
const useLocalForage = (
  key,
  initialValue = null,
  init = null,
  options = {}
) => {
  const { autoLoad = true, storeConfig = {} } = options;

  // 创建或获取 localforage 实例
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = localforage.createInstance({
      name: "useLocalForage",
      ...storeConfig,
    });
  }

  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState(null);
  const keyRef = useRef(key);

  // 更新 key ref
  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  /**
   * 从存储中读取值
   */
  const loadValue = useCallback(async () => {
    if (!keyRef.current) {
      setError(new Error("Key is required"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let storedValue = await storeRef.current.getItem(keyRef.current);
      if (storedValue) {
        if (init && typeof init === "function") {
          storedValue = init(storedValue);
        }
      } else {
        storedValue = initialValue;
      }
      await storeRef.current.setItem(keyRef.current, storedValue);
      setValue(storedValue);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      console.error("Error loading from localforage:", errorObj);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 设置值到存储
   * @param {any} newValue - 要设置的值，可以是值或函数（函数接收当前值并返回新值）
   */
  const setStoredValue = useCallback(
    async (newValue) => {
      if (!keyRef.current) {
        setError(new Error("Key is required"));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 如果 newValue 是函数，则使用当前值调用它
        const valueToStore =
          typeof newValue === "function" ? newValue(value) : newValue;

        await storeRef.current.setItem(keyRef.current, valueToStore);
        setValue(valueToStore);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        console.error("Error setting to localforage:", errorObj);
        throw errorObj;
      } finally {
        setLoading(false);
      }
    },
    [value]
  );

  /**
   * 从存储中删除值
   */
  const removeValue = useCallback(async () => {
    if (!keyRef.current) {
      setError(new Error("Key is required"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await storeRef.current.removeItem(keyRef.current);
      setValue(null);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      console.error("Error removing from localforage:", errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);

  // 自动加载数据
  useEffect(() => {
    loadValue();
  }, [loadValue]);

  return {
    value,
    loading,
    error,
    setValue: setStoredValue,
    removeValue,
  };
};

export default useLocalForage;

import { useState, useEffect, useCallback, useRef } from 'react';

const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const cacheRef = useRef(new Map());
    const optionsRef = useRef(options);
    
    // Update options ref when options change
    optionsRef.current = options;

    const {
        method = 'GET',
        headers = {},
        body = null,
        immediate = true,
        cache = false,
        cacheTime = 5 * 60 * 1000, // 5 minutes
        onSuccess,
        onError,
        transform,
        retry = 0,
        retryDelay = 1000,
        timeout = 10000,
        ...fetchOptions
    } = options;

    // Generate cache key
    const getCacheKey = useCallback((url, options) => {
        return `${url}_${JSON.stringify(options)}`;
    }, []);

    // Check if cached data is valid
    const isCacheValid = useCallback((cacheEntry) => {
        if (!cacheEntry) return false;
        return Date.now() - cacheEntry.timestamp < cacheTime;
    }, [cacheTime]);

    // Fetch function with retry logic
    const fetchWithRetry = useCallback(async (url, options, retryCount = 0) => {
        try {
            const controller = new AbortController();
            abortControllerRef.current = controller;

            // Set timeout
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, timeout);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            let responseData;

            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else if (contentType && contentType.includes('text/')) {
                responseData = await response.text();
            } else {
                responseData = await response.blob();
            }

            // Transform data if transformer provided
            if (transform && typeof transform === 'function') {
                responseData = transform(responseData);
            }

            return responseData;
        } catch (err) {
            if (err.name === 'AbortError') {
                throw new Error('Request was cancelled');
            }

            if (retryCount < retry) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return fetchWithRetry(url, options, retryCount + 1);
            }

            throw err;
        }
    }, [retry, retryDelay, timeout, transform]);

    // Main execute function
    const execute = useCallback(async (customUrl, customOptions = {}) => {
        const currentOptions = optionsRef.current;
        const {
            method: currentMethod = 'GET',
            headers: currentHeaders = {},
            body: currentBody = null,
            cache: currentCache = false,
            onSuccess: currentOnSuccess,
            onError: currentOnError,
            ...currentFetchOptions
        } = currentOptions;
        
        const requestUrl = customUrl || url;
        const requestOptions = {
            method: currentMethod,
            headers: {
                'Content-Type': 'application/json',
                ...currentHeaders,
                ...customOptions.headers,
            },
            body: customOptions.body || currentBody,
            ...currentFetchOptions,
            ...customOptions,
        };

        if (!requestUrl) {
            setError(new Error('URL is required'));
            return;
        }

        // Check cache first
        if (currentCache && currentMethod === 'GET') {
            const cacheKey = getCacheKey(requestUrl, requestOptions);
            const cachedData = cacheRef.current.get(cacheKey);
            
            if (isCacheValid(cachedData)) {
                setData(cachedData.data);
                setError(null);
                setLoading(false);
                currentOnSuccess?.(cachedData.data);
                return cachedData.data;
            }
        }

        setLoading(true);
        setError(null);

        try {
            const result = await fetchWithRetry(requestUrl, requestOptions);
            
            setData(result);
            setError(null);

            // Cache the result if caching is enabled
            if (currentCache && currentMethod === 'GET') {
                const cacheKey = getCacheKey(requestUrl, requestOptions);
                cacheRef.current.set(cacheKey, {
                    data: result,
                    timestamp: Date.now(),
                });
            }

            currentOnSuccess?.(result);
            return result;
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error(String(err));
            setError(errorObj);
            setData(null);
            currentOnError?.(errorObj);
            throw errorObj;
        } finally {
            setLoading(false);
        }
    }, [url, getCacheKey, isCacheValid, fetchWithRetry]);

    // Refetch function
    const refetch = useCallback(() => {
        return execute();
    }, [execute]);

    // Cancel function
    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);

    // Clear cache function
    const clearCache = useCallback(() => {
        cacheRef.current.clear();
    }, []);

    // Execute immediately if immediate is true and url is provided
    useEffect(() => {
        if (immediate && url) {
            execute();
        }

        // Cleanup function
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [immediate, url, execute]);

    return {
        data,
        loading,
        error,
        execute,
        refetch,
        cancel,
        clearCache,
    };
};

// Additional hooks for specific HTTP methods
export const useGet = (url, options = {}) => {
    return useFetch(url, { ...options, method: 'GET' });
};

export const usePost = (url, options = {}) => {
    return useFetch(url, { ...options, method: 'POST', immediate: false });
};

export const usePut = (url, options = {}) => {
    return useFetch(url, { ...options, method: 'PUT', immediate: false });
};

export const useDelete = (url, options = {}) => {
    return useFetch(url, { ...options, method: 'DELETE', immediate: false });
};

export default useFetch;

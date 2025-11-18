"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import MessageContainer from "./Message";

const MessageContext = createContext();

let messageId = 0;

export const MessageProvider = ({ children, maxCount = null, position = 'top' }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((message) => {
    const id = ++messageId;
    const newMessage = {
      id,
      type: "info",
      content: "",
      duration: 3000,
      ...message,
    };

    setMessages((prev) => {
      const updatedMessages = [...prev, newMessage];
      // 只有当 maxCount 有值且超过限制时才移除最旧的消息
      if (maxCount && updatedMessages.length > maxCount) {
        return updatedMessages.slice(-maxCount);
      }
      return updatedMessages;
    });
    return id;
  }, [maxCount]);

  const removeMessage = useCallback((id) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const messageApi = {
    success: (content, duration = 3000, options = {}) =>
      addMessage({ type: "success", content, duration, ...options }),
    error: (content, duration = 3000, options = {}) =>
      addMessage({ type: "error", content, duration, ...options }),
    warning: (content, duration = 3000, options = {}) =>
      addMessage({ type: "warning", content, duration, ...options }),
    info: (content, duration = 3000, options = {}) =>
      addMessage({ type: "info", content, duration, ...options }),
    loading: (content, duration = 0, options = {}) =>
      addMessage({ type: "loading", content, duration, ...options }),
    destroy: removeMessage,
    clear: clearMessages,
  };

  return (
    <MessageContext.Provider value={messageApi}>
      {children}
      <MessageContainer messages={messages} onClose={removeMessage} position={position} />
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};

export default MessageProvider;

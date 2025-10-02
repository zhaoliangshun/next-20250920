"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import MessageContainer from "./Message";

const MessageContext = createContext();

let messageId = 0;

export const MessageProvider = ({ children, maxCount = null }) => {
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
    success: (content, duration = 3000) =>
      addMessage({ type: "success", content, duration }),
    error: (content, duration = 3000) =>
      addMessage({ type: "error", content, duration }),
    warning: (content, duration = 3000) =>
      addMessage({ type: "warning", content, duration }),
    info: (content, duration = 3000) =>
      addMessage({ type: "info", content, duration }),
    loading: (content, duration = 0) =>
      addMessage({ type: "loading", content, duration }),
    destroy: removeMessage,
    clear: clearMessages,
  };

  return (
    <MessageContext.Provider value={messageApi}>
      {children}
      <MessageContainer messages={messages} onClose={removeMessage} />
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

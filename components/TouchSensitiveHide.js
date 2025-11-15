'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './TouchSensitiveHide.module.css';

export default function TouchSensitiveHide({ children }) {
  const [isHidden, setIsHidden] = useState(false);
  const hideTimeout = useRef(null);

  // Hide the element after 3 seconds
  useEffect(() => {
    hideTimeout.current = setTimeout(() => {
      setIsHidden(true);
    }, 3000);

    // Clear timeout on component unmount
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  // Handle touch to show the element
  const handleTouch = () => {
    // Clear any existing timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    
    // Show the element
    setIsHidden(false);
    
    // Set timeout to hide again after 3 seconds
    hideTimeout.current = setTimeout(() => {
      setIsHidden(true);
    }, 3000);
  };

  return (
    <div 
      className={`${styles.container} ${isHidden ? styles.hidden : ''}`}
      onTouchStart={handleTouch}
    >
      {children}
    </div>
  );
}

'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './AnimatedRadioGroup.module.css';

const AnimatedRadioGroup = ({
  options = [],
  value,
  onChange,
  name = 'radio-group',
  className = ''
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const containerRef = useRef(null);
  const buttonRefs = useRef([]);



  useEffect(() => {
    if (value !== undefined) {
      const index = options.findIndex(option => option.value === value);
      if (index !== -1) {
        setSelectedIndex(index);
      }
    }
  }, [value, options]);

  const updateIndicatorPosition = () => {
    if (buttonRefs.current[selectedIndex] && containerRef.current) {
      const selectedButton = buttonRefs.current[selectedIndex];

      setIndicatorStyle({
        transform: `translateX(${selectedIndex === 0 ? 0 : selectedButton.offsetLeft - 3}px)`,
        width: `${selectedButton.offsetWidth}px`,
        height: `${selectedButton.offsetHeight}px`,
      });
    }
  };

  useEffect(() => {
    updateIndicatorPosition();
  }, [selectedIndex, options]);



  const handleOptionClick = (option, index) => {
    setSelectedIndex(index);
    if (onChange) {
      onChange(option.value);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setTimeout(updateIndicatorPosition, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedIndex]);

  if (!options.length) return null;

  return (
    <div className={styles.radioGroupContainer}>
      <div
        ref={containerRef}
        className={`${styles.radioGroup} ${className}`}
      >
        <div
          className={styles.indicator}
          style={indicatorStyle}
        />

        {options.map((option, index) => (
          <button
            key={option.value}
            ref={el => buttonRefs.current[index] = el}
            type="button"
            className={`${styles.option} ${selectedIndex === index ? styles.selected : ''}`}
            onClick={() => handleOptionClick(option, index)}
            role="radio"
            aria-checked={selectedIndex === index}
          >
            {option.label}
          </button>
        ))}

        {options.map((option, index) => (
          <input
            key={`input-${option.value}`}
            type="radio"
            name={name}
            value={option.value}
            checked={selectedIndex === index}
            onChange={() => { }}
            style={{ display: 'none' }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedRadioGroup; 
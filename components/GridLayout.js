'use client';

import React from 'react';
import styles from './GridLayout.module.css';

const GridLayout = ({ children }) => {
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;
  
  return (
    <div className={styles.gridContainer}>
      {childrenArray.map((child, index) => {
        // Check if this is the last item and the total number of items is odd
        const isLastOddItem = index === totalItems - 1 && totalItems % 2 !== 0;
        
        return (
          <div 
            key={index} 
            className={`${styles.gridItem} ${isLastOddItem ? styles.fullWidth : ''}`}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default GridLayout;

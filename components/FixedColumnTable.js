'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './FixedColumnTable.module.css';

export default function FixedColumnTable({ 
  data = [], 
  columns = [], 
  fixedColumnWidth = 200,
  collapsedWidth = 60,
  icon = '👤',
  onRowClick = null 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const tableRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        setScrollPosition(scrollLeft);
        
        // 当滚动超过一定距离时，固定列缩小为图标
        const shouldCollapse = scrollLeft > 100;
        setIsCollapsed(shouldCollapse);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // 处理行点击
  const handleRowClick = (rowData, index) => {
    if (onRowClick) {
      onRowClick(rowData, index);
    }
  };

  // 处理固定列点击
  const handleFixedColumnClick = (rowData, index) => {
    if (isCollapsed) {
      // 如果已折叠，点击图标时展开并滚动到该行
      setIsCollapsed(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
    handleRowClick(rowData, index);
  };

  return (
    <div className={styles.tableContainer}>
      <div 
        ref={scrollContainerRef}
        className={styles.scrollContainer}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              {/* 固定列头部 */}
              <th 
                className={`${styles.fixedColumn} ${isCollapsed ? styles.collapsed : ''}`}
                style={{
                  width: isCollapsed ? `${collapsedWidth}px` : `${fixedColumnWidth}px`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCollapsed) {
                    setIsCollapsed(false);
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                  }
                }}
              >
                {isCollapsed ? (
                  <div className={styles.iconCell}>
                    <span className={styles.icon}>{icon}</span>
                  </div>
                ) : (
                  '姓名'
                )}
              </th>
              
              {/* 可滚动列头部 */}
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className={styles.scrollableColumn}
                  style={{ minWidth: column.width || '150px' }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={styles.tableRow}
                onClick={() => handleRowClick(row, rowIndex)}
              >
                {/* 固定列内容 */}
                <td 
                  className={`${styles.fixedColumn} ${isCollapsed ? styles.collapsed : ''}`}
                  style={{
                    width: isCollapsed ? `${collapsedWidth}px` : `${fixedColumnWidth}px`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFixedColumnClick(row, rowIndex);
                  }}
                >
                  {isCollapsed ? (
                    <div className={styles.iconCell}>
                      <span className={styles.icon}>{icon}</span>
                    </div>
                  ) : (
                    <div className={styles.nameCell}>
                      <span className={styles.name}>{row.name}</span>
                      {row.avatar && (
                        <img 
                          src={row.avatar} 
                          alt={row.name}
                          className={styles.avatar}
                        />
                      )}
                    </div>
                  )}
                </td>
                
                {/* 可滚动列内容 */}
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className={styles.scrollableColumn}
                    style={{ minWidth: column.width || '150px' }}
                  >
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 滚动提示 */}
      <div className={styles.scrollHint}>
        {isCollapsed ? (
          <span>← 向左滚动查看完整信息</span>
        ) : (
          <span>→ 向右滚动查看更多列</span>
        )}
      </div>
    </div>
  );
}

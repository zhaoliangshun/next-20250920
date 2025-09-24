import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './FixedColumnTable.module.css';

const FixedColumnTable = ({ 
  data = [], 
  columns = [], 
  fixedColumnKey = 'name',
  fixedColumnWidth = 200,
  collapsedWidth = 60,
  onRowClick,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const tableRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeftValue = scrollContainerRef.current.scrollLeft;
        setScrollLeft(scrollLeftValue);
        
        // 当滚动超过一定距离时，固定列缩小为图标
        const shouldCollapse = scrollLeftValue > 50;
        if (shouldCollapse !== isCollapsed) {
          setIsCollapsed(shouldCollapse);
        }

        // 一旦用户发生横向滚动，隐藏提示
        if (scrollLeftValue > 0 && showScrollHint) {
          setShowScrollHint(false);
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [isCollapsed, showScrollHint]);

  // 初次渲染后检测是否可横向滚动，决定是否展示提示
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const canScroll = el.scrollWidth > el.clientWidth;
    if (canScroll) {
      setShowScrollHint(true);
      // 超时自动隐藏
      // const timer = setTimeout(() => setShowScrollHint(false), 3500);
      // return () => clearTimeout(timer);
    } else {
      setShowScrollHint(false);
    }
  }, [data, columns]);

  // 处理固定列点击，回到左侧
  const handleFixedColumnClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  // 处理行点击
  const handleRowClick = (rowData, index) => {
    onRowClick?.(rowData, index);
  };

  // 获取固定列的数据
  const getFixedColumnData = (rowData) => {
    const fixedColumn = columns.find(col => col.key === fixedColumnKey);
    if (fixedColumn && fixedColumn.render) {
      return fixedColumn.render(rowData[fixedColumnKey], rowData);
    }
    return rowData[fixedColumnKey];
  };

  // 获取固定列的标题
  const getFixedColumnTitle = () => {
    const fixedColumn = columns.find(col => col.key === fixedColumnKey);
    return fixedColumn?.title || fixedColumnKey;
  };

  // 获取其他列的数据
  const getOtherColumns = () => {
    return columns.filter(col => col.key !== fixedColumnKey);
  };

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <div 
        ref={scrollContainerRef}
        className={styles.scrollableContainer}
      >
        <table ref={tableRef} className={styles.table}>
          <thead>
            <tr>
              {/* 固定列Header */}
              <th 
                className={`${styles.fixedHeader} ${isCollapsed ? styles.collapsed : ''}`}
                style={{ 
                  width: isCollapsed ? `${collapsedWidth}px` : `${fixedColumnWidth}px`,
                  minWidth: isCollapsed ? `${collapsedWidth}px` : `${fixedColumnWidth}px`,
                  maxWidth: isCollapsed ? `${collapsedWidth}px` : `${fixedColumnWidth}px`
                }}
                onClick={handleFixedColumnClick}
              >
                <div className={styles.headerContent}>
                  <span className={`${styles.fixedTitle} ${isCollapsed ? styles.hidden : ''}`}>
                    {getFixedColumnTitle()}
                  </span>
                  {isCollapsed && (
                    <div className={styles.collapseIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className={styles.fixedShadow} aria-hidden="true" />
              </th>
              
              {/* 其他列Header */}
              {getOtherColumns().map((column, index) => (
                <th 
                  key={column.key || index}
                  className={styles.tableHeader}
                  style={{ width: column.width || 'auto' }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, rowIndex) => (
              <tr 
                key={rowData.id || rowIndex}
                className={styles.tableRow}
                onClick={() => handleRowClick(rowData, rowIndex)}
              >
                {/* 固定列内容 */}
                <td 
                  className={`${styles.fixedCell} ${isCollapsed ? styles.collapsed : ''}`}
                  style={{ 
                    width: isCollapsed ? `${collapsedWidth}px` : `${fixedColumnWidth}px`,
                    minWidth: isCollapsed ? `${collapsedWidth}px` : `${fixedColumnWidth}px`,
                    maxWidth: isCollapsed ? `${collapsedWidth}px` : `${fixedColumnWidth}px`
                  }}
                >
                  <div className={styles.fixedCellInner}>
                    {isCollapsed ? (
                      <div className={styles.collapsedContent}>
                        {/* 显示头像或图标 */}
                        {rowData.avatar ? (
                          <Image 
                            src={rowData.avatar} 
                            alt={rowData[fixedColumnKey]} 
                            width={32}
                            height={32}
                            className={styles.avatar}
                          />
                        ) : (
                          <div className={styles.defaultAvatar}>
                            {rowData[fixedColumnKey]?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={styles.expandedContent}>
                        {getFixedColumnData(rowData)}
                      </div>
                    )}
                  </div>
                  <div className={styles.fixedShadow} aria-hidden="true" />
                </td>
                
                {/* 其他列内容 */}
                {getOtherColumns().map((column, colIndex) => (
                  <td 
                    key={column.key || colIndex}
                    className={styles.tableCell}
                  >
                    {column.render 
                      ? column.render(rowData[column.key], rowData)
                      : rowData[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {showScrollHint && (
          <div className={styles.scrollHint} role="status" aria-live="polite">
            <div className={styles.hintInner}>
              <span className={styles.hintText}>可左右滑动</span>
              <span className={styles.hintArrows} aria-hidden="true">
                <svg viewBox="0 0 24 24" className={styles.arrowLeft}><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg viewBox="0 0 24 24" className={styles.arrowRight}><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedColumnTable;

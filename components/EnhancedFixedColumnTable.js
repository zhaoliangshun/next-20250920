import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './EnhancedFixedColumnTable.module.css';

const EnhancedFixedColumnTable = ({ 
  data = [], 
  columns = [], 
  fixedColumnKey = 'name',
  fixedColumnWidth = 200,
  collapsedWidth = 60,
  collapseThreshold = 100, // 新增参数：控制折叠触发的滚动阈值
  onRowClick,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [collapseProgress, setCollapseProgress] = useState(0); // 新增：折叠进度（0-1之间）
  const tableRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const fixedColumnRef = useRef(null);
  const tableBodyRef = useRef(null);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeftValue = scrollContainerRef.current.scrollLeft;
        setScrollLeft(scrollLeftValue);
        
        // 计算折叠进度（0-1之间）
        const progress = Math.min(scrollLeftValue / collapseThreshold, 1);
        setCollapseProgress(progress);
        
        // 当滚动超过阈值时，固定列缩小为图标
        const shouldCollapse = scrollLeftValue > collapseThreshold;
        if (shouldCollapse !== isCollapsed) {
          setIsCollapsed(shouldCollapse);
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [isCollapsed, collapseThreshold]);

  // 同步固定列和表格行的高度
  useEffect(() => {
    const syncRowHeights = () => {
      if (!fixedColumnRef.current || !tableBodyRef.current) return;
      
      const fixedCells = fixedColumnRef.current.querySelectorAll(`.${styles.fixedCell}`);
      const tableRows = tableBodyRef.current.querySelectorAll('tr');
      
      if (fixedCells.length !== tableRows.length) return;
      
      // 重置高度
      fixedCells.forEach(cell => {
        cell.style.height = 'auto';
      });
      
      // 延迟一帧，确保DOM已更新
      requestAnimationFrame(() => {
        fixedCells.forEach((cell, index) => {
          if (tableRows[index]) {
            const rowHeight = tableRows[index].offsetHeight;
            cell.style.height = `${rowHeight}px`;
          }
        });
      });
    };
    
    // 初始同步和窗口大小变化时同步
    syncRowHeights();
    window.addEventListener('resize', syncRowHeights);
    
    // 创建一个MutationObserver来监视表格内容变化
    const observer = new MutationObserver(syncRowHeights);
    if (tableBodyRef.current) {
      observer.observe(tableBodyRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
    
    return () => {
      window.removeEventListener('resize', syncRowHeights);
      observer.disconnect();
    };
  }, [data]);

  // 处理固定列点击，回到左侧
  const handleFixedColumnClick = () => {
    if (isCollapsed && scrollContainerRef.current) {
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

  // 计算固定列宽度（基于折叠进度）
  const getFixedColumnStyle = () => {
    if (isCollapsed) {
      return { width: `${collapsedWidth}px`, minWidth: `${collapsedWidth}px` };
    }
    
    // 在折叠过程中，根据进度计算宽度
    const width = fixedColumnWidth - (collapseProgress * (fixedColumnWidth - collapsedWidth));
    return { 
      width: `${width}px`, 
      minWidth: `${width}px`,
      opacity: isCollapsed ? 0.9 : 1 - (collapseProgress * 0.1)
    };
  };

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <div className={styles.tableWrapper}>
        {/* 固定列 */}
        <div 
          ref={fixedColumnRef}
          className={`${styles.fixedColumn} ${isCollapsed ? styles.collapsed : ''}`}
          style={getFixedColumnStyle()}
          onClick={isCollapsed ? handleFixedColumnClick : undefined}
        >
          {/* Header */}
          <div 
            className={`${styles.fixedHeader} ${isCollapsed ? styles.collapsed : ''}`}
            style={{ height: tableRef.current?.querySelector('thead tr')?.offsetHeight || '48px' }}
          >
            <span 
              className={styles.fixedTitle}
              style={{ 
                opacity: 1 - collapseProgress,
                transform: `scale(${1 - collapseProgress * 0.2}) translateX(${-collapseProgress * 20}px)`
              }}
            >
              {getFixedColumnTitle()}
            </span>
            <div 
              className={styles.collapseIcon}
              style={{ 
                opacity: collapseProgress,
                transform: `scale(${0.8 + collapseProgress * 0.2})`
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>
          
          {/* 固定列内容 */}
          <div className={styles.fixedContent}>
            {data.map((rowData, index) => (
              <div 
                key={rowData.id || index}
                className={`${styles.fixedCell} ${isCollapsed ? styles.collapsed : ''}`}
                onClick={() => handleRowClick(rowData, index)}
                data-row-index={index}
              >
                <div 
                  className={styles.collapsedContent}
                  style={{ 
                    opacity: collapseProgress,
                    transform: `scale(${0.8 + collapseProgress * 0.2})`
                  }}
                >
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
                
                <div 
                  className={styles.expandedContent}
                  style={{ 
                    opacity: 1 - collapseProgress,
                    transform: `translateX(${-collapseProgress * 20}px)`
                  }}
                >
                  {getFixedColumnData(rowData)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 可滚动区域 */}
        <div 
          ref={scrollContainerRef}
          className={styles.scrollableArea}
        >
          {/* 可滚动表格 */}
          <table className={styles.table} ref={tableRef}>
            <thead>
              <tr>
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
            <tbody ref={tableBodyRef}>
              {data.map((rowData, rowIndex) => (
                <tr 
                  key={rowData.id || rowIndex}
                  className={styles.tableRow}
                  onClick={() => handleRowClick(rowData, rowIndex)}
                  data-row-index={rowIndex}
                >
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
        </div>
      </div>
    </div>
  );
};

export default EnhancedFixedColumnTable;
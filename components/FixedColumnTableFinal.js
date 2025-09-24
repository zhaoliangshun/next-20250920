import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './FixedColumnTableFinal.module.css';

const FixedColumnTableFinal = ({ 
  data = [], 
  columns = [], 
  fixedColumnKey = 'name',
  fixedColumnWidth = 200,
  collapsedWidth = 60,
  collapseThreshold = 100,
  onRowClick,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapseProgress, setCollapseProgress] = useState(0);
  const tableRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeftValue = scrollContainerRef.current.scrollLeft;
        
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
  const handleRowClick = (rowData, index, event) => {
    // 阻止事件冒泡，避免触发固定列的点击事件
    event.stopPropagation();
    onRowClick?.(rowData, index);
  };

  // 获取固定列
  const fixedColumn = columns.find(col => col.key === fixedColumnKey);
  
  // 获取其他列
  const otherColumns = columns.filter(col => col.key !== fixedColumnKey);

  // 计算固定列宽度（基于折叠进度）
  const getFixedColumnStyle = () => {
    // 在折叠过程中，根据进度计算宽度
    const width = fixedColumnWidth - (collapseProgress * (fixedColumnWidth - collapsedWidth));
    return { 
      width: `${width}px`, 
      minWidth: `${width}px`
    };
  };

  // 渲染固定列单元格内容
  const renderFixedCell = (rowData) => {
    const value = rowData[fixedColumnKey];
    
    return (
      <>
        {/* 折叠状态内容 */}
        <div 
          className={styles.collapsedContent}
          style={{ 
            opacity: collapseProgress,
            transform: `scale(${0.8 + collapseProgress * 0.2})`
          }}
        >
          {rowData.avatar ? (
            <Image 
              src={rowData.avatar} 
              alt={value || ''} 
              width={32}
              height={32}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.defaultAvatar}>
              {value?.charAt(0) || '?'}
            </div>
          )}
        </div>
        
        {/* 展开状态内容 */}
        <div 
          className={styles.expandedContent}
          style={{ 
            opacity: 1 - collapseProgress,
            transform: `translateX(${-collapseProgress * 20}px)`
          }}
        >
          {fixedColumn && fixedColumn.render 
            ? fixedColumn.render(value, rowData)
            : value
          }
        </div>
      </>
    );
  };

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <div 
        ref={scrollContainerRef}
        className={styles.scrollContainer}
      >
        <table className={styles.table} ref={tableRef}>
          <thead>
            <tr>
              {/* 固定列标题 */}
              <th 
                className={`${styles.tableHeader} ${styles.fixedHeader} ${isCollapsed ? styles.collapsed : ''}`}
                style={getFixedColumnStyle()}
                onClick={isCollapsed ? handleFixedColumnClick : undefined}
              >
                <span 
                  className={styles.fixedTitle}
                  style={{ 
                    opacity: 1 - collapseProgress,
                    transform: `scale(${1 - collapseProgress * 0.2}) translateX(${-collapseProgress * 20}px)`
                  }}
                >
                  {fixedColumn?.title || fixedColumnKey}
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
              </th>
              
              {/* 其他列标题 */}
              {otherColumns.map((column, index) => (
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
                onClick={(e) => handleRowClick(rowData, rowIndex, e)}
              >
                {/* 固定列单元格 */}
                <td 
                  className={`${styles.tableCell} ${styles.fixedCell} ${isCollapsed ? styles.collapsed : ''}`}
                  style={getFixedColumnStyle()}
                  onClick={isCollapsed ? handleFixedColumnClick : undefined}
                >
                  {renderFixedCell(rowData)}
                </td>
                
                {/* 其他列单元格 */}
                {otherColumns.map((column, colIndex) => (
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
  );
};

export default FixedColumnTableFinal;
'use client';

import React from 'react';
import FixedColumnTable from '../../components/FixedColumnTable';
import styles from './page.module.css';

export default function TableExample() {
  // 示例数据
  const data = [
    { 
      id: 1, 
      name: '张三', 
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      department: '研发部', 
      position: '前端开发工程师', 
      salary: '¥15,000', 
      joinDate: '2023-01-15',
      performance: '优秀'
    },
    { 
      id: 2, 
      name: '李四', 
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      department: '设计部', 
      position: 'UI设计师', 
      salary: '¥12,000', 
      joinDate: '2023-03-22',
      performance: '良好'
    },
    { 
      id: 3, 
      name: '王五', 
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      department: '市场部', 
      position: '市场专员', 
      salary: '¥10,000', 
      joinDate: '2023-05-10',
      performance: '良好'
    },
    { 
      id: 4, 
      name: '赵六', 
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      department: '人事部', 
      position: 'HR专员', 
      salary: '¥11,000', 
      joinDate: '2023-02-18',
      performance: '优秀'
    },
    { 
      id: 5, 
      name: '钱七', 
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      department: '财务部', 
      position: '财务经理', 
      salary: '¥18,000', 
      joinDate: '2022-11-05',
      performance: '优秀'
    },
    { 
      id: 6, 
      name: '孙八', 
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
      department: '研发部', 
      position: '后端开发工程师', 
      salary: '¥16,000', 
      joinDate: '2023-01-20',
      performance: '良好'
    },
    { 
      id: 7, 
      name: '周九', 
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
      department: '研发部', 
      position: '测试工程师', 
      salary: '¥13,000', 
      joinDate: '2023-04-15',
      performance: '良好'
    },
    { 
      id: 8, 
      name: '吴十', 
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
      department: '产品部', 
      position: '产品经理', 
      salary: '¥17,000', 
      joinDate: '2022-12-10',
      performance: '优秀'
    }
  ];

  // 表格列配置
  const columns = [
    {
      key: 'name',
      title: '姓名',
      render: (text, record) => (
        <div className={styles.nameCell}>
          {record.avatar && (
            <img 
              src={record.avatar} 
              alt={text} 
              className={styles.avatar}
            />
          )}
          <span>{text}</span>
        </div>
      )
    },
    {
      key: 'department',
      title: '部门',
      width: 120
    },
    {
      key: 'position',
      title: '职位',
      width: 180
    },
    {
      key: 'salary',
      title: '薪资',
      width: 120
    },
    {
      key: 'joinDate',
      title: '入职日期',
      width: 150
    },
    {
      key: 'performance',
      title: '绩效',
      width: 100,
      render: (text) => (
        <span className={`${styles.badge} ${text === '优秀' ? styles.excellent : styles.good}`}>
          {text}
        </span>
      )
    }
  ];

  // 处理行点击事件
  const handleRowClick = (rowData) => {
    console.log('点击了行:', rowData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>员工信息表</h1>
      <p className={styles.description}>
        左右滑动表格，观察左侧固定列的变化。当滑动到右侧时，左侧固定列会缩小为图标。
      </p>
      
      <div className={styles.tableWrapper}>
        <FixedColumnTable 
          data={data}
          columns={columns}
          fixedColumnKey="name"
          fixedColumnWidth={220}
          collapsedWidth={60}
          onRowClick={handleRowClick}
          className={styles.customTable}
        />
      </div>
    </div>
  );
}
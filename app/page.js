'use client';

import { useState } from 'react';
import BottomSheet from '../components/BottomSheet';
import Modal from '../components/Modal';
import FixedColumnTable from '../components/FixedColumnTable';
import Slider from '../components/Slider';
import styles from "./page.module.css";

export default function Home() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Slider 状态
  const [sliderValue, setSliderValue] = useState(50);
  const [rangeValue, setRangeValue] = useState([20, 80]);
  const [stepValue, setStepValue] = useState(25);
  const [marksValue, setMarksValue] = useState(60);
  const [rangesValue, setRangesValue] = useState(75);
  

  // 示例数据
  const tableData = [
    {
      id: 1,
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
      department: '技术部',
      position: '前端工程师',
      salary: '15000',
      status: '在职',
      joinDate: '2022-03-15',
      performance: '优秀',
      email: 'zhangsan@company.com',
      phone: '13800138001'
    },
    {
      id: 2,
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
      department: '产品部',
      position: '产品经理',
      salary: '18000',
      status: '在职',
      joinDate: '2021-08-20',
      performance: '良好',
      email: 'lisi@company.com',
      phone: '13800138002'
    },
    {
      id: 3,
      name: '王五',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
      department: '设计部',
      position: 'UI设计师',
      salary: '12000',
      status: '在职',
      joinDate: '2023-01-10',
      performance: '优秀',
      email: 'wangwu@company.com',
      phone: '13800138003'
    },
    {
      id: 4,
      name: '赵六',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
      department: '技术部',
      position: '后端工程师',
      salary: '16000',
      status: '离职',
      joinDate: '2020-11-05',
      performance: '一般',
      email: 'zhaoliu@company.com',
      phone: '13800138004'
    },
    {
      id: 5,
      name: '钱七',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qianqi',
      department: '运营部',
      position: '运营专员',
      salary: '10000',
      status: '在职',
      joinDate: '2023-06-01',
      performance: '良好',
      email: 'qianqi@company.com',
      phone: '13800138005'
    }
  ];

  // 表格列配置
  const tableColumns = [
    {
      key: 'department',
      title: '部门',
      width: '120px'
    },
    {
      key: 'position',
      title: '职位',
      width: '150px'
    },
    {
      key: 'salary',
      title: '薪资',
      width: '100px',
      render: (value) => `¥${value}`
    },
    {
      key: 'status',
      title: '状态',
      width: '80px',
      render: (value) => (
        <span style={{ 
          color: value === '在职' ? '#28a745' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {value}
        </span>
      )
    },
    {
      key: 'joinDate',
      title: '入职日期',
      width: '120px'
    },
    {
      key: 'performance',
      title: '绩效',
      width: '80px',
      render: (value) => (
        <span style={{ 
          color: value === '优秀' ? '#28a745' : value === '良好' ? '#ffc107' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {value}
        </span>
      )
    },
    {
      key: 'email',
      title: '邮箱',
      width: '200px'
    },
    {
      key: 'phone',
      title: '电话',
      width: '130px'
    }
  ];

  // 处理行点击
  const handleRowClick = (rowData, index) => {
    console.log('点击了行:', rowData, '索引:', index);
    // 这里可以添加更多逻辑，比如打开详情弹窗等
  };

  const openBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>弹窗组件演示</h1>
        
        <div className={styles.demoSection}>
          <h2>底部弹出层功能特点</h2>
          <ul className={styles.featureList}>
            <li>✅ 从下到上的平滑弹出动画</li>
            <li>✅ 从上到下的关闭动画</li>
            <li>✅ 点击背景遮罩关闭</li>
            <li>✅ 拖拽指示器</li>
            <li>✅ 移动端优化</li>
            <li>✅ 响应式设计</li>
          </ul>
        </div>

        <div className={styles.demoSection}>
          <h2>居中弹窗功能特点</h2>
          <ul className={styles.featureList}>
            <li>✅ 居中显示的弹窗效果</li>
            <li>✅ 缩放和淡入淡出动画</li>
            <li>✅ 多种尺寸选择（小、中、大）</li>
            <li>✅ 键盘 ESC 键关闭</li>
            <li>✅ 点击背景关闭</li>
            <li>✅ 响应式设计</li>
          </ul>
        </div>

        <div className={styles.demoSection}>
          <h2>固定列表格功能特点</h2>
          <ul className={styles.featureList}>
            <li>✅ 左侧固定列，右侧可横向滚动</li>
            <li>✅ 滚动时固定列自动缩小为图标</li>
            <li>✅ 点击图标可展开并回到左侧</li>
            <li>✅ 支持自定义列渲染</li>
            <li>✅ 响应式设计，移动端友好</li>
            <li>✅ 平滑的动画过渡效果</li>
          </ul>
        </div>

        <div className={styles.demoSection}>
          <h2>滑动输入条功能特点</h2>
          <ul className={styles.featureList}>
            <li>✅ 单值和范围滑块支持</li>
            <li>✅ 鼠标拖拽和键盘导航</li>
            <li>✅ 实时工具提示显示</li>
            <li>✅ 自定义标记和步长</li>
            <li>✅ 区间颜色自定义</li>
            <li>✅ 高性能优化，拖动流畅</li>
            <li>✅ 移动端触摸优化</li>
            <li>✅ 无障碍访问支持</li>
          </ul>
        </div>

        <div className={styles.ctas}>
          <button
            className={styles.primary}
            onClick={openBottomSheet}
          >
            打开底部弹出层
          </button>
          <button
            className={styles.primary}
            onClick={openModal}
          >
            打开居中弹窗
          </button>
        </div>

        {/* Slider 组件演示 */}
        <div className={styles.sliderDemo}>
          <h2>滑动输入条演示</h2>
          
          {/* 基础滑块 */}
          <div className={styles.sliderExample}>
            <h3>基础滑块</h3>
            <p>当前值: {sliderValue}</p>
            <Slider
              min={0}
              max={100}
              value={sliderValue}
              onChange={setSliderValue}
              tooltip={true}
            />
          </div>
          
          {/* 范围滑块 */}
          <div className={styles.sliderExample}>
            <h3>范围滑块</h3>
            <p>当前范围: {rangeValue[0]} - {rangeValue[1]}</p>
            <Slider
              min={0}
              max={100}
              range={true}
              rangeValue={rangeValue}
              onChange={setRangeValue}
              tooltip={true}
            />
          </div>
          
          {/* 步长滑块 */}
          <div className={styles.sliderExample}>
            <h3>步长滑块 (步长: 10)</h3>
            <p>当前值: {stepValue}</p>
            <Slider
              min={0}
              max={100}
              step={10}
              value={stepValue}
              onChange={setStepValue}
              tooltip={true}
            />
          </div>
          
          {/* 标记滑块 */}
          <div className={styles.sliderExample}>
            <h3>标记滑块</h3>
            <p>当前值: {marksValue}</p>
            <Slider
              min={0}
              max={100}
              value={marksValue}
              onChange={setMarksValue}
              marks={{
                0: '0°C',
                25: '25°C',
                50: '50°C',
                75: '75°C',
                100: '100°C'
              }}
              tooltip={true}
            />
          </div>
          
          {/* 区间颜色滑块 */}
          <div className={styles.sliderExample}>
            <h3>区间颜色滑块</h3>
            <p>当前值: {rangesValue}</p>
            <Slider
              min={0}
              max={100}
              value={rangesValue}
              onChange={setRangesValue}
              ranges={[
                { start: 0, end: 30, color: '#52c41a' },    // 绿色 - 低温
                { start: 30, end: 70, color: '#faad14' },   // 黄色 - 中温
                { start: 70, end: 100, color: '#f5222d' }   // 红色 - 高温
              ]}
              marks={{
                0: '低温',
                30: '中温',
                70: '高温',
                100: '极高温'
              }}
              tooltip={true}
            />
          </div>
          
          {/* 组合功能滑块 */}
          <div className={styles.sliderExample}>
            <h3>组合功能滑块 (范围 + 步长 + 标记 + 区间颜色)</h3>
            <p>当前范围: {rangeValue[0]} - {rangeValue[1]}</p>
            <Slider
              min={0}
              max={100}
              step={5}
              range={true}
              rangeValue={rangeValue}
              onChange={setRangeValue}
              ranges={[
                { start: 0, end: 25, color: '#52c41a' },    // 绿色
                { start: 25, end: 50, color: '#1890ff' },   // 蓝色
                { start: 50, end: 75, color: '#faad14' },   // 黄色
                { start: 75, end: 100, color: '#f5222d' }   // 红色
              ]}
              marks={{
                0: '0',
                25: '25',
                50: '50',
                75: '75',
                100: '100'
              }}
              tooltip={true}
            />
          </div>
        </div>

        {/* 固定列表格演示 */}
        <div className={styles.tableDemo}>
          <h2>固定列表格演示</h2>
          <p>向右滚动表格，观察左侧固定列如何缩小为图标。点击图标可以展开并回到左侧。</p>
          <FixedColumnTable
            data={tableData}
            columns={tableColumns}
            fixedColumnWidth={200}
            collapsedWidth={60}
            icon="👤"
            onRowClick={handleRowClick}
          />
        </div>

        <div className={styles.instructions}>
          <h3>使用说明</h3>
          <p>点击上方按钮体验不同的弹窗效果：</p>
          <ul>
            <li><strong>底部弹出层：</strong>点击背景区域或右上角 ✕ 按钮关闭</li>
            <li><strong>居中弹窗：</strong>点击背景区域、右上角 ✕ 按钮或按 ESC 键关闭</li>
            <li>在移动设备上体验最佳效果</li>
          </ul>
        </div>
      </main>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={closeBottomSheet}
        title="底部弹出层"
      >
        <div className={styles.bottomSheetContent}>
          <h3>欢迎使用底部弹出层组件！</h3>
          <p>这是一个功能完整的移动端底部弹出层组件，具有以下特性：</p>
          <ul>
            <li>从下到上的平滑动画</li>
            <li>移动端优化的交互体验</li>
            <li>响应式设计</li>
          </ul>
        </div>
      </BottomSheet>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="居中弹窗"
        size="medium"
      >
        <div className={styles.modalContent}>
          <h3>欢迎使用居中弹窗组件！</h3>
          <p>这是一个功能完整的居中弹窗组件，具有以下特性：</p>
          <ul>
            <li>居中显示的弹窗效果</li>
            <li>缩放和淡入淡出动画</li>
            <li>多种尺寸选择（小、中、大）</li>
            <li>键盘 ESC 键关闭支持</li>
            <li>点击背景关闭功能</li>
            <li>响应式设计，适配各种屏幕</li>
          </ul>
          <div className={styles.modalActions}>
            <button 
              className={styles.secondary}
              onClick={closeModal}
            >
              取消
            </button>
            <button 
              className={styles.primary}
              onClick={closeModal}
            >
              确定
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

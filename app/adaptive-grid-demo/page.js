import AdaptiveGrid from '../../components/AdaptiveGrid';
import styles from './page.module.css';

export default function AdaptiveGridDemo() {
  const items = [
    { id: 1, title: '项目 1', content: '这是第一个项目的内容' },
    { id: 2, title: '项目 2', content: '这是第二个项目的内容' },
    { id: 3, title: '项目 3', content: '这是第三个项目的内容' },
    { id: 4, title: '项目 4', content: '这是第四个项目的内容' },
    { id: 5, title: '项目 5', content: '这是第五个项目的内容（单独占整行）' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>自适应 Grid 布局演示</h1>
      <p className={styles.description}>
        每行两列，最后一行如果是奇数则自动占满整行
      </p>

      <AdaptiveGrid className={styles.customGrid}>
        {items.map((item) => (
          <div key={item.id} className={styles.gridItem}>
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemContent}>{item.content}</p>
          </div>
        ))}
      </AdaptiveGrid>

      {/* 演示偶数个元素的情况 */}
      <h2 className={styles.subtitle}>偶数个元素示例</h2>
      <AdaptiveGrid className={styles.customGrid}>
        {items.slice(0, 4).map((item) => (
          <div key={item.id} className={styles.gridItem}>
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemContent}>{item.content}</p>
          </div>
        ))}
      </AdaptiveGrid>
    </div>
  );
}
import styles from './page.module.css';

export default function GridTwoColumnDemo() {
  // 奇数个 item 示例
  const oddItems = [1, 2, 3, 4, 5];
  
  // 偶数个 item 示例
  const evenItems = [1, 2, 3, 4];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CSS Grid 两列布局演示</h1>
      
      <section className={styles.section}>
        <h2 className={styles.subtitle}>奇数个 Item（最后一个占整行）</h2>
        <div className={styles.grid}>
          {oddItems.map((item) => (
            <div key={item} className={styles.item}>
              Item {item}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>偶数个 Item（正常显示）</h2>
        <div className={styles.grid}>
          {evenItems.map((item) => (
            <div key={item} className={styles.item}>
              Item {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


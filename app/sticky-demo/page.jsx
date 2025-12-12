import Sticky from "../../components/Sticky";
import styles from "./page.module.css";

const sections = [
  {
    id: "what",
    title: "什么是 Sticky？",
    body: "滚动时保持元素在视口内的定位方式，常用于导航、行动按钮或提示条。",
  },
  {
    id: "when",
    title: "适用场景",
    body: "长内容页面需要固定导航、侧边操作按钮、优惠条或信息卡片时。",
  },
  {
    id: "how",
    title: "实现方式",
    body: "该组件通过监听滚动与尺寸变化，实现类似 CSS position: sticky 的效果，并提供 top/bottomBoundary 等扩展。",
  },
];

export default function StickyDemoPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Sticky 组件示例</h1>
        <p className={styles.subtitle}>
          左侧卡片在滚动时固定位置，右侧内容继续滚动。
        </p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <Sticky
            top={200}
            bottomBoundary={1500}
            className={styles.stickyWrapper}
          >
            <div className={styles.stickyCard}>
              <h3 className={styles.cardTitle}>固定卡片</h3>
              <p className={styles.cardBody}>
                使用组件属性 <code>top</code> 设置偏移，滚动时保持在视口内。
              </p>
              <button className={styles.button}>主要操作</button>
              <small className={styles.smallTip}>试着向下滚动页面</small>
            </div>
          </Sticky>
        </aside>

        <main className={styles.content}>
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.section}
            >
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <p className={styles.sectionBody}>{section.body}</p>
              <div className={styles.paragraphs}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Integer nec odio. Praesent libero. Sed cursus ante dapibus
                  diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
                  Duis sagittis ipsum. Praesent mauris.
                </p>
                <p>
                  Fusce nec tellus sed augue semper porta. Mauris massa.
                  Vestibulum lacinia arcu eget nulla. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos.
                </p>
                <p>
                  Curabitur sodales ligula in libero. Sed dignissim lacinia
                  nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In
                  scelerisque sem at dolor. Maecenas mattis. Sed convallis
                  tristique sem.
                </p>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

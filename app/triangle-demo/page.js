"use client";

export default function TriangleDemo() {
  return (
    <div className={styles.container}>
      <h1>CSS 三角形示例</h1>

      <section className={styles.section}>
        <h2>1. 指向左边的等边三角形（基础版）</h2>
        <div className={styles.demo}>
          <div className={styles.triangleLeft}></div>
        </div>
        <div className={styles.codeBlock}>
          <pre>{`.triangleLeft {
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
  border-right: 52px solid #1890ff;
}`}</pre>
        </div>
      </section>

      <section className={styles.section}>
        <h2>2. 指向左边的等边三角形（带圆角）</h2>
        <div className={styles.demo}>
          <div className={styles.triangleLeftRounded}></div>
        </div>
        <div className={styles.codeBlock}>
          <pre>{`.triangleLeftRounded {
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
  border-right: 52px solid #1890ff;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}`}</pre>
        </div>
      </section>

      <section className={styles.section}>
        <h2>3. 使用 clip-path 实现圆角三角形（推荐）</h2>
        <div className={styles.demo}>
          <div className={styles.triangleClipPath}></div>
        </div>
        <div className={styles.codeBlock}>
          <pre>{`.triangleClipPath {
  width: 52px;
  height: 60px;
  background: #1890ff;
  clip-path: polygon(
    0 0,
    100% 50%,
    0 100%
  );
  border-radius: 8px;
}`}</pre>
        </div>
      </section>

      <section className={styles.section}>
        <h2>4. 使用 SVG 实现圆角三角形（最佳方案）</h2>
        <div className={styles.demo}>
          <svg
            className={styles.triangleSvg}
            viewBox="0 0 52 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 8 Q 0 0 8 0 L 44 30 Q 52 30 44 38 L 8 60 Q 0 60 0 52 Z"
              fill="#1890ff"
            />
          </svg>
        </div>
        <div className={styles.codeBlock}>
          <pre>{`<svg viewBox="0 0 52 60">
  <path 
    d="M 0 8 Q 0 0 8 0 L 44 30 Q 52 30 44 38 L 8 60 Q 0 60 0 52 Z" 
    fill="#1890ff"
  />
</svg>
/* 使用二次贝塞尔曲线(Q)实现圆角效果 */`}</pre>
        </div>
      </section>

      <section className={styles.section}>
        <h2>5. 不同尺寸的圆角三角形</h2>
        <div className={styles.demo}>
          <div className={`${styles.triangleClipPath} ${styles.small}`}></div>
          <div className={`${styles.triangleClipPath} ${styles.medium}`}></div>
          <div className={`${styles.triangleClipPath} ${styles.large}`}></div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>6. 不同颜色的圆角三角形</h2>
        <div className={styles.demo}>
          <div className={`${styles.triangleClipPath} ${styles.color1}`}></div>
          <div className={`${styles.triangleClipPath} ${styles.color2}`}></div>
          <div className={`${styles.triangleClipPath} ${styles.color3}`}></div>
          <div className={`${styles.triangleClipPath} ${styles.color4}`}></div>
        </div>
      </section>
    </div>
  );
}

import styles from './page.module.css';

export default function PostLoading() {
  return (
    <div className={styles.container} aria-busy="true" aria-label="Đang tải nội dung bài viết">
      <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
      <div className={`${styles.skeletonBlock} ${styles.skeletonTitleShort}`} />
      <div className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} />
      <div className={`${styles.skeletonBlock} ${styles.skeletonHero}`} />
      <div className={styles.skeletonParagraph}>
        <div className={`${styles.skeletonBlock} ${styles.skeletonLine}`} />
        <div className={`${styles.skeletonBlock} ${styles.skeletonLine}`} />
        <div className={`${styles.skeletonBlock} ${styles.skeletonLine}`} />
        <div className={`${styles.skeletonBlock} ${styles.skeletonLineShort}`} />
      </div>
    </div>
  );
}

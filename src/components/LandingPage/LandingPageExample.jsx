import styles from '../../styles/LandingPage.module.css';

const LandingPageExample = () => {
  return (
    <div className={styles.exampleSection}>
      <h2 className={styles.tagline}>Take your photos to the Next Level</h2>
      <div className={styles.exampleImages}>
        <div className={styles.exampleBox}>
          <div className={styles.placeholderImage}>
            <span>Original Example Image</span>
          </div>
        </div>
        <div className={styles.exampleBox}>
          <div className={styles.placeholderImage}>
            <span>Edited Example Image</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageExample;

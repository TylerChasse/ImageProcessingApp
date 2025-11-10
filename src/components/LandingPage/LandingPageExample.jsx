import styles from '../../styles/LandingPage.module.css';
// Import your images here
import landingBefore from '../../assets/landingPageBefore.jpg';
import landingAfter from '../../assets/landingPageAfter.png';

const LandingPageExample = () => {
  return (
    <div className={styles.exampleSection}>
      <h2 className={styles.tagline}>Take your photos to the Next Level</h2>
      <div className={styles.exampleImages}>
        <div className={styles.exampleBox}>
          <img 
            src={landingBefore} 
            alt="Original example" 
            className={styles.exampleImage}
          />
        </div>
        <div className={styles.exampleBox}>
          <img 
            src={landingAfter} 
            alt="Edited example" 
            className={styles.exampleImage}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPageExample;
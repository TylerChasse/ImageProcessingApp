import Toolbar from '../components/Toolbar';
import LandingPageExample from '../components/LandingPage/LandingPageExample';
import ImageUpload from '../components/ImageUpload';
import styles from '../styles/LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <Toolbar />
      <div className={styles.content}>
        <LandingPageExample />
        <div className={styles.uploadSection}>
          <h2 className={styles.getStarted}>Get Started</h2>
          <ImageUpload buttonClassName={styles.uploadButton} />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
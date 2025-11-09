import Toolbar from '../components/Toolbar';
import LandingPageExample from '../components/LandingPage/LandingPageExample';
import ImageUpload from '../components/LandingPage/ImageUpload';
import styles from '../styles/LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <Toolbar />
      <div className={styles.content}>
        <LandingPageExample />
        <ImageUpload />
      </div>
    </div>
  );
};

export default LandingPage;

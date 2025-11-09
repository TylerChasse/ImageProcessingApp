import Toolbar from '../components/Toolbar';
import OriginalImage from '../components/ImageEditor/OriginalImage';
import EditedImage from '../components/ImageEditor/EditedImage';
import FiltersSection from '../components/ImageEditor/FiltersSection';
import styles from '../styles/ImageEditor.module.css';

const ImageEditor = () => {
  return (
    <div className={styles.editorPage}>
      <Toolbar />
      <div className={styles.editorContent}>
        <div className={styles.imagesContainer}>
          <OriginalImage />
          <EditedImage />
        </div>
        <FiltersSection />
      </div>
    </div>
  );
};

export default ImageEditor;

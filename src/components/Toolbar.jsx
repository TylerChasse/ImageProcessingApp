import { useState } from 'react';
import { useImage } from '../context/ImageContext';
import styles from '../styles/Toolbar.module.css';

const Toolbar = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { setShowEditor } = useImage();

  // If the logo is clicked, navigate back to the landing page (don't show editor)
  const handleLogoClick = () => {
    setShowEditor(false);
  };

  return (
    <>
      <div className={styles.toolbar}>
        {/* App Logo that navigates to landing page when clicked */}
        <div className={styles.logo} onClick={handleLogoClick}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <rect x="5" y="5" width="40" height="40" rx="4" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="18" cy="18" r="4" fill="white"/>
            <path d="M5 35 L15 25 L25 35 L35 20 L45 30 L45 45 L5 45 Z" fill="white"/>
          </svg>
        </div>
        {/* App Title */}
        <h1 className={styles.title}>Image Editor</h1>
        {/* Buttons to open About and Help modals */}
        <div className={styles.buttons}>
          <button onClick={() => setShowAbout(true)}>About</button>
          <button onClick={() => setShowHelp(true)}>Help</button>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className={styles.modalOverlay} onClick={() => setShowAbout(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>About</h2>
            <p>
              This is a web-based image processing system that allows you to apply a variety of filters to your images in real-time.
            </p>
            <p>
              Contributors: Tyler Chasse, Ryan Jackson, Espen Wold.
            </p>
            <button onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className={styles.modalOverlay} onClick={() => setShowHelp(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Help</h2>
            <h3>How to Use:</h3>
            <p><strong>1. Upload an Image:</strong> Click the "Upload a Photo" button and select an image from your device.</p>
            <p><strong>2. Apply Filters:</strong> Check the box next to any filter to enable it. Use the slider to adjust the filter strength.</p>
            <p><strong>3. View Details:</strong> Click "Details" on any filter to see a description and example.</p>
            <p><strong>4. Download:</strong> Click the "Download" button to save your edited image.</p>
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Toolbar;
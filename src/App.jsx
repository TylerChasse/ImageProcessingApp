import { ImageProvider, useImage } from './context/ImageContext'
import LandingPage from './pages/LandingPage'
import ImageEditor from './pages/ImageEditor'
import './App.css'

function AppContent() {
  const { showEditor } = useImage();

  return (
    <>
      {showEditor ? <ImageEditor /> : <LandingPage />}
    </>
  );
}

function App() {
  return (
    <ImageProvider>
      <AppContent />
    </ImageProvider>
  );
}

export default App

/**
 * App.jsx with Error Handling
 * 
 * Wraps application with ErrorBoundary and ErrorNotificationProvider.
 */

import { ImageProvider, useImage } from './context/ImageContext'
import { ErrorNotificationProvider } from './components/ErrorNotification'
import ErrorBoundary from './components/ErrorBoundary'
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
    <ErrorBoundary>
      <ErrorNotificationProvider>
        <ImageProvider>
          <AppContent />
        </ImageProvider>
      </ErrorNotificationProvider>
    </ErrorBoundary>
  );
}

export default App
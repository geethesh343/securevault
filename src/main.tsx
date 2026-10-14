import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { db } from './services/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

// Validate initial connection to Firestore on boot per Firebase guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

createRoot(document.getElementById('root')!).render(<App />);

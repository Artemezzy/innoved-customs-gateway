import { createRoot } from 'react-dom/client'
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/700-italic.css';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
// // import { inject } from '@vercel/analytics'
import './index.css'
import App from './App.jsx'

// Privacy-friendly page analytics — uncomment both lines to enable on Vercel
// inject()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)

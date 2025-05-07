import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'    // si tu utilises Tailwind ou un CSS perso
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

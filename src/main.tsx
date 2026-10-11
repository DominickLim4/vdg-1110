import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/jersey-15/400.css'
import '@fontsource-variable/fraunces/wght.css'
import '@fontsource-variable/fraunces/wght-italic.css'
import './estilo/tokens.css'
import './estilo/global.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

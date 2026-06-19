import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { clinicConfig } from './clinicConfig'

// ── Inyectar variables CSS del tema ──────────────────────────
// Cambiar clinicConfig.theme es suficiente para re-tematizar la landing.
const { theme } = clinicConfig
const root = document.documentElement
root.style.setProperty('--hc-primary',    theme.primary)
root.style.setProperty('--hc-accent',     theme.accent)
root.style.setProperty('--hc-background', theme.background)
root.style.setProperty('--hc-secondary',  theme.secondary)
root.style.setProperty('--hc-text',       theme.text)
root.style.setProperty('--hc-neutral',    theme.neutral)

// ── Cargar Google Fonts dinámicamente desde clinicConfig ─────
const fontParams = [
  `${theme.fontDisplay.replace(/ /g, '+')}:wght@400;500;600;700`,
  `${theme.fontBody.replace(/ /g, '+')}:wght@300;400;500;600;700`,
].join('&family=')
const fontLink = document.createElement('link')
fontLink.rel  = 'stylesheet'
fontLink.href = `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap`
document.head.appendChild(fontLink)

// ── Inyectar utilidades de fuente (Tailwind no genera clases con var()) ─
// Unlayered → cascada más alta que @layer utilities de Tailwind.
const q = (name) => name.includes(' ') ? `'${name}'` : name
const fontStyle = document.createElement('style')
fontStyle.id = 'hc-font-utilities'
fontStyle.textContent = `
  .font-display   { font-family: ${q(theme.fontDisplay)}, system-ui, sans-serif; }
  .font-body      { font-family: ${q(theme.fontBody)}, system-ui, sans-serif; }
  .font-fraunces  { font-family: ${q(theme.fontDisplay)}, system-ui, sans-serif; }
  .font-sans      { font-family: ${q(theme.fontBody)}, system-ui, sans-serif; }
`
document.head.appendChild(fontStyle)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

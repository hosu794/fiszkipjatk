import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FlashcardApp from "./flashcard-app.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FlashcardApp />
  </StrictMode>,
)

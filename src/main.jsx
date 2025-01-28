import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import Cadastro from './pages/login'
import Login from './pages/Cadastro'
import Cadastro from './pages/Cadastro'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Cadastro/>
  </StrictMode>,
)

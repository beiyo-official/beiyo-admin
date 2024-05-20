import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { Link, Outlet, useNavigate } from 'react-router-dom'




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
     <App />
    
   
  </React.StrictMode>,
)

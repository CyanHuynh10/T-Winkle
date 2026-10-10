import React from 'react'
import {createRoot} from 'react-dom/client'
import {ManagerApp} from './app/ManagerApp'
import './manager.css'
createRoot(document.getElementById('manager-root')!).render(<React.StrictMode><ManagerApp/></React.StrictMode>)

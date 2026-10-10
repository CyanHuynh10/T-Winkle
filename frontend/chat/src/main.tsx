import React from 'react'
import { createRoot } from 'react-dom/client'
import ChatApp from './ChatApp'
import './chat.css'
const mount = document.getElementById('twinkle-ai-chat-root')
if (mount) createRoot(mount).render(<React.StrictMode><ChatApp mode={mount.dataset.mode || 'ai'} conversationId={mount.dataset.conversationId ? Number(mount.dataset.conversationId) : undefined} startStoreId={mount.dataset.startStoreId ? Number(mount.dataset.startStoreId) : undefined} /></React.StrictMode>)

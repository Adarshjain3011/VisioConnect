import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from "react-router-dom"

import { SocketProvider } from './providers/Socket.jsx'

import { PeerProvider } from './providers/Peer.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(

  <SocketProvider>

    <PeerProvider>
      
      <BrowserRouter>


        <App />

      </BrowserRouter>

    </PeerProvider>


  </SocketProvider> 

)





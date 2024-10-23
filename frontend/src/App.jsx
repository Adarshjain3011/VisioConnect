import { useState } from 'react'
import { Route, Routes } from "react-router-dom";

import { SocketProvider } from './providers/Socket';

import Homepage from './components/Homepage';
import Room from './components/Room';

function App() {


  return (

    <div>

      <h1>helllow world </h1>

      {/* <SocketProvider> */}

      <Routes>


        <Route path="/" element={<Homepage />} />

        <Route path='/room/:id' element={<Room></Room>}></Route>

      </Routes>

      {/* </SocketProvider> */}

    </div>

  )
}

export default App










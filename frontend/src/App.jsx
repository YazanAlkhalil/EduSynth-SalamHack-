import { useState } from 'react'

import './App.css'
import { Routes, Route } from 'react-router-dom';
import GetStarted from './Routes/GetStarted'
import Chat from './Component/Chat'
function App() {

  return (
   <>
   <Routes>
      <Route path="/" element={<GetStarted />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
    </>
  )
}

export default App

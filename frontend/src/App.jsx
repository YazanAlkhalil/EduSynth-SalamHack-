import { useState } from 'react'

import './App.css'
import { Routes, Route } from 'react-router-dom';
import GetStarted from './Routes/GetStarted'
import Chat from './Component/Chat'
import GenerateContent from './Component/GenerateContant'

function App() {

  return (
   <>
   <Routes>
       <Route path='/generate' element={<GenerateContent/>}/>
      <Route path="/" element={<GetStarted />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
    </>
  )
}

export default App

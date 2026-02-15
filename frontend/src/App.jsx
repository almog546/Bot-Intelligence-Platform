import { useState } from 'react'
import Signup from './Signup/Signup';
import { Routes, Route} from 'react-router-dom';
import Login from './Login/Login';



function App() {
 

  return (
    <>
    <Routes>
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
     </Routes>
    </>
  )
}

export default App

import { useState } from 'react'
import Signup from './Signup/Signup';
import { Routes, Route} from 'react-router-dom';



function App() {
 

  return (
    <>
    <Routes>
    <Route path="/signup" element={<Signup />} />
     </Routes>
    </>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Navbar from './Navbar.jsx'
import {Route, Routes} from "react-router-dom";
import {Home, Performance, Maps, Overview} from './components/contents';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Navbar />

      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/maps" element={<Maps />} />
        </Routes>


    </div>
  );
}

export default App

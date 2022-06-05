import React, { useState } from "react"
import Interface from "./interface/Interface"
import Login from "./components/Login/Login"
import { HashRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {

  const [join, setJoin] = useState(null)

  const joinRoom = (data) => {
    setJoin(data)
  }

  return (
    <Router basename='/'>
      {join ? <Interface {...join} /> : undefined}
      <Routes>
        {
          join ? undefined : (
            <Route path="/" element={<Login join={joinRoom} />}> 
               <Route path="/:roomID" element={<Login join={joinRoom} />} />
            </Route>
          )
        }
      </Routes>
    </Router>
  )
}

export default App;

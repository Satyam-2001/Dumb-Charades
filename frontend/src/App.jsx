import React, { Fragment, useState } from "react"
import Interface from "./interface/Interface"
import Login from "./components/Login/Login"

const roomID = window.location.pathname.substring(1)
const gameState = roomID === '' ? 'Create Private Room' : 'Join Room'

const App = () => {

  const [join, setJoin] = useState(false)

  const joinRoom = () => {
    setJoin(true)
  }

  return (
    <Fragment>
      {join ? <Interface gameState={gameState} roomID={roomID} /> : <Login join={joinRoom} name={gameState} />}
    </Fragment>
  )
}

export default App;

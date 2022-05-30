import React, { useState, useEffect, useContext, Fragment } from 'react'
import Chooser from './Chooser'
import Drawer from './Drawing/Drawer'
import Actor from './Acting/Actor'
import classes from './Panel.module.css'
import UserContext from '../../../context/user-context'
import GameEnd from './GameEnd/GameEnd'
import SocketContext from '../../../context/socket-context'
import DataContext from '../../../context/data-context'
import MessagePopUp from './MessagePopUp/MessagePopUp'

const Panel = (props) => {

    const user = useContext(UserContext)
    const socket = useContext(SocketContext)
    const roomData = useContext(DataContext)
    const { id: userID } = user

    const [performer, setPerformer] = useState(null)
    const [chooser, setChooser] = useState(null)
    const [gameEnd, setGameEnd] = useState(null)
    const [scoreBoard, setScoreBoard] = useState(false)

    useEffect(() => {
        setChooser(roomData.status.chooser)
        setPerformer(roomData.status.performer)
        if (roomData.status.performer) {
            props.Connector.broadcast('perform', { isPerforming: true, word: roomData.status.movie, initiator: roomData.status.performer.id === userID })
        }
        else {
            props.Connector.broadcast('perform', { isPerforming: false, initiator: roomData.status.chooser.id === userID })
        }
    }, [])

    useEffect(() => {
        socket.on('getWord', (alias, word, performer) => {
            setChooser(null)
            setPerformer(performer)
            props.Connector.broadcast('perform', { alias, isPerforming: true, word, initiator: userID === performer.id })
        })
        return () => { socket.off('getWord') }
    }, [])

    useEffect(() => {
        socket.on('getChooser', (chooser, round, scoreAdd) => {
            props.Connector.broadcast('perform', { isPerforming: false, initiator: userID === chooser.id })
            props.Connector.broadcast('round', round)
            setPerformer(null)
            if (scoreAdd) {
                for (let i in scoreAdd) {
                    props.Connector.broadcast('score' + i, scoreAdd[i])
                }
                setScoreBoard(scoreAdd)
                const timeOut = setTimeout(() => {
                    setScoreBoard(false)
                    setChooser(chooser)
                    clearTimeout(timeOut)
                }, 5000)
            }
            else {
                setChooser(chooser)
            }
        })
        return () => { socket.off('getChooser') }
    }, [])

    useEffect(() => {
        socket.on('gameEnd', (data, scoreAdd) => {
            props.Connector.broadcast('perform', { isPerforming: false, initiator: false })
            setGameEnd(data)
            if (scoreAdd) {
                for (let i in scoreAdd) {
                    props.Connector.broadcast('score' + i, scoreAdd[i])
                }
            }
            props.Connector.Provider({ isPerforming: false })
        })
        return () => { socket.off('gameEnd') }
    })

    return (
        <div className={classes.panel}>
            {gameEnd ? <GameEnd winner={gameEnd.winner} score={gameEnd.score} /> :
                scoreBoard ? <GameEnd score={scoreBoard} /> :
                    chooser ? <Chooser isChooser={chooser.id === userID} name={chooser.name} /> :
                        performer ?
                            roomData.game === 'DRAWING' ? <Drawer isPerformer={performer.id === userID} /> : <Actor isPerformer={performer.id === userID} />
                            : undefined
            }
            {
                !gameEnd ? <MessagePopUp /> : undefined
            }
        </div>
    )
}

export default React.memo(Panel)
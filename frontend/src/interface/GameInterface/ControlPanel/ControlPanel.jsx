import React, { useCallback, useContext, useEffect, useState } from 'react'
import Utility from './Utility'
import classes from './ControlPanel.module.css'
import DataContext from '../../../context/data-context'


const ControlPanel = (props) => {

    const objID = 'ControlPanel'
    const gameData = useContext(DataContext)
    const [currentRound, setCurrentRound] = useState(gameData.status.currentRound)

    useEffect(() => {
        props.Connector.litsen(objID, 'round', (round) => {
            if (round && currentRound != round) setCurrentRound(round)
        })
        return () => { props.Connector.remove(objID, 'round') }
    }, [])

    return (
        <div className={classes['control-panel']}>
            <div className={classes.start}>
                <p className={classes.round}>ROUND {currentRound}/{gameData.rounds}</p>
            </div>
            <div className={classes.center}>
                <Utility label='Audio' util='mic' myStream={props.myStream} />
                {/* <Utility label='Video' util='videocam' myStream={props.myStream} />
                <button className='icon-button'>
                    <i className='circle circle_hover material-icons'>tty</i>
                </button> */}
            </div>
            <div className={classes.end}>
                <button className='icon-button' onClick={props.chatBoxPressed}>
                    {/* <p className={classes['unread-message']}>3</p> */}
                    <i className='circle circle_hover material-icons'>chat</i>
                </button>
                <button className='icon-button' onClick={props.joiningInfoPressed}>
                    <i className='circle circle_hover material-icons'>person_add</i>
                </button>
            </div>
        </div>
    )
}

export default React.memo(ControlPanel)
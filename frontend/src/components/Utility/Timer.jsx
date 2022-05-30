import React, { useContext, useEffect } from 'react'
import DataContext from '../../context/data-context'
import SocketContext from '../../context/socket-context'
import useTimer from '../../hooks/use-timer'
import classes from './Timer.module.css'

const twoDigit = (num) => {
    const s = String(num)
    if (s.length === 2) return s
    return '0' + s
}

const Timer = (props) => {

    const socket = useContext(SocketContext)
    const { id: roomID } = useContext(DataContext)

    const [time, setTime] = useTimer(props.time, () => {
        console.log(props.initiator);
        if (props.initiator) {
            socket.emit('timeOut', roomID)
        }
        props.setTimerStatus(null)
    })

    useEffect(() => {
        setTime(props.time)
    }, [props.time])

    return (
        <div className={classes.timer}>
            <p className={classes.time}>{twoDigit(Math.floor(time/60))}</p>
            <p className={classes.colon}>:</p>
            <p className={classes.time}>{twoDigit(time%60)}</p>
            {/* <img src={require('../../assets/timer.png')} className={classes.image} /> */}
        </div>
    )
}

export default React.memo(Timer)
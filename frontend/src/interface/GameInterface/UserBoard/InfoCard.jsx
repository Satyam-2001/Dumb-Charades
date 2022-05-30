import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../context/user-context'
import classes from './InfoCard.module.css'
import Icon from '../Utils/Icon'
import SocketContext from '../../../context/socket-context'

const InfoCard = (props) => {

    const user = useContext(UserContext)
    const socket = useContext(SocketContext)
    const [micStatus, setMicStatus] = useState(user.mic)
    const isMe = user.id === props.user.id

    useEffect(() => {
        socket.on('mic' + String(props.user.id), (micStatus) => {
            setMicStatus(micStatus)
        })
        return () => { socket.off('mic' + String(props.user.id)) }
    }, [])

    return (
        <div className={classes.card} style={{ borderColor: props.user.color }}>
            <img src={require(`../../../assets/avatar/${props.user.avatar}.png`)} />
            <p className={classes.name}>{isMe ? 'You' : props.user.name}</p>
            <Icon util='mic' status={micStatus} size='40px' className={classes.mic} hover={false} />
        </div>
    )
}

export default InfoCard
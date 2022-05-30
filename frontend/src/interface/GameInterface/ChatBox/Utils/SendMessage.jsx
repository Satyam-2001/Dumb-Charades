import React, { useContext, useState } from 'react'
import UserContext from '../../../../context/user-context'
import DataContext from '../../../../context/data-context'
import SocketContext from '../../../../context/socket-context'
import classes from './SendMessage.module.css'

const SendMessage = (props) => {

    const user = useContext(UserContext)
    const socket = useContext(SocketContext)
    const roomData = useContext(DataContext)

    const [message, setMessage] = useState('')
    const [sendActive, setSendActive] = useState(false)

    const sendMessage = () => {
        if (!sendActive) return
        if (props.recieversInfo.group) {
            socket.emit('sendMessage', props.recieversInfo.id, { roomID: roomData.id, group: true, name: user.name, color: user.color, message: message, team: user.team })
        }
        else {
            socket.emit('sendMessage', props.recieversInfo.id, { roomID: roomData.id, group: false, message: message })
        }
        setMessage('')
        setSendActive(false)
    }

    const keyDownhandler = (event) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const messageChangeHandler = (event) => {
        if (event.target.value.trim()) {
            setSendActive(true)
        }
        else {
            setSendActive(false)
        }
        setMessage(event.target.value)
    }

    return (
        <div className={classes['send-message']}>
            <input type="text" name="message" value={message} onChange={messageChangeHandler} onKeyDown={keyDownhandler} placeholder="Send a message" className={classes['input-message']} autoComplete="off" autoFocus={true} />
            <button onClick={sendMessage} className={`material-icons ${classes['send-icon']} ${sendActive && classes['send-active']}`} disabled={!sendActive}>send</button>
        </div>
    )
}

export default SendMessage
import React, { useContext, useEffect, useState } from 'react'
import classes from './MessagePopUp.module.css'
// import UserContext from '../../../../context/user-context'
import SocketContext from '../../../../context/socket-context'
import MessageElement from './MessageElement'

const MessagePopUp = (props) => {

    // const user = useContext(UserContext)
    const socket = useContext(SocketContext)
    const [message, setMessage] = useState([])

    useEffect(() => {
        socket.on('recieveGuess', (name, word, right) => {
            setMessage((message) => [...message, { id: name + word, name, word, right }])
        })
        return () => { socket.off('recieveGuess') }
    }, [])

    const removeElement = (msgID) => {
        setMessage((message) => {
            if (message.length == 0) return message
            return message.filter(msg => msg.id !== msgID)
        })
    }

    return (
        <div className={classes.backdrop}>
            {
                message.map((data) => {
                    return <MessageElement key={data.id} data={data} removeElement={removeElement} />
                })
            }
        </div>
    )
}

export default MessagePopUp
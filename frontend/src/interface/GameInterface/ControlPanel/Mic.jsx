import React, { useContext, useState } from 'react'
import DataContext from '../../../context/data-context'
import SocketContext from '../../../context/socket-context'
import UserContext from '../../../context/user-context'
import MicIcon from '../Utils/Icon'

const Mic = (props) => {

    const [micStatus, setMicStatus] = useState(false)
    const socket = useContext(SocketContext)
    const { id: userID } = useContext(UserContext)
    const { id: roomID } = useContext(DataContext)

    const micChangeHandler = () => {
        props.myStream.current.getAudioTracks()[0].enabled = !micStatus;
        socket.emit('mic', roomID, userID, !micStatus)
        setMicStatus((micStatus) => !micStatus)
    }

    return (
        <button className='icon-button' onClick={micChangeHandler}>
            <MicIcon micStatus={micStatus} hover={true} />
        </button>
    )
}

export default Mic
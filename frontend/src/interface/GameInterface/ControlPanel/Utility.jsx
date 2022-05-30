import React, { useContext, useState } from 'react'
import DataContext from '../../../context/data-context'
import SocketContext from '../../../context/socket-context'
import UserContext from '../../../context/user-context'
import Icon from '../Utils/Icon'

const Utility = (props) => {

    const [status, setStatus] = useState(false)
    const socket = useContext(SocketContext)
    const { id: userID } = useContext(UserContext)
    const { id: roomID } = useContext(DataContext)

    const stateChangeHandler = () => {
        props.myStream.current[`get${props.label}Tracks`]()[0].enabled = !status;
        socket.emit(props.util, roomID, userID, !status)
        setStatus((status) => !status)
    }

    return (
        <button className='icon-button' onClick={stateChangeHandler}>
            <Icon status={status} hover={true} util={props.util} />
        </button>
    )
}

export default Utility
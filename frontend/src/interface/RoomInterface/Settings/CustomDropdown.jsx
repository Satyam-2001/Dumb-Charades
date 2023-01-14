import React, { useContext, useEffect, useState } from 'react'
import RoomContext from '../../../context/room-context'
import SocketContext from '../../../context/socket-context'
import classes from './CustomDropdown.module.css'
import Template from './Template'

const CustomDropdown = (props) => {

    const socket = useContext(SocketContext)
    const roomData = useContext(RoomContext)
    
    const inputHandler = (event) => {
        socket.emit(props.label, roomData.id, event.target.value)
    }

    return (
        <Template className={classes['custom-dropdown']} label={props.label} disabled={props.disabled}>
            <select onChange={inputHandler} value={roomData[props.label]} className={props.disabled ? classes.disabled : undefined}>
                {props.options.map((value) => {
                    return <option key={value} value={value}>{value}</option>
                })} 
            </select>
        </Template>
    )
}

export default CustomDropdown
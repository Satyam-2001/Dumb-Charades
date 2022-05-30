import React, { useEffect, useRef , useContext } from 'react'
import SocketContext from '../../../../context/socket-context'
import Peer from 'simple-peer'
import classes from './video.module.css'

const ShowVideo = (props) => {

    const socket = useContext(SocketContext)
    const ref = useRef()

    useEffect(() => {
        socket.on('video signal', (callerID, incomingVideo) => {
            const peer = new Peer({
                initiator: false,
                trickle: false,
            })
            peer.on('signal', signal => {
                socket.emit('accept video signal', callerID, signal)
            })
            peer.signal(incomingVideo);
            peer.on("stream", stream => {
                console.log(stream);
                ref.current.srcObject = stream;
            })
        })
        return () => { socket.off('video signal') }
    }, [])

    return (
        <video playsInline autoPlay ref={ref} className={classes['video_panel']} />
    )
}

export default ShowVideo
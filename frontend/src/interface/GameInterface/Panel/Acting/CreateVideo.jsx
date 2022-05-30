import React, { useState, useRef, useContext, useLayoutEffect } from 'react'
import UserContext from '../../../../context/user-context'
import SocketContext from '../../../../context/socket-context'
import VideoConnection from '../../../../peer/videoConnection'
import classes from './video.module.css'
import DataContext from '../../../../context/data-context'

const CreateVideo = (props) => {

    const user = useContext(UserContext)
    const socket = useContext(SocketContext)
    const { allUsers } = useContext(DataContext)
    // const [currentStream , setStream] = useState()
    const { id: userId } = user

    const myStream = useRef()

    useLayoutEffect(() => {
        navigator.getUserMedia({ video: true }, (stream) => {
            
            myStream.current.srcObject = stream
            const Peer = new VideoConnection(socket, stream)
            for (let i = 0; i < allUsers.length; i++) {
                if (userId !== allUsers[i]) {
                    Peer.createPeer(allUsers[i])
                }
            }

            socket.on('video signal accepted', (id, signal) => {
                const item = Peer.getPeerByID(id)
                item.peer.signal(signal)
            })

        }, (e) => { console.log(e); })

        return () => {
            socket.off('video signal accepted')
            myStream.current.srcObject.getTracks().forEach((track) => {
                track.stop()
            });
        }
    }, [])
    return (
        <video playsInline autoPlay ref={myStream} className={classes['video_panel']} />
    )
}

export default CreateVideo
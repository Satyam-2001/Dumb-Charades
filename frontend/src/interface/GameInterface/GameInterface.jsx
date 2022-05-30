import React, { useContext, useEffect, useRef, useState, useReducer } from 'react'
import UserContext from '../../context/user-context'
import ChatBox from './ChatBox/ChatBox'
import ControlPanel from './ControlPanel/ControlPanel'
import classes from './GameInterface.module.css'
import Panel from './Panel/Panel'
import Header from './Header/Header'
import UserBoard from './UserBoard/UserBoard'
import { addChats } from './ChatBox/DataBase/database'
import Connector from '../../connector/Connector'
import JoiningInfoCard from './JoiningInfoCard/JoiningInfoCard'
import Connection from '../../peer/connection'
import Audio from './Utils/Audio'
import SocketContext from '../../context/socket-context'
import DataContext from '../../context/data-context'

const connector = new Connector()

const GameInterface = (props) => {

    const socket = useContext(SocketContext)
    const user = useContext(UserContext)
    const { id: userId } = user

    const [gameData, dispatchGameData] = useReducer(props.dataReducer, props.gameData)

    const [chatBoxOpen, setChatBoxOpen] = useState(false)
    const [joiningInfoOpen, setJoiningInfoOpen] = useState(false)
    const [peersArray, setPeersArray] = useState([])
    // const [currentRound, setCurrentRound] = useState(gameData.status.currentRound)
    const [addChatCallBack, setAddChatCallBack] = useState(null)
    const { allUsers } = gameData

    const myStream = useRef()

    const chatBoxPressed = () => {
        setChatBoxOpen(state => !state)
        setJoiningInfoOpen(false)
    }

    const joiningInfoPressed = () => {
        setJoiningInfoOpen(state => !state)
        setChatBoxOpen(false)
    }

    useEffect(() => {
        socket.on('userJoinedGame', (user, team) => {
            dispatchGameData({ type: 'ADD_USER', user, team })
        })
        return () => { socket.off('userJoinedGame') }
    }, [])

    useEffect(() => {
        socket.on('userLeftRoom', (userID, team) => {
            // setAllUsers((users) => users.filter(id => id !== userID))
            if (team !== null) {
                dispatchGameData({ type: 'REMOVE_USER', userID, team })
            }
        })
        return () => { socket.off('userLeftRoom') }
    }, [])

    useEffect(() => {

        navigator.getUserMedia({ audio: true }, (stream) => {

            stream.getAudioTracks()[0].enabled = false;
            const Peers = new Connection(socket, stream)
            myStream.current = stream

            const index = allUsers.findIndex((id) => id === userId)
            const peers = []
            for (let i = 0; i < index; i++) {
                const peer = Peers.createPeer(allUsers[i])
                peers.push({ id: allUsers[i], peer })
            }
            setPeersArray(peers)

            socket.on('returned signal', (id, signal) => {
                const item = Peers.getPeerByID(id)
                item.peer.signal(signal);
            });

            socket.on('receiving signal', (callerID, signal) => {
                const peer = Peers.addPeer(callerID, signal)
                setPeersArray((peers) => [...peers, { id: callerID, peer }])
            })

        }, (e) => { console.log(e); })

        return () => {
            socket.off('receiving signal')
            socket.off('returned signal')
        }
    }, [])

    useEffect(() => {
        socket.on('recieveMessage', (messageID, messageInfo) => {
            let unRead = true
            if (addChatCallBack) {
                unRead = addChatCallBack(messageID, messageInfo)
            }
            addChats(messageID, messageInfo, unRead)
        })
        return () => { socket.off('recieveMessage') }
    }, [addChatCallBack])

    return (
        <DataContext.Provider value={gameData}>
            < div className={classes.page} >
                <Header Connector={connector} />
                <div className={classes.content}>
                    <UserBoard team='A' Connector={connector} className={chatBoxOpen || joiningInfoOpen ? classes.messageTaemA : undefined} />
                    <Panel Connector={connector} />
                    <UserBoard team='B' Connector={connector} className={chatBoxOpen || joiningInfoOpen ? classes.messageTaemB : undefined} />
                    {chatBoxOpen && <ChatBox chatBoxClose={chatBoxPressed} addChat={setAddChatCallBack} />}
                    {joiningInfoOpen && <JoiningInfoCard joinInfoClose={joiningInfoPressed} />}
                </div>
                <ControlPanel Connector={connector} chatBoxPressed={chatBoxPressed} joiningInfoPressed={joiningInfoPressed} myStream={myStream} />
            </div >
            <div>
                {peersArray.map((user) => {
                    return (
                        <Audio key={user.id} peer={user.peer} />
                    );
                })}
            </div>
        </DataContext.Provider>
    )
}

export default GameInterface
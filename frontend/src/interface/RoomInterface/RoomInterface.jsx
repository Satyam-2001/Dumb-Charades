import React, { useEffect, useState, useRef, useReducer, useContext } from 'react'
import PageDesign from '../../components/Cards/PageDesign'
import Team from './Team'
import classes from './RoomInterface.module.css'
import UserSettings from './Settings/UserSettings'
import UserContext from '../../context/user-context'
import SocketContext from '../../context/socket-context'
import RoomContext from '../../context/room-context'

const initialData = {
    id: '',
    admin: '',
    isRunning: false,
    game: 'DRAWING',
    rounds: 1,
    duration: 120,
    team: { 'A': [], 'B': [] }
}

const RoomInterface = (props) => {

    const user = useContext(UserContext)
    const socket = useContext(SocketContext)
    const [roomData, dispatchRoomData] = useReducer(props.dataReducer, initialData)
    const [team, setTeam] = useState('A')
    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        if (props.gameState === 'Create Private Room') {
            socket.emit('createRoom', user, (data) => {
                props.setUser({ ...data.user, team })
                setAllUsers([data.user.id])
                dispatchRoomData({ type: 'RESET', roomData: data.roomData })
            })
        }
        else {
            socket.emit('joinRoom', props.roomID, user, (data) => {
                props.setUser({ ...data.user, team })
                setTeam(data.team)
                setAllUsers(data.allUsers)
                dispatchRoomData({ type: 'RESET', roomData: data.roomData })
            })
        }
    }, [])

    useEffect(() => {
        socket.on('userJoinedRoom', (user, team) => {
            setAllUsers((users) => [...users, user.id])
            dispatchRoomData({ type: 'ADD_USER', user, team })
        })
        return () => { socket.off('userJoinedRoom') }
    }, [])

    useEffect(() => {
        socket.on('userLeftRoom', (userID, team) => {
            setAllUsers((users) => users.filter(id => id !== userID))
            if (team !== null) {
                dispatchRoomData({ type: 'REMOVE_USER', userID, team })
            }
        })
        return () => { socket.off('userLeftRoom') }
    }, [])

    useEffect(() => {
        socket.on('swapTeam', (id, team) => {
            dispatchRoomData({ type: 'SWAP_TEAM', id, team })
        })
        return () => { socket.off('swapTeam') }
    }, [])

    useEffect(() => {
        socket.on('startGame', (status) => {
            socket.removeAllListeners('swapTeam')
            socket.removeAllListeners('gameType')
            socket.removeAllListeners('rounds')
            socket.removeAllListeners('duration')
            socket.removeAllListeners('startGame')
            socket.removeAllListeners('userJoinedRoom')
            socket.removeAllListeners('userLeftRoom')
            props.setGameData({ ...roomData, status, allUsers })
            props.setUser(user => { return { ...user, team } })
        })
        return () => { socket.off('startGame') }
    }, [user, roomData, allUsers])

    useEffect(() => {
        socket.on('gameType', gameType => {
            dispatchRoomData({ type: 'GMAE_TYPE', gameType })
        })
        return () => { socket.off('gameType') }
    }, [])

    useEffect(() => {
        socket.on('rounds', (rounds) => {
            dispatchRoomData({ type: 'ROUNDS', rounds })
        })
        return () => { socket.off('rounds') }
    })

    useEffect(() => {
        socket.on('duration', (duration) => {
            dispatchRoomData({ type: 'DURATION', duration })
        })
        return () => { socket.off('duration') }
    })

    useEffect(() => {
        socket.on('error', error => {
            props.setError(error)
        })
        return () => { socket.off('error') }
    })

    const swapTeamHandler = () => {
        socket.emit('swapTeam', roomData.id, team)
        setTeam(team => team === 'A' ? 'B' : 'A')
    }

    const gameStartHandler = () => {
        if (roomData.team['A'].length < 2 ||  roomData.team['B'].length < 2) return;
        if (!roomData.isRunning) {
            socket.emit('startGame', roomData.id)
        }
        else {
            socket.emit('userJoinedGame', roomData.id, user, team)
        }
    }

    return (
        <RoomContext.Provider value={roomData} >
            <PageDesign>
                <div className={classes.main}>
                    {roomData && <Team name='A' isMyTeam={team === 'A'} className={classes.content} swapTeam={swapTeamHandler} />}
                    <UserSettings gameStartHandler={gameStartHandler} />
                    {roomData && <Team name='B' isMyTeam={team === 'B'} className={classes.content} swapTeam={swapTeamHandler} />}
                </div>
            </PageDesign>
        </RoomContext.Provider>
    )
}

export default RoomInterface
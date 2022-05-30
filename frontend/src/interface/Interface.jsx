import React, { useEffect, useState } from 'react'
import SocketContext from '../context/socket-context'
import UserContext from '../context/user-context'
import GameInterface from './GameInterface/GameInterface'
import RoomInterface from './RoomInterface/RoomInterface'
import Error from '../error/Error'
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:4001';
const socket = socketIOClient(ENDPOINT);

const dataReducer = (roomData, action) => {

    switch (action.type) {
        case 'RESET': {
            return action.roomData
        }
        case 'ADD_USER': {
            const team = { ...roomData.team }
            team[action.team] = [...roomData.team[action.team], action.user]
            return { ...roomData, team }
        }
        case 'REMOVE_USER': {
            const team = { ...roomData.team }
            team[action.team] = roomData.team[action.team].filter(user => user.id !== action.userID)
            return { ...roomData , team}
        }
        case 'SWAP_TEAM': {
            const index = roomData.team[action.team].findIndex(user => user.id === action.id)
            const newTeam = action.team === 'A' ? 'B' : 'A'
            if (index !== -1) {
                roomData.team[newTeam] = [...roomData.team[newTeam], roomData.team[action.team][index]]
                roomData.team[action.team] = roomData.team[action.team].filter(user => user.id !== action.id)
            }
            return { ...roomData }
        }
        case 'GMAE_TYPE': {
            return { ...roomData, game: action.gameType }
        }
        case 'ROUNDS': {
            return { ...roomData, rounds: action.rounds }
        }
        case 'DURATION': {
            return { ...roomData, duration: action.duration }
        }
    }
}

const Interface = (props) => {

    const userData = {
        name: localStorage.getItem('name') || 'Guest',
        avatar: localStorage.getItem('avatar') || 1
    }

    const [error, setError] = useState(undefined)
    const [gameData, setGameData] = useState(undefined)
    const [user, setUser] = useState(userData)

    return (
        <SocketContext.Provider value={socket} >
            <UserContext.Provider value={user} >
                {error ? <Error /> : (
                    gameData ? <GameInterface dataReducer={dataReducer} gameData={gameData} /> : <RoomInterface setUser={setUser} dataReducer={dataReducer} setGameData={setGameData} gameState={props.gameState} roomID={props.roomID} setError={setError} />
                )}
            </UserContext.Provider>
        </SocketContext.Provider>
    )
}

export default Interface
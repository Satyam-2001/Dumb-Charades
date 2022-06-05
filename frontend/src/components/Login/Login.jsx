import React, { useEffect, useState } from 'react'
import Button from '../UI/Button'
import PageDesign from '../Cards/PageDesign'
import TextInput from '../UI/TextInput'
import Avatar from './Avatar'
import { useParams } from 'react-router-dom'

const Login = (props) => {
    const params = useParams()
    const [isValid, setValid] = useState(true)
    const [name, setName] = useState('')
    const roomID = params?.roomID
    const gameState = roomID ? 'Join Room' : 'Create Private Room'

    useEffect(() => {
        const storedName = localStorage.getItem('name')
        if (storedName) {
            setName(storedName)
        }
    }, [])

    const nameChangeHandler = (currentName) => {
        setValid(true)
        setName(currentName)
    }

    const createRoomHandler = () => {
        if (!name) {
            setValid(false)
            return;
        }
        localStorage.setItem('name', name)
        props.join({gameState , roomID})
    }

    return (
        <PageDesign>
            <div className={`login-box ${props.className}`}>
                <Avatar />
                <TextInput name='Name' value={name} onChange={nameChangeHandler} valid={isValid} />
                <Button onClick={createRoomHandler}>{gameState}</Button>
            </div>
        </PageDesign>
    )
}

export default Login
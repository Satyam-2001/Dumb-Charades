import React, { useContext } from 'react'
import Button from '../../../components/UI/Button'
import UserCard from '../../../components/Cards/UserCard'
import classes from './UserSettings.module.css'
import UserContext from '../../../context/user-context'
import RoomContext from '../../../context/room-context'
import LinkCopy from '../../../components/Utility/LinkCopy'
import GameType from './GameType'
import CustomDropdown from './CustomDropdown'

const UserSettings = (props) => {

    const user = useContext(UserContext)
    const roomData = useContext(RoomContext)
    const disabled = user.id !== roomData.admin

    return (
        <div className={classes.setting}>
            <UserCard name={user.name} avatar={user.avatar} />
            <GameType disabled={disabled} />
            <CustomDropdown label='rounds' options={[1, 2, 3, 4, 5]} disabled={disabled} />
            <CustomDropdown label='duration' options={[60, 80, 120, 150, 200]} disabled={disabled} />
            <Button backgroundColor='rgba(200,253,251,0.3)' width='80%' onClick={props.gameStartHandler} disabled={!roomData.isRunning && disabled}>{(roomData.isRunning ? 'Join Game' : 'Start Game')}</Button>
            <LinkCopy className={classes['link-copy']} roomID={roomData.id} />
        </div>
    )
}

export default UserSettings
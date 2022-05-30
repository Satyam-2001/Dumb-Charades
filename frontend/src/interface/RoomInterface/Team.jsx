import React, { useContext } from 'react'
import classes from './Team.module.css'
import UserCard from '../../components/Cards/UserCard'
import Button from '../../components/UI/Button'
import StyledText from '../../components/UI/StyledText'
import RoomContext from '../../context/room-context'

const Team = (props) => {

    const roomData = useContext(RoomContext)
    const teamData = roomData.team[props.name].map(user => {
        return <UserCard key={user.id} name={user.name} avatar={user.avatar} />
    })

    return (
        <div className={`login-box ${props.className}`}>
            <StyledText text={`Team ${props.name}`}/>
            <div className={classes['grid-container']}>
                {teamData}
            </div>
            <Button
                color={props.isMyTeam ? 'red' : 'lawngreen'}
                backgroundColor={props.isMyTeam ? 'rgba(250,100,100,0.35)' : 'rgba(124,252,0,0.35)' }
                width='80%'
                onClick={props.swapTeam}
                >
                {props.isMyTeam ? 'Exit' : 'Join'} {props.name}
            </Button>
        </div>
    )
}

export default Team
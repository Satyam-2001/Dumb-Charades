import React, { useState, useContext, useEffect } from 'react'
import StyledText from '../../../components/UI/StyledText'
import InfoCard from './InfoCard'
import classes from './UserBoard.module.css'
import DataContext from '../../../context/data-context'

const UserBoard = (props) => {

    const objID = 'UserBoard' + props.team
    const gameData = useContext(DataContext)
    const [score, setScore] = useState(gameData.status.score[props.team])

    useEffect(() => {
        props.Connector.litsen(objID, 'score' + props.team, (addOn) => {
            if (addOn) setScore(score => score + addOn)
        })
        return () => { props.Connector.remove(objID, 'score') }
    }, [])

    const board = gameData.team[props.team].map(user => {
        return <InfoCard key={user.id} user={user} stream={props.stream} />
    })

    return (
        <div className={`${props.className} ${classes.board}`} >
            <div className={classes.title}>
                <StyledText text={`Team ${props.team}`} />
                <p className={classes.score}>{score}</p>
            </div>
            <div>
                {board}
            </div>
        </div>
    )
}

export default UserBoard
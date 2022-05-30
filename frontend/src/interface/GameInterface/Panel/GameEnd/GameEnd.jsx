import React, { Fragment } from 'react'
import Button from '../../../../components/UI/Button'
import classes from './GameEnd.module.css'

const TeamScore = (props) => {
    return (
        <div className={classes.scores}>
            <p className={classes['team-name']}>TEAM {props.team}</p>
            <p className={classes['team-score']}>{props.score}</p>
        </div>
    )
}

const GameEnd = (props) => {

    const prefix = props.winner ? '' : '+ '

    return (
        <Fragment>
            {props.winner && <p className={classes.title}>{props.winner}</p>}
            <div className={classes['score-board']}>
                <fieldset>
                    <legend>SCORE BOARD</legend>
                    <TeamScore team='A' score={prefix + String(props.score['A'])} />
                    <TeamScore team='B' score={prefix + String(props.score['B'])} />
                    {props.winner && <Button className={classes['play-again']}>Play Again</Button>}
                </fieldset>
            </div>
        </Fragment>
    )
}

export default GameEnd
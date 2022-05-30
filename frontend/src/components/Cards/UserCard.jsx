import React from 'react'
import classes from './UserCard.module.css'

const UserCard = (props) => {
    return (
        <div className={classes['grid-item']}>
            <img className={classes.avatar} src={require(`../../assets/avatar/${props.avatar}.png`)} alt='avatar'/>
            <p>{props.name}</p>
        </div>
    )
}

export default UserCard
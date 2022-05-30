import React, { useEffect, useState } from 'react'
import classes from './Avatar.module.css'

const numberOfAvatar = 25

const Avatar = (props) => {

    const [imageId, setImage] = useState(1)

    useEffect(() => {
        const avatar = localStorage.getItem('avatar')
        if(avatar){
            setImage(avatar)
        }
    }, [])

    const incrementImage = () => {
        setImage(prevAvatar => {
            const currentAvatar = (prevAvatar+1) % numberOfAvatar || 1;
            localStorage.setItem('avatar',currentAvatar)
            return currentAvatar;
        })
    }

    const decrementImage = () => {
        setImage(prevAvatar => {
            const currentAvatar = (prevAvatar-1) || (numberOfAvatar-1);
            localStorage.setItem('avatar',currentAvatar)
            return currentAvatar;
        })
    }

    return(
        <div className={classes.avatar}>
            <button className={classes['change-avatar']} onClick={decrementImage}>&#60;</button>
            <img src={require(`../../assets/avatar/${imageId}.png`)} alt='avatar' className={classes.image}/>
            <button className={classes['change-avatar']} onClick={incrementImage}>&#62;</button>
        </div>
    )
}

export default Avatar
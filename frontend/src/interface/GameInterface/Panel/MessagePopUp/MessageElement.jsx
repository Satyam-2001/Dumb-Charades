import React, { useEffect } from 'react'
import classes from './MessageElement.module.css'

const MessageElement = ({ data, removeElement }) => {

    useEffect(() => {
        const timeout = setTimeout(() => {removeElement(data.id)},5000)
        return () => {clearTimeout(timeout)}
    }, [])

    return (
        <div className={classes.block}>
            <p className={classes.name}>{data.name}</p>
            <p className={`${classes.msg} ${data.right ? classes.green : classes.red}`}>{data.word}</p>
        </div>
    )
}

export default MessageElement
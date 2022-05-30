import React from 'react'
import classes from './MessageCard.module.css'

const MessageCard = ({ data }) => {

    return (
        <div className={classes['message-div']}>
            <div className={`${classes['message-card']} ${data.isMe && classes.you} ${classes['hide-name']}`}>
                {
                    data.group && data.showName && !data.isMe &&
                    <div className={classes.info}>
                        <p className={classes.name} style={{ color: data.color }}>{data.name}</p>
                    </div>
                }
                <div className={classes.content}>
                    <p className={classes.message}>{data.message}</p>
                    <p className={classes.time}>{data.time}</p>
                </div>
            </div>
        </div>
    )
}

export default MessageCard
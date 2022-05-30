import React from 'react'
import classes from './ChatListItem.module.css'

const ChatListItem = (props) => {

    const userChatClickHandler = () => {
        props.setUserChatOpen(props.info)
    }

    return (
        <div className={classes.item} onClick={userChatClickHandler}>
            <img className='chat-avatar' src={require(`../../../../assets/avatar/${props.info.avatar}.png`)} alt='avatar' />
            <div className={classes['name-box']}>
                <div className={classes.top}>
                    <p className={classes.name}>{props.info.name}</p>
                    <p className={props.unRead ? classes['green-text'] : classes['light-text']}>{props.time}</p>
                </div>
                <div className={classes.top}>
                    <p className={classes['light-text']}>{props.text}</p>
                    {props.unRead ? <p className={classes['unRead']}>{props.unRead}</p> : undefined}
                </div>
            </div>
        </div>
    )
}

export default ChatListItem
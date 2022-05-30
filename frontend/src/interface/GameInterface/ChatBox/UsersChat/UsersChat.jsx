import React from 'react'
import SendMessage from '../Utils/SendMessage'
import classes from './UsersChat.module.css'
import Chats from './Chats'

const UsersChat = (props) => {

    const goBackHandler = () => {
        props.setUserChatOpen(null)
        props.addChat(null)
    }

    return (
        <div className={`chat-box ${classes['user-chat']}`}>
            <div className={`side-heading`}>
                <div className={classes['start-items']}>
                    <button className={`round-button material-icons`} onClick={goBackHandler}>arrow_back</button>
                    <img className='chat-avatar' src={require(`../../../../assets/avatar/${props.info.avatar}.png`)} />
                    <p className={classes.name}>{props.info.name}</p>
                </div>
                <button className={`round-button material-icons`} onClick={props.chatBoxClose}>close</button>
            </div>
            <Chats id={props.info.id} addChat={props.addChat} />
            <SendMessage recieversInfo={props.info} />
        </div>
    )
}

export default UsersChat
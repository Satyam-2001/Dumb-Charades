import React, { Fragment , useState } from 'react'
import './ChatBox.css'
import ChatList from './ChatList/ChatList'
import UsersChat from './UsersChat/UsersChat'

const ChatBox = (props) => {

    const [userChatOpen, setUserChatOpen] = useState(null)

    return (
        <Fragment>
            {
                userChatOpen !== null ?
                    <UsersChat info={userChatOpen} setUserChatOpen={setUserChatOpen} chatBoxClose={props.chatBoxClose} addChat={props.addChat} />
                    : <ChatList setUserChatOpen={setUserChatOpen} chatBoxClose={props.chatBoxClose} addChat={props.addChat} />
            }
        </Fragment>
    )
}

export default ChatBox
import React, { useContext, useEffect, useState } from 'react'
import classes from './ChatList.module.css'
import ChatListItem from './ChatListItem'
import UserContext from '../../../../context/user-context'
import DataContext from '../../../../context/data-context'
import SearchBar from '../Utils/SearchBar'
import SideHeader from '../../Utils/SideHeader'
import { getUnRead, lastMessage } from '../DataBase/database'

const everyone = { avatar: 25, name: 'Everyone', id: 'Everyone', group: true }
const teamGroup = { avatar: 26, name: 'Team', id: 'Team', group: true }

const compare = (a, b) => {
    const message1 = lastMessage(a.id)
    const message2 = lastMessage(b.id)
    if (!message1 && !message2) return 0
    if (!message2) return -1
    if (!message1) return 1
    return message1.timestamp < message2.timestamp ? 1 : -1
}

const createText = (id, userID) => {
    const messageInfo = lastMessage(id)
    if (!messageInfo) return ['', '', 0]
    let text = ''
    if (messageInfo?.group) {
        if (messageInfo?.sendersID === userID) text = 'You: '
        else text = messageInfo.name + ': '
    }
    return [text + messageInfo.message, messageInfo.time, getUnRead(id)]
}
const ChatList = (props) => {

    const user = useContext(UserContext)
    const roomData = useContext(DataContext)
    const { id: userID } = user
    const { team } = roomData
    const completeUserList = [everyone, teamGroup, ...team['A'], ...team['B']].filter((user) => user.id !== userID)
    const [userList, setUserList] = useState([])

    useEffect(() => {
        const manageChat = (messageID) => {
            setUserList((userList) => {
                const index = userList.findIndex(user => user.id === messageID)
                if (index == -1) return userList
                return [userList[index]].concat(userList.filter(user => user.id !== messageID))
            })
            return true
        }
        props.addChat(() => manageChat)
    }, [userList])

    useEffect(() => {
        completeUserList.sort(compare)
        setUserList(completeUserList)
    }, [])

    const filterList = (name) => {
        setUserList(completeUserList.filter(user => user.name.toLowerCase().includes(name.toLowerCase())))
    }

    return (
        <div className={`chat-box ${classes['chat-list']}`}>
            <SideHeader title='CHATS' Close={props.chatBoxClose} />
            <SearchBar filterList={filterList} />
            <div className={classes.list}>
                {
                    userList.map(user => {
                        let [text, time, unRead] = createText(user.id, userID)
                        return <ChatListItem key={`${user.id} ${text} ${unRead}`} info={user} text={text} time={time} unRead={unRead} setUserChatOpen={props.setUserChatOpen} />
                    })
                }
            </div>
        </div>
    )
}

export default ChatList
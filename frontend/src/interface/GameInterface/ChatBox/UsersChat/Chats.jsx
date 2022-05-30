import React, { useContext, useEffect, useRef, useState } from 'react'
import classes from './Chats.module.css'
import MessageCard from '../Utils/MessageCard'
import { getChats, setUnRead } from '../DataBase/database'

const Chats = (props) => {

    const [chats, setChats] = useState(getChats(props.id))
    const scrollRef = useRef()

    useEffect(() => {
        const addMessage = (messageID, messageInfo) => {
            if (messageID === props.id) {
                setChats(prev => [...prev, messageInfo])
                return false
            }
            return true
        }
        props.addChat(() => addMessage)
    }, [])

    useEffect(() => {
        setUnRead(props.id)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, [])

    useEffect(() => {
        if (scrollRef.current.lastElementChild) {
            const newMessageHeight = scrollRef.current.lastElementChild.offsetHeight + 50
            const visibleHeight = scrollRef.current.offsetHeight
            const containerHeight = scrollRef.current.scrollHeight
            const scrollOffSet = scrollRef.current.scrollTop + visibleHeight
            if (containerHeight - newMessageHeight <= scrollOffSet) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            }
        }
    })

    const content = chats.map((data, index) => {
        return (
            <MessageCard key={index} data={data} />
        )
    })

    return (
        <div className={classes.chats} ref={scrollRef}>
            {content}
        </div>
    )
}

export default Chats
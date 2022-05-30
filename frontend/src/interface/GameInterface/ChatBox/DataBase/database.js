const chats = {}

export const getChats = (recieversID) => {
    // if (chats[recieversID]?.messages) {
    //     return chats[recieversID].messages
    // }
    return chats[recieversID]?.messages || []
}

export const addChats = (messageID, messageInfo, unRead) => {
    if (chats[messageID] === undefined) {
        chats[messageID] = {unRead: 0 , messages: []}
    }
    if (messageInfo.group) {
        const length = chats[messageID].messages.length
        messageInfo.showName = length === 0 || chats[messageID].messages[length - 1].sendersID !== messageInfo.sendersID
    }
    if (unRead) chats[messageID].unRead += 1
    chats[messageID].messages.push(messageInfo)
}

export const lastMessage = (messageID) => {
    // if (chats[messageID]?.messages === undefined) return undefined
    // const length = chats[messageID].messages.length
    return chats[messageID]?.messages?.[chats[messageID].messages.length - 1]
}

export const getUnRead = (messageID) => {
    return chats[messageID]?.unRead || 0
}

export const setUnRead = (messageID) => {
    if (chats[messageID]?.unRead)
        chats[messageID].unRead = 0 
}

export default {
    getChats,
    addChats,
    lastMessage,
    getUnRead
}

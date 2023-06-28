//https://dumbcharades-server.herokuapp.com/

const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { createNewRoom, addUser, swapTeam, getRoom, createStatus, setWord, setChooser, setGameType, setRounds, setDuration, removeUser, getStatus, checkWord, otherTeam, timeOut } = require('./utils/users')
const { nanoid } = require('nanoid')

const port = process.env.PORT || 4001;

const app = express();

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
});

const hideWord = (word) => {
    str = ''
    for (let i = 0; i < word.length; i++) {
        if (word[i] === ' ') str += ' '
        else str += '_'
    }
    return str
}

const currentTime = () => {
    const today = new Date()
    const time = ((today.getHours() % 13) + (today.getHours() >= 12 ? 1 : 0)) + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + (today.getHours() >= 12 ? ' pm' : ' am')
    return [time, today]
}

io.on('connection', socket => {
    console.log('hello');
    socket.on('createRoom', (user, callback) => {
        const roomId = nanoid(10)
        const { roomData, color } = createNewRoom(roomId, { id: socket.id, ...user, mic: false })
        socket.join(roomId)
        const data = { user: { id: socket.id, color, ...user, mic: false }, roomData, team: true }
        callback(data)
    })

    socket.on('joinRoom', (roomID, user, callback) => {
        const gameData = addUser(roomID, { id: socket.id, ...user, mic: false })
        if (gameData.error) {
            socket.emit('error', gameData.error)
        }
        else {
            const { roomData, team, color, allUsers } = gameData
            socket.join(roomID)
            const data = { user: { id: socket.id, color, ...user, mic: false }, roomData, team, allUsers }
            callback(data)
            if (!roomData.isRunning) {
                socket.broadcast.to(roomID).emit('userJoinedRoom', data.user, team)
            }
        }
    })

    socket.on('userJoinedGame', (roomID, user, team) => {
        const status = getStatus(roomID)
        socket.emit('startGame', status)
        socket.broadcast.to(roomID).emit('userJoinedGame', user, team)
    })

    socket.on('mic', (roomID, userID, mic) => {
        io.to(roomID).emit('mic' + String(userID), mic)
    })

    socket.on('gameType', (roomID, gameType) => {
        setGameType(roomID, gameType)
        io.to(roomID).emit('gameType', gameType)
    })

    socket.on('rounds', (roomID, round) => {
        setRounds(roomID, parseInt(round))
        io.to(roomID).emit('rounds', round)
    })

    socket.on('duration', (roomID, duration) => {
        setDuration(roomID, duration)
        io.to(roomID).emit('duration', duration)
    })

    socket.on('sending signal', (callerID, signal) => {
        io.to(callerID).emit('receiving signal', socket.id, signal)
    })

    socket.on('returning signal', (callerID, signal) => {
        io.to(callerID).emit('returned signal', socket.id, signal);
    })

    socket.on('video signal', (callerID, signal) => {
        io.to(callerID).emit('video signal', socket.id, signal);
    })

    socket.on('accept video signal', (callerID, signal) => {
        io.to(callerID).emit('video signal accepted', socket.id, signal)
    })

    socket.on('swapTeam', (roomId, team) => {
        swapTeam(roomId, socket.id, team)
        io.to(roomId).emit('swapTeam', socket.id, team)
    })

    socket.on('startGame', (roomId) => {
        const status = createStatus(roomId)
        io.to(roomId).emit('startGame', status)
    })

    socket.on('sendMessage', (recieversID, messageInfo) => {
        const [time, timestamp] = currentTime()
        messageInfo.time = time
        messageInfo.timestamp = timestamp
        messageInfo.sendersID = socket.id
        socket.emit('recieveMessage', recieversID, { ...messageInfo, isMe: true })
        if (!messageInfo.group) return io.to(recieversID).emit('recieveMessage', socket.id, { ...messageInfo })
        if (recieversID === 'Everyone') return socket.broadcast.to(messageInfo.roomID).emit('recieveMessage', 'Everyone', messageInfo)
        const roomData = getRoom(messageInfo.roomID)
        roomData.team[messageInfo.team].forEach(({ id }) => {
            if (socket.id !== id) io.to(id).emit('recieveMessage', 'Team', messageInfo)
        })
    })

    socket.on('canvasSize', (roomId, width, height) => {
        socket.broadcast.to(roomId).emit('canvasSize', width, height)
    })

    socket.on('startDrawing', (roomId, offsetX, offsetY) => {
        socket.broadcast.to(roomId).emit('startDrawing', offsetX, offsetY)
    })

    socket.on('draw', (roomId, offsetX, offsetY) => {
        socket.broadcast.to(roomId).emit('draw', offsetX, offsetY)
    })

    socket.on('finishDrawing', (roomId) => {
        socket.broadcast.to(roomId).emit('finishDrawing')
    })

    socket.on('colorChange', (roomId, color) => {
        socket.broadcast.to(roomId).emit('colorChange', color)
    })

    socket.on('lineWidthChange', (roomId, lineWidth) => {
        socket.broadcast.to(roomId).emit('lineWidthChange', lineWidth)
    })

    socket.on('floodFill', (roomId, newcolor, offsetX, offsetY) => {
        socket.broadcast.to(roomId).emit('floodFill', newcolor, offsetX, offsetY)
    })

    socket.on('clearCanvas', (roomId) => {
        socket.broadcast.to(roomId).emit('clearCanvas')
    })

    socket.on('guessedWord', (roomID, user, word) => {
        const isWordCorrect = checkWord(roomID, word)
        if (isWordCorrect.right) {
            const { scoreAdd } = isWordCorrect
            const { chooser, round, gameEnd } = setChooser(roomID)
            if (gameEnd) io.to(roomID).emit('gameEnd', gameEnd, scoreAdd)
            else io.to(roomID).emit('getChooser', chooser, round, scoreAdd)
        }
        socket.broadcast.to(roomID).emit('recieveGuess', user.name, word, isWordCorrect.right)
        socket.emit('recieveGuess', 'You', word, isWordCorrect.right)
    })

    socket.on('setWord', (roomId, word) => {
        const wordName = word.toUpperCase()
        const roomData = setWord(roomId, wordName)
        const blankWord = hideWord(wordName)
        const team = otherTeam(roomData.status.performingTeam)
        roomData.team[team].forEach(user => {
            io.to(user.id).emit('getWord', true, wordName, roomData.status.performer)
        });
        roomData.team[roomData.status.performingTeam].forEach(user => {
            if (!(roomData.status.performer.id === user.id)) {
                io.to(user.id).emit('getWord', false, blankWord, roomData.status.performer)
            }
        })
        io.to(roomData.status.performer.id).emit('getWord', true, wordName, roomData.status.performer)
    })

    socket.on('timeOut', roomID => {
        const scoreAdd = timeOut(roomID)
        const { chooser, round, gameEnd } = setChooser(roomID)
        if (gameEnd) {
            io.to(roomID).emit('gameEnd', gameEnd, scoreAdd)
        }
        else {
            io.to(roomID).emit('getChooser', chooser, round, scoreAdd)
        }
    })

    socket.on('disconnect', () => {
        const userID = socket.id
        const userInfo = removeUser(userID)
        if (!userInfo) return
        const { roomID, team, onWork, gameEnd } = userInfo
        io.to(roomID).emit('userLeftRoom', userID, team)
        if (gameEnd) return io.to(roomID).emit('gameEnd', gameEnd)
        if (onWork) {
            const { chooser, round, gameEnd } = setChooser(roomID)
            if (gameEnd) io.to(roomID).emit('gameEnd', gameEnd, chooser)
            else io.to(roomID).emit('getChooser', chooser, round, scoreAdd)
        }
    })

})

server.listen(port, () => {
    console.log(`Server is running on ${port}`)
})
const users = []

const colorsArray = [
    'rgb(255,51,0)',
    'rgb(204,0,102)',
    'rgb(102,102,255)',
    'rgb(255,204,0)',
    'rgb(102,255,51)',
    'rgb(255,102,102)',
    'rgb(153,0,153)',
    'rgb(0,102,0)',
    'rgb(255,251,0)',
    'rgb(255,153,102)',
    'rgb(153,0,51)',
    'rgb(51,102,153)',
    'rgb(102,102,51)',
    'rgb(153,102,0)',
    'rgb(153,153,51)',
    'rgb(51,51,204)',
]

const otherTeam = (s) => {
    return s === 'A' ? 'B' : 'A'
}

const gameEnd = (roomIndex) => {
    const score = users[roomIndex].status.score
    let winner = 'GAME TIE'
    if (score['A'] > score['B']) return { score, winner: 'WINNER TEAM A' }
    if (score['A'] < score['B']) return { score, winner: 'WINNER TEAM B' }
    return { score, winner: 'GAME TIE' }
    
}

const filterStatus = (status) => {
    const updatedStatus = { ...status }
    delete updatedStatus.performerCountA
    delete updatedStatus.performerCountB
    delete updatedStatus.chooserCountA
    delete updatedStatus.chooserCountB
    return updatedStatus
}

const createNewRoom = (roomId, userData) => {
    const roomData = {
        id: roomId,
        game: 'DRAWING',
        rounds: 2,
        duration: 120,
        joined: 1,
        isRunning: false,
        admin: userData.id,
        team: {
            'A': [{ ...userData, color: colorsArray[0] }],
            'B': []
        },
        allUsers: [userData.id]
    }
    users.push(roomData)
    return { roomData, color: colorsArray[0] }
}

const getRoom = roomId => {
    const index = users.findIndex(room => room.id === roomId)
    return users[index]
}

const checkWord = (roomId, word = '') => {
    const index = users.findIndex(room => room.id === roomId)
    if (users[index].status.word === word) {
        const currentTime = Math.round(new Date().getTime() / 1000)
        const addOn = 200 + (users[index].status.time - currentTime) * 2
        users[index].status.score[users[index].status.performingTeam] += addOn
        const scoreAdd = {}
        scoreAdd[users[index].status.performingTeam] = addOn
        scoreAdd[otherTeam(users[index].status.performingTeam)] = 0
        return { right: true, scoreAdd }
    }
    return { right: false }
}

const timeOut = (roomID) => {
    const index = users.findIndex(room => room.id === roomID)
    const scoreAdd = {}
    users[index].status.score[users[index].status.performingTeam] += 250
    scoreAdd[users[index].status.performingTeam] = 0
    scoreAdd[otherTeam(users[index].status.performingTeam)] = 250
    return scoreAdd
}

const addUser = (roomId, userData) => {
    const index = users.findIndex(room => room.id === roomId)
    if (index === -1) return { error: 'Room not exist' }
    users[index].allUsers.push(userData.id)
    const color = colorsArray[users[index].joined % colorsArray.length]
    users[index].joined += 1
    const team = users[index].team['A'].length <= users[index].team['B'].length ? 'A' : 'B'
    users[index].team[team].push({ ...userData, color })
    return { roomData: users[index], team, color, allUsers: users[index].allUsers }
}

const swapTeam = (roomId, userId, team) => {
    const index = users.findIndex(room => room.id === roomId)
    const newTeam = otherTeam(team)
    const userIndex = users[index].team[team].findIndex(user => user.id === userId)
    if (userIndex !== -1) {
        users[index].team[newTeam].push(users[index].team[team][userIndex])
        users[index].team[team].splice(userIndex, 1)
    }
}

const getStatus = (roomId) => {
    const index = users.findIndex(room => room.id === roomId)
    return filterStatus(users[index].status)
}

const createStatus = (roomId) => {
    const index = users.findIndex(room => room.id === roomId)
    users[index].isRunning = true
    users[index].status = {
        display: 'choose',
        performingTeam: 'A',
        performer: null,
        chooser: users[index].team['A'][0],
        word: null,
        time: null,
        performerCount: { 'A': -1, 'B': -1 },
        chooserCount: { 'A': 0, 'B': -1 },
        score: { 'A': 0, 'B': 0 },
        currentRound: 1
    }
    return filterStatus(users[index].status)
}

const setWord = (roomId, word) => {
    const index = users.findIndex(room => room.id === roomId)
    const newTeam = otherTeam(users[index].status.performingTeam)
    users[index].status.chooser = null
    users[index].status.performerCount[newTeam] = users[index].status.performerCount[newTeam] + 1 >= users[index].team[newTeam].length ? 0 : users[index].status.performerCount[newTeam] + 1
    users[index].status.performer = users[index].team[newTeam][users[index].status.performerCount[newTeam]]
    users[index].status.word = word
    users[index].status.performingTeam = newTeam
    users[index].status.display = 'perform'
    users[index].status.time = Math.ceil(new Date().getTime() / 1000) + users[index].duration
    return users[index]
}

const setChooser = (roomId) => {
    const index = users.findIndex(room => room.id === roomId)
    users[index].status.performer = null
    const team = users[index].status.performingTeam
    users[index].status.chooserCount[team] = users[index].status.chooserCount[team] + 1 >= users[index].team[team].length ? 0 : users[index].status.chooserCount[team] + 1
    if (team === 'A' && users[index].status.chooserCount[team] === 0) {
        if (parseInt(users[index].status.currentRound) == parseInt(users[index].rounds)) {
            users[index].status.display = 'gameEnd'
            return { gameEnd: gameEnd(index) }
        }
        users[index].status.currentRound += 1
    }
    users[index].status.chooser = users[index].team[team][users[index].status.chooserCount[team]]
    users[index].status.display = 'choose'
    return { chooser: users[index].status.chooser, round:  users[index].status.currentRound }
}

const setGameType = (roomID, gameType) => {
    const index = users.findIndex(room => room.id === roomID)
    users[index].game = gameType
}

const setRounds = (roomID, rounds) => {
    const index = users.findIndex(room => room.id === roomID)
    users[index].rounds = rounds
}

const setDuration = (roomID, duration) => {
    const index = users.findIndex(room => room.id === roomID)
    users[index].duration = duration
}

const removeUser = (userID) => {
    for (const i in users) {

        const index = users[i].allUsers.findIndex(id => id === userID)

        if (index === -1) continue
        if (users[i].allUsers.length === 1) return users.splice(i, 1)

        users[i].allUsers.splice(index, 1)
        const roomID = users[i].id

        for (const team in users[i].team) {
            const teamIndex = users[i].team[team].findIndex(user => user.id === userID)
            if (teamIndex === -1) continue
            users[i].team[team].splice(teamIndex, 1)
            if (!users[i].isRunning) return { roomID, team }
            if (users[i].status.display === 'gameEnd') return { roomID, team }
            if (users[i].team[team].length < 2) {
                users[i].status.display = 'gameEnd'
                return { roomID, team, gameEnd: gameEnd(i) }
            }
            const onWork = (userID === users[i].status?.chooser?.id || userID === users[i].status?.performer?.id)
            if (users[i].status.chooserCount[team] >= teamIndex) users[i].status.chooserCount[team] -= 1
            if (users[i].status.performerCount[team] >= teamIndex) users[i].status.performerCount[team] -= 1
            return { roomID, team, onWork }
        }
    }
}

module.exports = {
    createNewRoom,
    getRoom,
    addUser,
    removeUser,
    swapTeam,
    createStatus,
    setWord,
    setChooser,
    setGameType,
    setRounds,
    setDuration,
    getStatus,
    checkWord,
    timeOut,
    otherTeam
}
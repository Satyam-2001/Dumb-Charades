import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../../../context/user-context'
import SocketContext from '../../../context/socket-context'
import DataContext from '../../../context/data-context'
import classes from './WordInput.module.css'

const WordInput = (props) => {

    const [word, setWord] = useState(props.word)
    const user = useContext(UserContext)
    const socket = useContext(SocketContext)
    const roomData = useContext(DataContext)
    const { id: roomID } = roomData
    const inputRef = useRef()

    const submitHandler = (event) => {

        if (event.key === 'Enter' && word.indexOf('_') === -1) {
            socket.emit('guessedWord', roomID, user, word)
            setWord(props.word)
        }
    }

    const wordChangeHandler = (event) => {

        let guessedWord = event.target.value.toUpperCase()
        const wordLength = guessedWord.indexOf('_')
        let i = 0
        if (guessedWord.length < props.word.length) {
            while (i < guessedWord.length) {
                if (props.word[i] === ' ' && guessedWord[i] !== ' ') {
                    guessedWord = guessedWord.substr(0, i - 1) + '_ ' + guessedWord.substr(i, guessedWord.length - 1)
                    i++;
                }
                i++;
            }
            guessedWord += props.word.substr(guessedWord.length, props.word.length - 1)
        }
        else if (wordLength !== -1) {
            guessedWord = guessedWord.substr(0, wordLength) + props.word.substr(wordLength, props.word.length - 1)
        }
        setWord(guessedWord)
    }

    useEffect(() => {
        const wordLength = word.indexOf('_')
        const inp = inputRef.current
        if (inp.createTextRange) {
            const part = inp.createTextRange();
            part.move("character", wordLength);
            part.select();
        } else if (inp.setSelectionRange) {
            inp.setSelectionRange(wordLength, wordLength);
        }
    }, [word])

    useEffect(() => {
        setWord(props.word)
    }, [])

    return (
        <div className={classes['input-word']}>
            <input autoFocus ref={inputRef} type="text" name="word" className={classes['word']} value={word} onChange={wordChangeHandler} onKeyDown={submitHandler} autoComplete="off" />
        </div>
    )
}

export default WordInput
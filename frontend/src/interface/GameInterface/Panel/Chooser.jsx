import React, { Fragment, useContext, useState } from 'react'
import classes from './Chooser.module.css'
import style from './Style.module.css'
import Button from '../../../components/UI/Button'
import TextInput from '../../../components/UI/TextInput'
import SocketContext from '../../../context/socket-context'
import DataContext from '../../../context/data-context'

const Chooser = ({ isChooser, name }) => {

    const socket = useContext(SocketContext)
    const roomData = useContext(DataContext)
    const [word , setWord] = useState('')

    const wordChangeHandler = (currentWord) => {
        setWord(currentWord.toUpperCase())
    }

    const postWord = () => {
        socket.emit('setWord', roomData.id, word)
    }

    const keyPressHandler = (key) => {
        if (key === 'Enter') {
            postWord()
        }
    }

    return (
        <Fragment>
            {isChooser &&
                <div className={classes['choose-movie']}>
                    <p className={style.text}>Choose a word</p>
                    <TextInput name='Enter a word' valid={true} value={word} onChange={wordChangeHandler} onKeyDown={keyPressHandler} />
                    <Button width='60%' onClick={postWord} backgroundColor='rgba(27,27,27,0.5)'>POST</Button>
                </div>
            }
            {!isChooser &&
                <p className={style.text}>{`${name} is choosing a word...`}</p>
            }
        </Fragment>
    )
}

export default Chooser
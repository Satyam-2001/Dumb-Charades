import React, { useContext, useEffect, useReducer, useState } from 'react'
import classes from './Header.module.css'
import title from '../../../assets/title.gif'
import Timer from '../../../components/Utility/Timer'
import WordInput from './WordInput'
import DataContext from '../../../context/data-context'

const initialWordStatus = {
    isPerforming: false,
    word: '',
    alias: false,
}

const Header = (props) => {

    const objID = 'Header'
    const roomData = useContext(DataContext)
    const [wordStatus, setWordStatus] = useState(initialWordStatus)
    const [timerStatus, setTimerStatus] = useState(null)

    useEffect(() => {
        props.Connector.litsen(objID,'perform', (wordStatus) => {
            setWordStatus(wordStatus)
            if (wordStatus.isPerforming) { setTimerStatus(roomData.duration) }
            else { setTimerStatus(null) }
        })
        return () => {props.Connector.remove(objID,'perform')}
    }, [])

    return (
        <header>
            <div className={classes['start-div']}>
                <img className={classes.title} src={title} alt='DumbCharades' />
            </div>
            <div className={classes['center-div']}>
                {wordStatus.isPerforming ?
                    (
                        wordStatus.alias ?
                            (
                                <div className={classes['word-div']}>
                                    <p className={classes.word}>{wordStatus.word}</p>
                                </div>
                            )
                            : <WordInput word={wordStatus.word} />
                    )
                    : undefined
                }
            </div>
            <div className={classes['end-div']}>
                {timerStatus ? <Timer time={timerStatus} setTimerStatus={setTimerStatus} initiator={wordStatus.initiator} /> : undefined}
            </div>
        </header>
    )
}

export default React.memo(Header)
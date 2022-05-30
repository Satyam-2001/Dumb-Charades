import React, {useState,useContext} from 'react'
import classes from './LinkCopy.module.css'
import RoomContext from '../../context/room-context'
import DataContext from '../../context/data-context'

const LinkCopy = (props) => {

    const [copyIcon , setCopyIcon] = useState(false)
    
    const link = `http://localhost:3000/${props.roomID}`

    const copyLink = (event) => {
        navigator.clipboard.writeText(link);
        setCopyIcon(true)
        const myTimeout = setTimeout(() => {
            setCopyIcon(false)
            clearTimeout(myTimeout)
        }, 800);
    }

    return (
        <div className={`${classes.invite} ${props.className}`}>
            <p className={classes.link}>{link}</p>
            <button className={`${classes['link-button']} material-icons ${copyIcon && classes.copied}`} onClick={copyLink}>{copyIcon ? 'done' : 'content_copy'}</button>
        </div>
    )
}

export default LinkCopy
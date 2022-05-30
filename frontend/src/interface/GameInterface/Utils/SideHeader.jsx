import React from 'react'
import classes from './SideHeader.module.css'

const SideHeader = (props) => {
    return (
        <div className={`side-heading`}>
            <p className={classes.title}>{props.title}</p>
            <button className={`material-icons round-button`} onClick={props.Close}>close</button>
        </div>
    )
}

export default SideHeader
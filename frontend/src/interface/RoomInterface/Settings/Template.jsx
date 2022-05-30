import React from 'react'
import classes from './Template.module.css'

const Template = (props) => {
    return (
        <span className={`${props.className} ${classes['inline-center']} ${props.disabled ? classes.disable : undefined}`}>
            <p className={classes.label}>{props.label} : </p>
            {props.children}
        </span>
    )
}

export default Template
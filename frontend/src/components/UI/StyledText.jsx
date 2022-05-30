import React from 'react'
import classes from './StyledText.module.css'

const StyledText = (props) => {
    return (
        <article className={`${classes.text} ${props.className}`}>
            <h1>{props.text}</h1>
        </article>
    )
}

export default StyledText
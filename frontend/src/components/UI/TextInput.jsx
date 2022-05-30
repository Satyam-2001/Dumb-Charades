import React from 'react'
import classes from './TextInput.module.css'

const TextInput = React.forwardRef((props, ref) => {
    
    const update = (event) => {
        props.onChange(event.target.value)
    }

    const keyPressHandler = (event) => {
        if (props.onKeyDown) {
            props.onKeyDown(event.key)
        }
    }

    return (
        <div className={`${classes['user-box']} ${!props.valid && classes['invalid']}`}>
            <input type="text" name="name" value={props.value} onChange={update} onKeyDown={keyPressHandler} autoComplete="off" required />
            <label>{props.name}</label>
        </div>
    )
})

export default TextInput
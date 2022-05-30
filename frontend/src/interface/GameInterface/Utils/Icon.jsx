import React from 'react'
import classes from './Icon.module.css'

const Icon = (props) => {
    return (
        <i style={{height: props.size || '50px' , width: props.size || '50px'}} className={`material-icons circle ${props.className} ${props.status ? classes['on'] : classes['off']} ${props.hover ? (props.status ? classes['on_hover'] : classes['off_hover']) : undefined }`} >
            {props.status ? props.util : `${props.util}_off`}
        </i>
    )
}

export default Icon
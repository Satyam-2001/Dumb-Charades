import React from 'react'
import classes from './LoginBox.module.css'

const LoginBox = (props) => {
    return(
        <div className={`${classes['login-box']} ${props.className}`}>
            {props.children}
        </div>
    )
}

export default LoginBox
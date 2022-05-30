import React from 'react'
import ReactDOM from 'react-dom'
import classes from './Modal.module.css'

const Backdrop = (props) => {
    return (
        <div className={classes.backdrop}/>
    )
}

const Modal = (props) => {
    return(
        <React.Fragment>
            {ReactDOM.createPortal(<Backdrop />,document.getElementById('backdrop'))}
            {ReactDOM.createPortal(props.children,document.getElementById('overlay'))}
        </React.Fragment>
    )
}

export default Modal
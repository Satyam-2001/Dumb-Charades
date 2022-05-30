import React from 'react'
import PageDesign from '../components/Cards/PageDesign'
import Button from '../components/UI/Button'
import classes from './Error.module.css'

const Error = (props) => {

    const goBackHandler = () => {
        window.location.href = 'http://localhost:3000/'
    }

    return (
        <PageDesign>
            <div className={classes['error-box']}>
                <p className={classes['error-message']}>ROOM NOT EXIST !!</p>
                <Button width='fit-content' onClick={goBackHandler}>Create New Room</Button>
            </div>
        </PageDesign>
    )
}

export default Error
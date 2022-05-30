import React, { Fragment } from 'react'
import CreateVideo from './CreateVideo'
import ShowVideo from './ShowVideo'

const Actor = ({ isPerformer }) => {
    return (
        <Fragment>
            {isPerformer && <CreateVideo />}
            {!isPerformer && <ShowVideo />}
        </Fragment>
    )
}

export default Actor
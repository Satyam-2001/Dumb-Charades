import React, { Fragment } from 'react'
import CreateDrawing from './CreateDrawing'
import ShowDrawing from './ShowDrawing'

const Drawer = ({isPerformer}) => {
    return (
        <Fragment>
            {isPerformer && <CreateDrawing />}
            {!isPerformer && <ShowDrawing />}
        </Fragment>
    )
}

export default Drawer
import React from 'react'
import classes from './PageDesign.module.css'
import title from '../../assets/title.gif'

const PageDesign = (props) => {
    return (
        <div className={classes.page}>
            <div className={classes['title-div']}>
                <img className={classes.title} src={title} alt='DumbCharades' />
            </div>
            <div className={classes.content}>
                {props.children}
            </div>
        </div>
    )
}

export default PageDesign
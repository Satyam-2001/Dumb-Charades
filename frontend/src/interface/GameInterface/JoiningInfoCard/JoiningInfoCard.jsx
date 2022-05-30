import React, { useContext } from 'react'
import LinkCopy from '../../../components/Utility/LinkCopy'
import DataContext from '../../../context/data-context'
import SideHeader from '../Utils/SideHeader'
import classes from './JoiningInfoCard.module.css'

const JoiningInfoCard = (props) => {

    const { id } = useContext(DataContext)
    return (
        <div className={classes.main}>
            <SideHeader title='JOINING INFO' Close={props.joinInfoClose} />
            <LinkCopy roomID={id} className={classes.link} />
        </div>
    )
}

export default JoiningInfoCard
import React from 'react'
import ColorChooser from './ColorChooser'
import classes from './OptionBoard.module.css'

const OptionBoard = (props) => {

    const pencilThickness = [4,8,15,30,50]

    return (
        <div className={classes['painting-option']}>
            <ColorChooser setColor={props.setColor} color={props.color} />
            <div className={classes.options}>
                <img onClick={() => { props.setOption('pencil') }} src={require('../../../../../assets/pencil.png')} className={`${classes.option} ${props.option === 'pencil' && classes.choosed}`} />
                <img onClick={() => { props.setOption('eraser') }} src={require('../../../../../assets/eraser.png')} className={`${classes.option} ${props.option === 'eraser' && classes.choosed}`} />
                <img onClick={() => { props.setOption('paint') }} src={require('../../../../../assets/paint.png')} className={`${classes.option} ${props.option === 'paint' && classes.choosed}`} />
            </div>
            <div className={classes['penicl-thickness']}>
                {pencilThickness.map(thick => {
                    return <span onClick={() => { props.setLineWidth(thick) }} className={`${classes.dot} ${props.lineWidth === thick && classes['dot-selected']}`} style={{ height: `${1.6 * thick}%`}}></span>
                })}
            </div>
            <div className={classes.delete}>
                <img src={require('../../../../../assets/dustbin.png')} onClick={props.clearCanvas} className={classes['dust-bin']} />
            </div>
        </div>
    )
}

export default React.memo(OptionBoard)
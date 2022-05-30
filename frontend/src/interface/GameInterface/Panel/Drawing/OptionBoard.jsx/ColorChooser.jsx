import React from 'react'
import classes from './ColorChooser.module.css'

const colorChoice = [
    'rgb(255,255,255)',
    'rgb(193,193,193)',
    'rgb(239,19,11)',
    'rgb(255,113,0)',
    'rgb(255,228,0)',
    'rgb(0,204,0)',
    'rgb(0,178,255)',
    'rgb(35,31,211)',
    'rgb(163,0,186)',
    'rgb(211,124,170)',
    'rgb(160,82,45)',
    'rgb(0,0,0)',
    'rgb(76,76,76)',
    'rgb(116,11,7)',
    'rgb(194,56,0)',
    'rgb(232,162,0)',
    'rgb(0,85,16)',
    'rgb(0,86,158)',
    'rgb(14,8,101)',
    'rgb(85,0,105)',
    'rgb(167,85,116)',
    'rgb(99,48,13)'
]

const ColorChooser = (props) => {


    return (
        <div className={classes['color-container']}>
            {
                colorChoice.map(color => {
                    return (
                        <div key={color} onClick={() => props.setColor(color)} className={`${classes['color-item-button']} ${props.color === color && classes.selected }`} style={{ backgroundColor: color }} />
                    )
                })
            }
        </div>
    )
}

export default ColorChooser
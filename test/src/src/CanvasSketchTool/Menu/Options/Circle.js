import React from 'react'
import classes from './Circle.module.css'

const Circle = (props) => {

    const onClick = () => {
        props.setProp(props.property)
    }

    return (
        <p
            className={`${classes.circle} ${props.selected ? classes.border : undefined}`}
            onClick = {onClick}
            style={{ width: `${props.size}px`, height: `${props.size}px`, backgroundColor: props.color }}
        ></p>
    )
}

export default Circle
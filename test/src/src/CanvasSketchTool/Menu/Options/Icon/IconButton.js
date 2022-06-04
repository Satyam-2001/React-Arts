import React, { useState } from 'react'
import classes from './IconButton.module.css'
import Icon from '@mdi/react';

const IconButton = (props) => {

    const [show, setShow] = useState(false)
    const isActive = props.name === props.active

    const onClickHandler = () => {
        props.setActive(props.name)
    }

    return (
        <div
            className={classes['menu-option']}
            style={{ backgroundColor: (!isActive ? 'white' : (props.color || 'rgb(60,64,67)')) }}
        >
            <Icon
                path={props.label}
                size={1.2}
                color={isActive ? 'white' : 'rgb(60,64,67)'}
                onMouseMove={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={props.onClick || onClickHandler}
            />
            {show ? <p className={classes.name}>{props.name}</p> : undefined}
            {props.children}
        </div>
    )
}

export default IconButton
import React, { useState } from 'react'
import classes from './Menu.module.css'
import Size from './Options/Size'
import Color from './Options/Color'
import IconButton from './Options/Icon/IconButton'
import { mdiFormatColorFill } from '@mdi/js';
import { mdiPen } from '@mdi/js';
import { mdiEraserVariant } from '@mdi/js';
import { mdiDelete } from '@mdi/js';

const Menu = (props) => {

    const [active, setActive] = useState('Pen')
    const [color, setColor] = useState('rgb(60,64,67)')

    const colorChange = (color) => {
        setColor(color)
        props.dispatchData({ color, option: 'pen' })
    }

    const onChange = (action) => {
        if (action === 'Flood Fill') props.dispatchData({ option: 'paint', color })
        else if (action === 'Clear Frame') {
            props.clearCanvas()
            props.dispatchData({ option: 'pen', color })
            return;
        }
        else if (action === 'Erase') props.dispatchData({ color: 'white', option: 'pen' })
        else props.dispatchData({ option: 'pen', color })
        setActive(action)
    }

    const prop = { active, setActive: onChange }

    return (
        <div className={classes.menu}>
            <IconButton name='Pen' label={mdiPen} {...prop} color={color} />
            <IconButton name='Erase' label={mdiEraserVariant} {...prop} />
            <Size {...prop} color={color} dispatchData={props.dispatchData} />
            <Color {...prop} color={color} setColor={colorChange} />
            <IconButton name='Flood Fill' label={mdiFormatColorFill} {...prop} color={color} />
            <IconButton name='Clear Frame' label={mdiDelete} {...prop} />
        </div>
    )
}

export default Menu
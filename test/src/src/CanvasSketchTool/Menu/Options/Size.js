import React, { useRef, useState } from 'react'
import IconButton from './Icon/IconButton';
import Circle from './Circle';
import classes from './Common.module.css'
import useOutsideClick from './Hooks/useOutsideClick';
import { mdiAdjust } from '@mdi/js';

const Size = (props) => {

    const [show, setShow] = useState(false)
    const [lineWidth, setLineWidth] = useState(4)
    const ref = useRef()
    useOutsideClick(ref,() => setShow(false))

    const setWidth = (value) => {
        setLineWidth(value)
        props.dispatchData({ lineWidth: value })
    }

    const onClick = () => {
        props.setActive('Pen Size')
        setShow(prev => !prev)
    }

    return (
        <IconButton
            name='Pen Size'
            label={mdiAdjust}
            {...props}
            onClick={onClick}
        >
            {show ?
                <div
                    ref = {ref}
                    className={classes['size-menu']}
                >
                    {
                        [4, 6, 8, 10, 15].map(
                            size => <Circle
                                key={size}
                                size={size}
                                property={size}
                                color={props.color}
                                setProp={setWidth}
                                selected={lineWidth === size} />)
                    }
                </div>
                : undefined}
        </IconButton >
    )
}

export default Size
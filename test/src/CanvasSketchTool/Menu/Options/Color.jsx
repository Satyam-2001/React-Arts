import React , {useRef, useState} from 'react'
import IconButton from './Icon/IconButton';
import Circle from './Circle';
import classes from './Color.module.css'
import { mdiPalette } from '@mdi/js';
import useOutsideClick from './Hooks/useOutsideClick';

const colors = ['rgb(60,64,67)','rgb(25,172,192)','rgb(105,158,62)','rgb(243,179,42)','rgb(217,69,62)','rgb(171,71,188)']

const Color = (props) => {

    const [show, setShow] = useState(false)
    const ref = useRef()
    useOutsideClick(ref,() => setShow(false))

    const onClick = () => {
        props.setActive('Pen Color')
        setShow(prev => !prev)
    }

    return (
        <IconButton
            name='Pen Color'
            label={mdiPalette}
            {...props}
            onClick={onClick}
        >
            {show ?
                <div
                    className={classes['size-menu']}
                    ref = {ref}
                >
                    {
                        colors.map(
                            color => <Circle
                                key={color}
                                size={30}
                                color={color}
                                property={color}
                                setProp={props.setColor}
                                selected={color === props.color} />)
                    }
                </div>
                : undefined}
        </IconButton >
    )
}

export default Color
import React, { useReducer, useState } from 'react'
import CanvasSketch from '../CanvasSketch/CanvasSketch'
import classes from './CanvasSketchTool.module.css'
import Menu from './Menu/Menu'

const initialData = {
    color: 'rgb(60,64,67)',
    option: 'pen',
    lineWidth: 4
}

const reducer = (prev, action) => {
    return {...prev, ...action}
}

const CanvasSketchTool = (props) => {

    const [properties, dispatchData] = useReducer(reducer, initialData);
    const [clearCanvas, setClearCanvas] = useState()

    console.log(properties);
    

    return (
        <div className={classes.box} style={{ height: `${props.height}px` }}>
            <Menu dispatchData = {dispatchData} clearCanvas = {clearCanvas} />
            <CanvasSketch
                {...props}
                {...properties}
                lineCap='round'
                getClearCanvas = {setClearCanvas}
            />
        </div>
    )
}

export default CanvasSketchTool
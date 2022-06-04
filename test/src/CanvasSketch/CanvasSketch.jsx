import React, { useEffect, useRef, useState } from 'react'
import classes from './CanvasSketch.module.css'
import floodFill from './FloodFill/floodFill'

const CanvasSketch = (props) => {

    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current

        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        canvas.style.width = `${canvas.width}`;
        canvas.style.height = `${canvas.height}`;

        const context = canvas.getContext("2d");
        context.lineCap = props.lineCap;
        context.strokeStyle = props.color;
        context.lineWidth = props.lineWidth;
        contextRef.current = context;
        console.log(canvas.getBoundingClientRect());
        
    }, [])

    useEffect(() => {
        contextRef.current.lineCap = props.lineCap
    }, [props.lineCap])

    useEffect(() => {
        contextRef.current.strokeStyle = props.color
    }, [props.color])

    useEffect(() => {
        contextRef.current.lineWidth = props.lineWidth
    }, [props.lineWidth])

    useEffect(() => {
        props.getClearCanvas(() => () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d")
            context.fillStyle = "white"
            context.fillRect(0, 0, canvas.width, canvas.height)
        })
    }, [])

    const startDrawing = ({ nativeEvent }) => {

        const { offsetX, offsetY } = nativeEvent;

        if (props.option === 'paint') {
            const canvas = canvasRef.current
            const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height)
            const rgb = props.color.replace(/[^\d,]/g, '').split(',');
            const newcolor = {
                r: parseInt(rgb[0]),
                g: parseInt(rgb[1]),
                b: parseInt(rgb[2]),
                a: 255
            }
            floodFill(imageData, newcolor, offsetX, offsetY)
            contextRef.current.putImageData(imageData, 0, 0)
        }

        else {
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        }

    };

    const startTouchDrawing = ({ touches }) => {

        const { pageX, pageY } = touches[0];
        const {left , top}  = canvasRef.current.getBoundingClientRect()
        contextRef.current.beginPath();
        contextRef.current.moveTo(pageX - left, pageY -top);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {

        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const touchDraw = ({ touches }) => {

        if (!isDrawing) {
            return;
        }
        const {left , top}  = canvasRef.current.getBoundingClientRect()
        const { pageX, pageY } = touches[0];

        contextRef.current.lineTo(pageX - left, pageY - top);
        contextRef.current.stroke();
    }

    return (
        <div className={classes.main} style={{ height: `${props.height}px`, width: `${props.width}px` }} >
            <canvas
                ref={canvasRef}
                className={classes.canvas}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onTouchStart={startTouchDrawing}
                onTouchEnd={finishDrawing}
                onTouchMove={touchDraw}
                onMouseLeave={finishDrawing}
            >
            </canvas>
        </div>
    )

}

export default CanvasSketch
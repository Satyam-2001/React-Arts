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

        const { clientX, clientY } = touches[0];
        contextRef.current.beginPath();
        contextRef.current.moveTo(clientX - window.innerWidth * 0.22, clientY - window.innerHeight * 0.1);
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

        const { clientX, clientY } = touches[0];

        contextRef.current.lineTo(clientX - window.innerWidth * 0.22, clientY - window.innerHeight * 0.1);
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
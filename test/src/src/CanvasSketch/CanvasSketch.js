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
        context.lineCap = props.lineCap || 'round';
        context.strokeStyle = props.color || 'black';
        context.lineWidth = props.lineWidth || 4;
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
        if (props.getClearCanvas) {
            props.getClearCanvas(() => () => {
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d")
                context.fillStyle = "white"
                context.fillRect(0, 0, canvas.width, canvas.height)
            })
        }
    }, [props.getClearCanvas])

    const postionCanvas = (e) => {
        const { left, top } = canvasRef.current.getBoundingClientRect();
        return [
            parseInt((e.pageX || e.touches[0].pageX) - left),
            parseInt((e.pageY || e.touches[0].pageY) - top)
        ];
    }

    const startDrawing = (e) => {

        const position = postionCanvas(e);

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
            floodFill(imageData, newcolor, ...position)
            contextRef.current.putImageData(imageData, 0, 0)
        }

        else {
            contextRef.current.beginPath();
            contextRef.current.moveTo(...position);
            setIsDrawing(true);
        }

    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = (e) => {

        if (!isDrawing) return;
        const position = postionCanvas(e);
        contextRef.current.lineTo(...position);
        contextRef.current.stroke();
    };

    return (
        <div className={classes.main} style={{ height: `${props.height}px`, width: `${props.width}px` }} >
            <canvas
                ref={canvasRef}
                className={classes.canvas}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={finishDrawing}
                onMouseLeave={finishDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={finishDrawing}
            >
            </canvas>
        </div>
    )

}

export default CanvasSketch
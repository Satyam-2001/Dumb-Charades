import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import SocketContext from '../../../../context/socket-context'
import DataContext from '../../../../context/data-context'
import classes from './CreateDrawing.module.css'
import OptionBoard from './OptionBoard.jsx/OptionBoard'
import floodFill from './FloodFill/floodFill'

const CreateDrawing = (props) => {

    const socket = useContext(SocketContext)
    const roomData = useContext(DataContext)
    const roomId = roomData.id;
    const [isDrawing, setIsDrawing] = useState(false);
    const [option, setOption] = useState('pencil');
    const [color, setColor] = useState('rgb(0,0,0)')
    const [lineWidth, setLineWidth] = useState(4)
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current

        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        canvas.style.width = `${canvas.width}`;
        canvas.style.height = `${canvas.height}`;
        socket.emit('canvasSize', roomId, canvas.width, canvas.height)

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        contextRef.current = context;
    }, [])

    useEffect(() => {
        window.addEventListener('resize', () => {
            const canvas = canvasRef.current

            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;

            // canvas.style.width = `${canvas.width}`;
            // canvas.style.height = `${canvas.height}`;
            socket.emit('canvasSize', roomId, canvas.width, canvas.height)
        })
    }, [])

    useEffect(() => {
        if (option === 'eraser') {
            contextRef.current.strokeStyle = 'rgb(255,255,255)'
            socket.emit('colorChange', roomId, 'rgb(255,255,255)')
        }
        else {
            contextRef.current.strokeStyle = color
            socket.emit('colorChange', roomId, color)
        }
    }, [option, color])

    useEffect(() => {
        contextRef.current.lineWidth = lineWidth
        socket.emit('lineWidthChange', roomId, lineWidth)
    }, [lineWidth])

    const startDrawing = ({ nativeEvent }) => {

        const { offsetX, offsetY } = nativeEvent;

        if (option === 'paint') {
            const canvas = canvasRef.current
            const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height)
            const rgb = color.replace(/[^\d,]/g, '').split(',');
            const newcolor = {
                r: parseInt(rgb[0]),
                g: parseInt(rgb[1]),
                b: parseInt(rgb[2]),
                a: 255
            }
            floodFill(imageData, newcolor, offsetX, offsetY)
            socket.emit('floodFill', roomId, newcolor, offsetX, offsetY)
            contextRef.current.putImageData(imageData, 0, 0)
        }

        else {
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            setIsDrawing(true);
            socket.emit('startDrawing', roomId, offsetX, offsetY)
        }

    };

    const startTouchDrawing = ({ touches }) => {

        const { clientX, clientY } = touches[0];
        contextRef.current.beginPath();
        contextRef.current.moveTo(clientX - window.innerWidth * 0.22, clientY - window.innerHeight * 0.1);
        setIsDrawing(true);
        socket.emit('startDrawing', roomId, clientX - window.innerWidth * 0.22, clientY - window.innerHeight * 0.1)
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        socket.emit('finishDrawing', roomId)
    };

    const draw = ({ nativeEvent }) => {

        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        socket.emit('draw', roomId, offsetX, offsetY)
    };

    const touchDraw = ({ touches }) => {

        if (!isDrawing) {
            return;
        }

        const { clientX, clientY } = touches[0];

        contextRef.current.lineTo(clientX - window.innerWidth * 0.22, clientY - window.innerHeight * 0.1);
        contextRef.current.stroke();
        socket.emit('draw', roomId, clientX - window.innerWidth * 0.22, clientY - window.innerHeight * 0.1)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d")
        context.fillStyle = "white"
        context.fillRect(0, 0, canvas.width, canvas.height)
        socket.emit('clearCanvas', roomId)
    }

    return (
        <div className={classes.main} >
            <OptionBoard setColor={setColor} color={color} setLineWidth={setLineWidth} clearCanvas={clearCanvas} setOption={setOption} option={option} lineWidth={lineWidth} />
            <canvas
                ref={canvasRef}
                className={classes.canvas}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onTouchStart={startTouchDrawing}
                onTouchEnd={finishDrawing}
                onTouchMove={touchDraw}
            >
            </canvas>
        </div>
    )

}

export default CreateDrawing
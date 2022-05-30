import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import classes from './ShowDrawing.module.css'
import SocketContext from '../../../../context/socket-context'
import floodFill from './FloodFill/floodFill'

const ShowDrawing = (props) => {

    const socket = useContext(SocketContext)
    const [sizeRatio, setSizeRatio] = useState({ width: 1, height: 1 })
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        canvas.style.width = `${canvas.width}px`;
        canvas.style.height = `${canvas.height}px`;

        const context = canvas.getContext("2d")
        context.lineCap = "round";
        context.strokeStyle = 'black';
        context.lineWidth = 4;
        contextRef.current = context;

    }, [])

    useEffect(() => {
        socket.on('canvasSize', (widthClient, heightClient) => {
            const canvas = canvasRef.current
            // canvas.getContext('2D').lineWidth = 5 * (canvas.width / widthClient) * 2
            // contextRef.current.lineWidth = contextRef.current.lineWidth * (canvas.width / widthClient)
            // console.log(contextRef.current.lineWidth);
            setSizeRatio({ width: (canvas.width / widthClient), height: (canvas.height / heightClient) })
        })
        return () => { socket.off('canvasSize') }
    }, [])

    useEffect(() => {
        socket.on('startDrawing', startDrawing)
        return () => { socket.off('startDrawing') }
    }, [])

    useEffect(() => {
        socket.on('finishDrawing', finishDrawing)
        return () => { socket.off('finishDrawing') }
    }, [])

    useEffect(() => {
        socket.on('draw', draw)
        return () => { socket.off('draw') }
    }, [])

    useEffect(() => {
        socket.on('colorChange', (color) => {
            contextRef.current.strokeStyle = color
        })
        return () => { socket.off('colorChange') }
    }, [])

    useEffect(() => {
        socket.on('lineWidthChange', (lineWidth) => {
            contextRef.current.lineWidth = lineWidth
        })
        return () => { socket.off('lineWidthChange') }
    }, [])

    useEffect(() => {
        socket.on('clearCanvas', clearCanvas)
        return () => { socket.off('clearCanvas') }
    }, [])

    useEffect(() => {
        socket.on('floodFill', fill)
        return () => { socket.off('floodFill') }
    }, [])

    const fill = (newcolor, x, y) => {
        const canvas = canvasRef.current
        const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height)
        floodFill(imageData, newcolor, x, y)
        contextRef.current.putImageData(imageData, 0, 0)
    }

    const startDrawing = useCallback((offsetX, offsetY) => {
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX * sizeRatio.width, offsetY * sizeRatio.height);
    }, [])

    const finishDrawing = useCallback(() => {
        contextRef.current.closePath();
    }, [])

    const draw = useCallback((offsetX, offsetY) => {
        contextRef.current.lineTo(offsetX * sizeRatio.width, offsetY * sizeRatio.height);
        contextRef.current.stroke();
    }, [])

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d")
        context.fillStyle = "white"
        context.fillRect(0, 0, canvas.width, canvas.height)
    }
    return (
        <canvas
            ref={canvasRef}
            className={classes.canvas}
        />
    )
}

export default ShowDrawing
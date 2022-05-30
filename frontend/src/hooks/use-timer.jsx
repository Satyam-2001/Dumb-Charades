import { useEffect, useState } from "react";

const useTimer = (time, onExpire) => {
    const [currentTime, setCurrentTime] = useState(time)

    useEffect(() => {
        const timerVar = setInterval(() => {
            setCurrentTime(currentTime => currentTime - 1)
        }, 1000)
        return () => { clearInterval(timerVar) }
    }, [])

    useEffect(() => {
        if (currentTime <= 0) {
            onExpire()
        }
    }, [currentTime])

    return [
        currentTime,
        setCurrentTime
    ]
}

export default useTimer
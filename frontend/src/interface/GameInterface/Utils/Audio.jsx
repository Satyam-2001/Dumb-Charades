import React, { useEffect, useRef } from "react";

const Audio = (props) => {
    
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <audio playsInline autoPlay ref={ref} />
    );
}

export default Audio
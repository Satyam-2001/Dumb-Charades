import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`

    background-color: ${props => props.backgroundColor ? props.backgroundColor : 'transparent'};
    box-shadow: 0 6px 6px rgba(0, 0, 0, 0.6);
    border-color: rgba(0, 0, 0, 0);
    position: relative;
    display: block;
    padding: 10px 20px;
    margin-left: auto;
    margin-right: auto;
    width: ${props => props.width ? props.width : '100%'};
    color: ${props => props.color ? props.color : '#03e9f4'};
    font-size: 16px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: .5s;
    margin-top: 30px;
    letter-spacing: 4px;
    cursor: ${props => props.disabled ? 'no-drop' : 'pointer'};


&:hover {
    background: ${props => props.color ? props.color : '#03e9f4'};
    color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px ${props => props.color ? props.color : '#03e9f4'},
        0 0 25px ${props => props.color ? props.color : '#03e9f4'},
        0 0 50px ${props => props.color ? props.color : '#03e9f4'},
        0 0 100px ${props => props.color ? props.color : '#03e9f4'};
}

& span {
    position: absolute;
    display: block;
}

& span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${props => props.color ? props.color : '#03e9f4'});
    animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
    0% {
        left: -100%;
    }

    50%, 100% {
        left: 100%;
    }
}

& span:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, ${props => props.color ? props.color : '#03e9f4'});
    animation: btn-anim2 1s linear infinite;
    animation-delay: .25s
}

@keyframes btn-anim2 {
    0% {
        top: -100%;
    }

    50%, 100% {
        top: 100%;
    }
}

& span:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, ${props => props.color ? props.color : '#03e9f4'});
    animation: btn-anim3 1s linear infinite;
    animation-delay: .5s
}

@keyframes btn-anim3 {
    0% {
        right: -100%;
    }

    50%, 100% {
        right: 100%;
    }
}

& span:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, ${props => props.color ? props.color : '#03e9f4'});
    animation: btn-anim4 1s linear infinite;
    animation-delay: .75s
}

@keyframes btn-anim4 {
    0% {
        bottom: -100%;
    }

    50%, 100% {
        bottom: 100%;
    }
}


@media only screen and (max-width: 600px) {
    &{
        font-size: 12px;
    }
}
`

const Button = (props) => {
    return (
        <StyledButton onClick={props.onClick} className={props.className} backgroundColor={props.backgroundColor} color={props.color} width={props.width} disabled={props.disabled}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {props.children}
        </StyledButton>
    )
}

export default Button
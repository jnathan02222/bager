"use client"

import Guesses from "./guesses";
import Scoreboard from "./scoreboard";
import Camera from "../setup/camera";
import Canvas from "./canvas";
import { useEffect, useState } from "react"

export default function Game(){
    //Timer
    const [time, setTime] = useState(120);
    useEffect(() => {
        const timer = setInterval(()=> {
            setTime(time - 1);
        }, 1000);
        if (time === 0) {
            return clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [time]);

    //Copy Button
    const [buttonText, setButtonText] = useState('Invite the Homies')
    const copyURL = () => {
        navigator.clipboard.writeText(window.location.href)
        setButtonText('Copied!')
        setTimeout(() => {
            setButtonText('Copy to Clipboard')
        }, 1000);
    }

    return (
        <div className="w-full h-screen flex justify-content items-center p-24">
            <div className="w-1/4 p-5 mx-8">
                <h1 className='text-2xl mb-10'>Points</h1>
                <Scoreboard></Scoreboard>
                <div>
                    <Camera startCamera={true}></Camera>
                </div>
            </div> 
            <div className="p-10 pt-0 w-1/2 h-full flex flex-col items-center">
                <Canvas></Canvas>
                <div className='text-center'>{time}</div>
            </div> 
            <div className="w-1/4 h-full flex flex-col items-center">
                <Guesses></Guesses>
                <button className='w-48 text-center p-2 border-4 border-black rounded-lg mt-5 bg-green-200' onClick={()=>copyURL()}>{buttonText}</button>
            </div> 
        </div>
    );
}
"use client"
import { useState } from "react"
import Camera from "./camera"
import Link from "next/link"

export default function SetUpPage(){

    //Avatar
    const [avatar, setAvatar] = useState(0)

    const changeAvatar = (iteration, curAvatar) => {
        let newAvatar = curAvatar + iteration;
        if (newAvatar > 9) {
            newAvatar = 0;
        } else if (newAvatar < 0) {
            newAvatar = 9;
        }
        setAvatar(newAvatar);
    }

    //Settings
    const names = {
        players: "Player",
        time: "Time",
        rounds: "Rounds",
        hints: "Hints"
    }
    const range = {
        players: [2, 8],
        time: [30, 180],
        rounds: [1, 10],
        hints: [0, 3]
    }
    const iterations = {
        players: 1,
        time: 30,
        rounds: 1,
        hints: 1,
    }
    const [settings, setSettings] = useState({
        players: 2,
        time: 60,
        rounds: 3,
        hints: 1
    })
    const changeSettings = (iteration, property) => {
        var newSettings = {
            players: settings.players,
            time: settings.time,
            rounds: settings.rounds,
            hints: settings.hints
        }
        console.log("Property: " + property)
        console.log(range[property])
        if (newSettings[property] + iteration > range[property][1] || newSettings[property] + iteration < range[property][0]) {
            return
        }
        newSettings[property] += iteration
        setSettings(newSettings)
    }
    const getSettingWidgets = () => {
        var widgets = []
        let index = 0
        for (const property in iterations){
            widgets.push(
                <div key={index}>
                    <div className="flex justify-center mt-5 items-center">
                        <h1 className='text-xl self-center w-40'>{names[property]}</h1>
                        <div className="flex justify-between w-40">
                            <img className="w-5 h-5 mt-1 hover:cursor-pointer" src='/left.png' onClick={(e)=>{changeSettings(-iterations[property], property)}}></img>
                            <h1 className='text-lg self-center text-center'>{settings[property]}</h1>
                            <img className="w-5 h-5 mt-1 hover:cursor-pointer" src='/right.png' onClick={(e)=>{changeSettings(iterations[property], property)}}></img>
                        </div>
                    </div>
                </div>
            )
            index++
        }
        return widgets
    }
    
    const [popup, setPopup] = useState(false)
    const [buttonText, setButtonText] = useState('Copy invite link')
    const copyURL = () => {
        navigator.clipboard.writeText(window.location.href)
        setButtonText('Copied!')
        setTimeout(() => {
            setButtonText('Copy to Clipboard')
        }, 1000);
    }
    
    return (
        <div className="relative">
            <button className='text-3xl font-bold absolute p-5' onClick={()=>{setPopup(true)}}>?</button>
            {popup && 
                <div className="absolute w-full h-full bg-white z-50 flex justify-center items-center" onClick={()=>{setPopup(false)}}>
                    <h1 className='text-center'>Click anywhere to return to setup.</h1>
                </div>
            }
            <div className='w-full h-screen flex justify-center p-24'>
                <div className='flex flex-col items-center'>
                    <Camera></Camera>
                    <div className='w-full rounded-3xl flex justify-center items-center'>
                        <img className="hover:cursor-pointer w-16 h-16 m-10" src='/left.png' onClick={(e)=>changeAvatar(-1, avatar)}></img>
                        <img className='' src={'/avatar' + avatar + '.png'} alt={avatar}></img>
                        <img className="hover:cursor-pointer w-16 h-16 m-10" src='/right.png' onClick={(e)=>changeAvatar(1, avatar)}></img>
                    </div>
                    <div className='flex'>
                        <button className='w-48 text-center p-2 border-4 border-black rounded-lg mr-10 bg-green-200' onClick={()=>copyURL()}>{buttonText}</button>
                        <Link className='w-48 text-center p-2 border-4 border-black rounded-lg bg-blue-200' href={'/game/'}>Start Game</Link>
                    </div>
                </div>
                <div className="flex flex-col h-full">
                    <div className='w-80 pb-5 px-5 ml-5 mb-5 rounded-3xl border-4 border-black'>
                        <h1 className='mb-2 text-xl pt-5'>Settings</h1>
                        {getSettingWidgets()}
                    </div>
                    <div className='ml-5 pb-3 border-4 border-black rounded-3xl h-full'>
                        <h1 className='ml-5 text-xl py-5 '>Players</h1>
                        <div>
                            <div className="flex items-center pb-2">
                                <div className="bg-black w-10 h-10  rounded-full ml-5"></div>
                                <div className='text-xl ml-4'>Baging with Bager</div>
                            </div>
                            <div className="flex items-center pb-2">
                                <div className="bg-black w-10 h-10  rounded-full ml-5"></div>
                                <div className='text-xl ml-4'>Pedo</div>
                            </div>
                            <div className="flex items-center pb-2">
                                <div className="bg-black w-10 h-10   rounded-full ml-5"></div>
                                <div className='text-xl ml-4'>Meme Man</div>
                            </div>
                            <div className="flex items-center pb-2">
                                <div className="bg-black w-10 h-10   rounded-full ml-5"></div>
                                <div className='text-xl ml-4'>Willy Wigger</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
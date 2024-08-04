"use client"
import Link from "next/link"
import { useState } from "react"

export default function SetUpPage(){
    const [players, setPlayers] = useState(2)
    const [time, setTime] = useState(60)
    const [rounds, setRounds] = useState(3)
    const [hints, setHints] = useState(1)
    const [avatar, setAvatar] = useState(0)

    const playersIncrease = () => {
        if(players < 8){
            setPlayers(players+1)
        }
    }
    const playersDecrease = () => {
        if(players > 2){
            setPlayers(players-1)
        }
    }
    const timeIncrease = () => {
        if(time < 180){
            setTime(time+30)
        }
    }
    const timeDecrease = () => {
        if(time>30){
            setTime(time-30)
        }
    }
    const roundsIncrease = () => {
        if(rounds < 10){
            setRounds(rounds+1)
        }
    }
    const roundsDecrease = () => {
        if(rounds > 1){
            setRounds(rounds-1)
        }
    }
    const hintsIncrease = () => {
        if(hints < 3){
            setHints(hints+1)
        }
    }
    const hintsDecrease = () => {
        if(hints > 0){
            setHints(hints-1)
        }
    }
    const avatarUp = () => {
        if(avatar == 8){
            setAvatar(0)
        } else {    
            setAvatar(avatar+1)
        }
    }
    const avatarDown = () => {
        if(avatar == 0){
            setAvatar(8)
        } else {
            setAvatar(avatar-1)
        }
    }

    return (
        <div className='w-full min-h-screen grid grid-cols-7'>
            <div className='col-start-1 col-span-4'>
                <div className='w-full h-3/5 m-6 mb-5 mt-10 border-4 border-black rounded-3xl self-center bg-green-100'>
                <h1 className='text-3xl font-bold row-start-1 col-span-3 text-center mt-5'>Camera</h1>
                </div>
                <div className='w-full h-1/3 p-3 ml-6 rounded-3xl bg-gray-200 grid grid-cols-3 grid-rows-3'>
                    <h1 className='text-3xl font-bold row-start-1 col-span-3 text-center mt-5'>Avatar</h1>
                    <button className='bg-red-200 p-2 border-2 border-black' onClick={avatarDown}></button>
                    <h1 className='players text-lg font-bold self-center text-center'>{avatar}</h1>
                    <button className='bg-green-200 p-2 border-2 border-black' onClick={avatarUp}></button>
                </div>
            </div>

            <div className='col-start-5 col-span-3'>
                <div className='h-1/3 p-5 m-10 mb-5 rounded-3xl bg-gray-200 grid grid-cols-4 grid-rows-5'>
                    <h1 className='text-3xl font-bold row-start-1 col-span-4 text-center'>Settings</h1>
                    <h1 className='text-xl font-bold col-start-1 self-center text-center'>Players</h1>
                    <button className='bg-red-200 p-2 border-2 border-black border-b-0' onClick={playersDecrease}></button>
                    <h1 className='players text-lg font-bold self-center text-center'>{players}</h1>
                    <button className='bg-green-200 p-2 border-2 border-black border-b-0' onClick={playersIncrease}></button>
                    <h1 className='text-xl font-bold col-start-1 self-center text-center'>Time</h1>
                    <button className='bg-red-200 p-2 border-2 border-black border-b-0' onClick={timeDecrease}></button>
                    <h1 className='time text-lg font-bold self-center text-center'>{time}</h1>
                    <button className='bg-green-200 p-2 border-2 border-black border-b-0' onClick={timeIncrease}></button>
                    <h1 className='text-xl font-bold col-start-1 self-center text-center'>Rounds</h1>
                    <button className='bg-red-200 p-2 border-2 border-black border-b-0' onClick={roundsDecrease}></button>
                    <h1 className='rounds text-lg font-bold self-center text-center'>{rounds}</h1>
                    <button className='bg-green-200 p-2 border-2 border-black border-b-0' onClick={roundsIncrease}></button>
                    <h1 className='text-xl font-bold col-start-1 self-center text-center'>Hints</h1>
                    <button className='bg-red-200 p-2 border-2 border-black ' onClick={hintsDecrease}></button>
                    <h1 className='hints text-lg font-bold self-center text-center'>{hints}</h1>
                    <button className='bg-green-200 p-2 border-2 border-black' onClick={hintsIncrease}></button>
                </div>
                <div className='mx-10 pb-3 rounded-3xl bg-gray-200'>
                    <h1 className='text-3xl font-bold m-5 pt-5 text-center'>Players</h1>
                    <div className='grid grid-rows-8 grid-col-2'>
                        <input className='p-2 border-2 mx-16 m-2 border-black rounded-md focus:outline-none col-start-1' placeholder='Player 1'></input>
                        <img className='col-start-2 h-10 w-10' src={'/background.png'} alt='filler'></img>
                        <input className='p-2 border-2 mx-16 m-2 border-black rounded-md focus:outline-none col-start-1' placeholder='Player 2'></input>
                        <img className='col-start-2 h-10 w-10' src={'/background.png'} alt='filler'></img>
                        <input className='p-2 border-2 mx-16 m-2 border-black rounded-md focus:outline-none col-start-1' placeholder='Player 3'></input>
                        <img className='col-start-2 h-10 w-10' src={'/background.png'} alt='filler'></img>
                        <input className='p-2 border-2 mx-16 m-2 border-black rounded-md focus:outline-none col-start-1' placeholder='Player 4'></input>
                        <img className='col-start-2 h-10 w-10' src={'/background.png'} alt='filler'></img>
                        <input className='p-2 border-2 mx-16 m-2 border-black rounded-md focus:outline-none col-start-1' placeholder='Player 5'></input>
                        <img className='col-start-2 h-10 w-10' src={'/background.png'} alt='filler'></img>
                        <input className='p-2 border-2 mx-16 m-2 border-black rounded-md focus:outline-none col-start-1' placeholder='Player 6'></input>
                        <img className='col-start-2 h-10 w-10' src={'/background.png'} alt='filler'></img>
                        <input className='p-2 border-2 mx-16 m-2 border-black rounded-md focus:outline-none col-start-1' placeholder='Player 7'></input>
                        <img className='col-start-2 h-10 w-10' src={'/background.png'} alt='filler'></img>
                        <input className='p-2 border-2 mx-16 m-2 border-black rounded-md focus:outline-none col-start-1' placeholder='Player 8'></input>
                        <img className='col-start-2 h-10 w-10' src={'/background.png'} alt='filler'></img>
                    </div>
                </div>
            </div>
        </div>
    )
}
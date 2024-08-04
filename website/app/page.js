"use client"
import Link from "next/link"
import { useState } from "react"

export default function JoinRoom() {
  const [roomId, setRoomId] = useState('')
  const inputHandler = (e) => {
    setRoomId(e.target.value)
  }
  return (<div className="w-full min-h-screen flex justify-center items-center bg-[url('/background.png')] bg-repeat" >
      <div className='flex flex-col p-10 m-5 border-black border-5 rounded-3xl bg-gray-200'>
        <h1 className='text-3xl font-bold mb-5 text-center'>NO PAME NO GAME</h1>
        <input className='w-96 p-2 border-2 border-black border-b-0 rounded-t-md focus:outline-none' placeholder='Room ID' value={roomId} onChange={inputHandler}></input>
        <Link className='w-96 text-center p-2 border-2 border-black rounded-b-md' href={'/game/'+roomId}>Join Room</Link>
        <Link className='w-96 text-center mt-7 p-2 border-2 border-black rounded-md' href='/setup'>Create Room</Link>
      </div>
  </div>)
}
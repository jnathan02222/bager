"use client"
import Link from "next/link"
import { useState } from "react"

export default function JoinRoom() {
  const [roomId, setRoomId] = useState('')
  const inputHandler = (e) => {
    setRoomId(e.target.value)
  }
  return (<div className="w-full min-h-screen flex justify-center items-center bg-[url('/background.png')] bg-repeat" >
      <div className='flex flex-col items-center p-10 m-5 border-black border-4 rounded-3xl bg-white'>
        <h1 className='text-5xl font-bold mb-5 text-center'>FLOPPY FINGERS</h1>
        <input className='w-96 p-2 border-4 border-black border-b-0 rounded-t-md focus:outline-none' placeholder='Room ID' value={roomId} onChange={inputHandler}></input>
        <Link className='w-96 text-center p-2 border-4 border-black rounded-b-md' href={'/game/'+roomId}>Join Room</Link>
        <Link className='w-96 text-center mt-7 p-2 border-4 border-black rounded-md' href='/setup'>Create Room</Link>
      </div>
  </div>)
}
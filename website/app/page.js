"use client"
import Link from "next/link"
import { useState } from "react"

export default function JoinRoom() {
  const [roomId, setRoomId] = useState('')
  const inputHandler = (e) => {
    setRoomId(e.target.value)
  }
  return (
    <div>
      <div className="w-full min-h-screen flex justify-center items-center " >
          <div className='flex flex-col items-center p-10 m-5 border-black border-4 rounded-3xl bg-white'>
            <div className="flex justify-center w-full">
              <div className='text-5xl font-bold mb-5'>
                <h1 >FLOPPY</h1>
                <h1 >FINGERS</h1>
              </div>
              <img style={{width: 100, height: 100}} src="/logo.png"></img>

            </div>
            <input className='w-96 p-2 border-4 border-black border-b-0 rounded-t-md focus:outline-none' placeholder='Room ID' value={roomId} onChange={inputHandler}></input>
            <Link className='w-96 text-center p-2 border-4 border-black rounded-b-md text-black' href={'/game/'+roomId}>Join Room</Link>
            <Link className='w-96 text-center mt-7 p-2 border-4 border-black rounded-md text-black' href='/setup'>Create Room</Link>
          </div>
      </div>
      <div className="w-full min-h-screen absolute bg-[url('/background.png')] bg-repeat opacity-30 top-0	-z-10" ></div>
    </div>
  )
}
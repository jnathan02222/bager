import { useState, useRef, useEffect } from "react"

export default function Guesses({playerName, listOfGuesses, setListOfGuesses, guess, setGuess, gameState}){

    const [text, setText] = useState("");
    const name = useRef('');

    const messagesRef = useRef(undefined);
    
    useEffect(()=>{
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [listOfGuesses]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(text === ""){
            return;
        }

        if(gameState === 1){
            setGuess({name : playerName === "" ? "Player" : playerName, message : text});
        }
            
        setText("");
    }

    return (
        <div className='w-full aspect-[9/16] border-black  mt-10 border-4 rounded-md flex flex-col justify-between overflow-y-hidden'>
            <ul ref={messagesRef} className='overflow-auto p-2'>
                {listOfGuesses.map((guess, index) => <li key={index}>
                    <div className="flex gap-0.5">
                        <div className="text-gray-400">{guess.name + ":"}</div>
                        <div>{guess.message}</div>
                    </div>
                </li>)}
            </ul>
            <form onSubmit={handleSubmit}>
                <input className='w-full border-gray-100 border-t-4 h-10 p-2 focus:outline-none' placeholder='Make a guess!' value={text} onChange={(e)=>{setText(e.target.value)}}></input>
            </form>
        </div>
    );
}
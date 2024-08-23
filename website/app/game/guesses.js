import { useState } from "react"

export default function Guesses(){
    const [guessing, setGuesses] = useState(false);

    const [listOfGuesses, setListOfGuesses] = useState([]);
    const [guess, setGuess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setGuess("");
    }

    return (
        <div className='w-full aspect-[9/16] border-black  mt-10 border-4 rounded-md flex flex-col justify-between  '>
            <ul className='overflow-auto'>
                {listOfGuesses.map((guess, index) => <li key={index}>{guess}</li>)}
            </ul>
            <form onSubmit={handleSubmit}>
                <input className='w-full border-gray-100 border-t-4 h-10 p-2 focus:outline-none' placeholder='Make a guess!' value={guess} onChange={(e)=>{setGuess(e.target.value)}}></input>
            </form>
        </div>
    );
}
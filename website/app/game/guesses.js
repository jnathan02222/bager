import { useState } from "react"

export default function Guesses(){
    const [guessing, setGuesses] = useState(false);

    return (
        <div className='w-full aspect-[9/16] border-black p-10 mt-10 border-4 rounded-md'></div>
    );
}
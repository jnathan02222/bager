"use client"

import Guesses from "./guesses";
import Scoreboard from "./scoreboard";
import Camera from "./camera";
import Canvas from "./gameCanvas";
import { useEffect, useState, useRef } from "react"

export default function Game({gameState, isDrawing, setIsDrawing, listOfPlayers, settings, setGameState, word, setWord, canvasData, setCanvasData, listOfGuesses, setListOfGuesses, guess, setGuess, playerName, setTally, tally }){

    const CHOOSE_WORD = 0;
    const DRAW_AND_GUESS = 1;
    const TALLY_SCORE = 2;

    //Timer
    const [time, setTime] = useState(settings.time);
    const [words, setWords] = useState([]);
    const prevIsDrawing = useRef(undefined);
    const allowDrawing = useRef(false);
    const prevGameState = useRef(undefined);
    

    useEffect(()=>{
        if(isDrawing !== prevIsDrawing.current){
            if(isDrawing == true){
                fetch("/threeWords").then((response)=>{
                    response.json().then(
                        (data) => {
                            setWords(data)
                        }
                    );
                });
            }
        }
        prevIsDrawing.current = isDrawing;
    },
    [isDrawing]);

    useEffect(() => {
        if(gameState === DRAW_AND_GUESS && prevGameState.current !== DRAW_AND_GUESS){
            setTime(settings.time);
            setTally([]);
            const timer = setInterval(()=>{
                setTime(prev=>{
                    return (prev === 0 ? 0 : prev - 1);
                })
            }, 1000);
            return ()=>{clearInterval(timer)};
        }
        if(gameState === TALLY_SCORE){
            setIsDrawing(false);
            setClearCanvas(prev=>!prev);
            setWord("");    
        }
        prevGameState.current = gameState;
    }, [gameState]);



    //Copy Button
    const [buttonText, setButtonText] = useState('Copy invite link')
    const copyURL = () => {
        navigator.clipboard.writeText(window.location.href)
        setButtonText('Copied!')
        setTimeout(() => {
            setButtonText('Copy invite link')
        }, 1000);
    }

    useEffect(()=>{
        allowDrawing.current = isDrawing && gameState === DRAW_AND_GUESS;
    }, [isDrawing, gameState])

    //Coordinates
    const getCoords = (coords, colors, clearCanvas) => {
        if(allowDrawing.current){
            setLandmarkCoords(coords);
            setColors(colors);
            setClearCanvas(clearCanvas);
            var canvasData = {coords : coords, colors : colors, clearCanvas : clearCanvas};
            setCanvasData(canvasData)
        }
    }

    useEffect(()=>{
        if(!allowDrawing.current && canvasData !== undefined && canvasData){
            

            setLandmarkCoords(canvasData.coords);
            setColors(canvasData.colors);
            setClearCanvas(canvasData.clearCanvas);
            
        }
    }, [canvasData])


    const [colors, setColors] = useState({});
    const [landmarkCoords, setLandmarkCoords] = useState({});
    const [clearCanvas, setClearCanvas] = useState(false);

    function getWords(){
        var list = [];
        var index = 0;
        for(const word of words){
            list.push(<div key={index} onClick={()=>{setGameState(DRAW_AND_GUESS);setWord(word);setWords([])}}className="text-white p-2 border-2 border-white m-2 hover:cursor-pointer rounded-md">{word}</div>)
            index += 1;
        }
        return list;
    }

    function getTally(){
        var list = [];
        var index = 0;
        for(const item of tally){
            list.push(<div key={index} className="flex gap-0.5">
                <div>{item.player.name}</div>
                <div className="text-green-400">{"+" + item.points}</div>
            </div>);
            index += 1;
        }
        return list;
    }

    return (
        <div className="w-full min-w-[1024px] min-h-screen max-h-screen flex justify-content p-24">
            
            <div className="w-1/5 flex flex-col">
                <Scoreboard players={listOfPlayers}></Scoreboard>
                <Camera startCamera={true} getCoords={getCoords}></Camera>
            </div> 
            <div className="p-10 pt-0 w-3/5 h-full flex flex-col items-center">
            
                <div className="absolute">{word}</div>
                <Canvas coords={landmarkCoords} colors={colors} clearCanvas={clearCanvas}></Canvas>
                <div className='text-center'>{time}</div>
            </div> 
            <div className="w-1/5 h-full flex flex-col items-center">
                <Guesses playerName={playerName} listOfGuesses={listOfGuesses} setListOfGuesses={setListOfGuesses} guess={guess} setGuess={setGuess}></Guesses>
                <button className='w-48 text-center p-2 border-4 border-black rounded-lg mt-5' onClick={()=>copyURL()}>{buttonText}</button>
            </div> 

            {gameState === CHOOSE_WORD && <div className="w-full min-h-screen bg-black opacity-75 fixed z-10 top-0 left-0 flex justify-center items-center">{isDrawing ? <div><div className="text-white text-center">Select a word.</div><div className="flex">{getWords()}</div></div> : <div className="text-white">Waiting for player to select a word.</div>}</div>}
            
            {gameState === TALLY_SCORE && <div className="w-full min-h-screen bg-black opacity-75 fixed z-10 top-0 left-0 flex justify-center items-center"><div className="text-white">{getTally()}</div></div>}
        </div>
    );
}
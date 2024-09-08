"use client"
import {useState, useEffect} from 'react';
import Game from './game';
import SetUpPage from './setup';
import MultiplayerClient from './multiplayerClient';
import axios from 'axios';

export default function SetupAndGamePage(){
    const [gameStarted, setGameStarted] = useState(false);
    const [gameState, setGameState] = useState(undefined);
    const [isDrawing, setIsDrawing] = useState(false);

    //Setup page
    const [avatar, setAvatar] = useState(0);
    const [playerName, setPlayerName] = useState('');
    const [listOfPlayers, setListOfPlayers] = useState([])
    const updatePlayers = (players) => {
        setListOfPlayers(players)
    }
    const defaultSettings = {time: 60, rounds: 3, hints: 1};
    const [settings, setSettings] = useState(defaultSettings);
    const [isAdmin, setIsAdmin] = useState(false);

    const [word, setWord] = useState("");
    const [canvasData, setCanvasData] = useState(undefined);
    
    const [listOfGuesses, setListOfGuesses] = useState([]);
    const [guess, setGuess] = useState('');

    const [tally, setTally] = useState([]);

    return (
        <div>
            <MultiplayerClient updatePlayers={updatePlayers} name={playerName} avatar={avatar} settings={settings} setSettings={setSettings} setIsAdmin={setIsAdmin} 
                gameStarted={gameStarted} setGameStarted={setGameStarted} gameState={gameState} setGameState={setGameState} setIsDrawing={setIsDrawing} word={word} setWord={setWord} 
                canvasData={canvasData} setCanvasData={setCanvasData} setListOfGuesses={setListOfGuesses} guess={guess} setTally={setTally}></MultiplayerClient>
                
            {gameStarted ? <Game gameState={gameState} setGameState={setGameState} listOfPlayers={listOfPlayers} settings={settings} isDrawing={isDrawing} setIsDrawing={setIsDrawing} word={word} 
            setWord={setWord} canvasData={canvasData} setCanvasData={setCanvasData} listOfGuesses={listOfGuesses} setListOfGuesses={setListOfGuesses} guess={guess} setGuess={setGuess}
            playerName={playerName} setTally={setTally} tally={tally}></Game> 
                : <SetUpPage avatar={avatar} setAvatar={setAvatar} playerName={playerName} setPlayerName={setPlayerName} listOfPlayers={listOfPlayers} settings={settings} 
                setSettings={setSettings} isAdmin={isAdmin} setGameStarted={setGameStarted} setGameState={setGameState}></SetUpPage>}
        </div>
    )
}

import { useRef, useEffect } from "react"
import { Client } from '@stomp/stompjs';

export default function MultiplayerClient({updatePlayers, name, avatar, points, settings, setSettings, setIsAdmin, gameStarted, setGameStarted, gameState, setGameState, setIsDrawing, word, canvasData, setCanvasData, setListOfGuesses, guess, setTally }){

    const stompClient = useRef(undefined);
    const connected = useRef(false);
    const room = useRef('');


    const id = useRef('');
    var generateRandomString = function(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    const isAdmin = useRef(false);
    const isDrawing = useRef(false);
    const prevGameState = useRef(undefined);
    

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        room.current =  urlParams.get("room");

        stompClient.current = new Client({
            brokerURL: 'ws://floppyfingers.online/ws/connect',
        });
        
        stompClient.current.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            
            function setPlayers(body){
                var playerList = [];
                //console.log(body);
                for(const [sessionId, player] of Object.entries(body)){
                    playerList.push(player);
                    if(player.id === id.current){
                        setIsAdmin(player.isAdmin);
                        isAdmin.current = player.isAdmin;
                    }
                }
                updatePlayers(playerList);
            }
            stompClient.current.subscribe('/ws/topic/info/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                setSettings(body.settings);
                setGameStarted(body.gameStarted);
                setGameState(body.gameState);
                setPlayers(body.players);
            });
            
            // acknowledges change in endpoint and makes changes to frontend
            stompClient.current.subscribe('/ws/topic/players/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                setPlayers(body);
            });

            stompClient.current.subscribe('/ws/topic/currentPlayer/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                if(body.id == id.current){
                    setIsDrawing(true);
                    isDrawing.current = true;
                }else{
                    setIsDrawing(false);
                    isDrawing.current = false;
                }
            });

            stompClient.current.subscribe('/ws/topic/settings/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                if(!isAdmin.current){
                    setSettings(body);
                }
            });

            stompClient.current.subscribe('/ws/topic/gameMode/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                if(!isAdmin.current){
                    setGameStarted(body);
                }
            });

            stompClient.current.subscribe('/ws/topic/gameState/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                if(body.gameState !==  prevGameState.current){
                    setGameState(body.gameState);
                }
                prevGameState.current = body.gameState;
            });

            stompClient.current.subscribe('/ws/topic/canvas/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                if(!isDrawing.current){
                    setCanvasData(body);
                }
            });

            stompClient.current.subscribe('/ws/topic/chat/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                setListOfGuesses(prev=>[...prev, body]);
            });

            stompClient.current.subscribe('/ws/topic/tally/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                console.log(body);
                setTally(body);
            });


            
            connected.current = true;

            
            //Initial info
            
            id.current = generateRandomString(64);
            stompClient.current.publish({
                destination: '/ws/multiplayer/players/'+room.current,
                body: JSON.stringify({'name' : 'Player', 'avatar' : avatar, 'points': points, 'id' : id.current})
            })
            stompClient.current.publish({
                destination: '/ws/multiplayer/info/'+room.current
            })
        };

        stompClient.current.onWebSocketError = (error) => {
            console.error('Error with websocket', error);
            connected.current = false;
        };
        
        stompClient.current.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
            connected.current = false;
        };

        stompClient.current.activate();
        return () => {
            stompClient.current.deactivate();
            connected.current = false;
        }
    },[])

    useEffect(()=>{
        if(connected.current){
            stompClient.current.publish({
                destination: '/ws/multiplayer/players/'+room.current,
                body: JSON.stringify({'name' : name == "" ? "Player" : name, 'avatar' : avatar, 'points' : points, 'id' : id.current, 'isAdmin' : isAdmin.current})
            })
        }
    }, [name, avatar, points])

    useEffect(()=>{
        if(connected.current && isAdmin.current){
            
            stompClient.current.publish({
                destination: '/ws/multiplayer/settings/'+room.current,
                body: JSON.stringify({'time' : settings.time, 'rounds' : settings.rounds, 'hints' : settings.hints})
            })
        }
    }, [settings])

    useEffect(()=>{
        if(connected.current && isAdmin.current){
            
            stompClient.current.publish({
                destination: '/ws/multiplayer/gameMode/'+room.current,
                body: JSON.stringify({'gameStarted' : gameStarted})
            })
        }
    }, [gameStarted])

    useEffect(()=>{
        if(connected.current && gameState != prevGameState.current){
            stompClient.current.publish({
                destination: '/ws/multiplayer/gameState/'+room.current,
                body: JSON.stringify({'gameState' : gameState})
            })
            prevGameState.current = gameState;
        }
    }, [gameState])

    useEffect(()=>{
        if(connected.current){
            stompClient.current.publish({
                destination: '/ws/multiplayer/currentWord/'+room.current,
                body: JSON.stringify({'word' : word})
            })
        }
    }, [word])

    useEffect(()=>{
        if(connected.current && isDrawing.current){
            stompClient.current.publish({
                destination: '/ws/multiplayer/canvas/'+room.current,
                body: JSON.stringify(canvasData)
            })
        }

    }, [canvasData])

    useEffect(()=>{
        if(connected.current && !isDrawing.current){
            stompClient.current.publish({
                destination: '/ws/multiplayer/chat/'+room.current,
                body: JSON.stringify(guess)
            })
        }

    }, [guess])

    return (
        <>
        </>
    );
}
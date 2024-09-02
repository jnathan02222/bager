
import { useRef, useEffect } from "react"
import { Client } from '@stomp/stompjs';

export default function MultiplayerClient({updatePlayers, updateSettings, updateGameStarted, name, avatar, points, admin, time, rounds, hints, gameStarted}) {

    const stompClient = useRef(undefined);
    const connected = useRef(false);
    const room = useRef('');

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        room.current =  urlParams.get("room");

        stompClient.current = new Client({
            brokerURL: 'ws://localhost:8080/ws/connect',
        });
        
        stompClient.current.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            
            // acknowledges change in endpoint and makes changes to frontend
            stompClient.current.subscribe('/ws/topic/players/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                var playerList = [];
                for(const [sessionId, player] of Object.entries(body)){
                    playerList.push(player);
                }
                updatePlayers(playerList);
            });

            stompClient.current.subscribe('/ws/topic/settings/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                updateSettings(body);
            });

            stompClient.current.subscribe('/ws/topic/info/'+room.current, (msg) => {
                let body = JSON.parse(msg.body);
                let playerList = [];
                for(const [sessionId, player] of Object.entries(body.players)){
                    playerList.push(player);
                }
                updatePlayers(playerList);
                updateSettings(body.settings);
                updateGameStarted(body.gameStarted);
                console.log(playerList);
                console.log(body.settings);
                console.log(body.gameStarted);
            });

            stompClient.current.subscribe('/ws/topic/gameStarted/'+room.current, (msg) => {
                updateGameStarted(msg.body);
                if(msg.body === 'true'){
                    console.log('Let the games begin');
                }
            });

            connected.current = true;
            //Initial info
            stompClient.current.publish({
                destination: '/ws/multiplayer/players/'+room.current,
                body: JSON.stringify({'name' : 'Player', 'avatar' : avatar, 'points': points, 'admin' : admin})
            })

            stompClient.current.publish({
                destination: '/ws/multiplayer/settings/'+room.current,
                body: JSON.stringify({'rounds' : rounds, 'hints': hints, 'time' : time})
            })

            stompClient.current.publish({
                destination: '/ws/multiplayer/gameStarted/'+room.current,
                body: JSON.stringify({"gameStarted": gameStarted })
            })

            stompClient.current.publish({
                destination: '/ws/multiplayer/info/'+room.current,
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
                body: JSON.stringify({'name' : name == "" ? "Player" : name, 'avatar' : avatar, 'points' : points, 'admin' : admin})
            })
        }
    }, [name, avatar, points, admin])

    useEffect(()=>{
        if(connected.current){
            stompClient.current.publish({
                destination: '/ws/multiplayer/settings/'+room.current,
                body: JSON.stringify({'rounds' : rounds, 'hints': hints, 'time' : time})
            })
        }
    }, [time, rounds, hints])

    useEffect(()=>{
        if(connected.current){
            stompClient.current.publish({
                destination: '/ws/multiplayer/gameStarted/'+room.current,
                body: JSON.stringify({ "gameStarted": gameStarted })
            })
        }
    }, [gameStarted])


    return (
        <>
        </>
    );
}
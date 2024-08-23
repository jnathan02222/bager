
import { useRef, useEffect } from "react"
import { Client } from '@stomp/stompjs';

export default function MultiplayerClient({updatePlayers, name, avatar, points}){

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
                //console.log(body);
                for(const [sessionId, player] of Object.entries(body)){
                    playerList.push(player);
                    //console.log(player);
                }
                updatePlayers(playerList);
            });

            stompClient.current.subscribe('/ws/topic/info/'+room.current, (msg) => {
                
            });

            
            connected.current = true;
            //Initial info
            stompClient.current.publish({
                destination: '/ws/multiplayer/players/'+room.current,
                body: JSON.stringify({'name' : 'Player', 'avatar' : avatar, 'points': points})
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
                body: JSON.stringify({'name' : name == "" ? "Player" : name, 'avatar' : avatar, 'points' : points})
            })
        }
    }, [name, avatar, points])


    return (
        <>
        </>
    );
}
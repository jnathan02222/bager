
import { useRef, useEffect } from "react"
import { Client } from '@stomp/stompjs';

export default function MultiplayerClient({addPlayerJoined, addGuesses, setSettings}){

    const stompClient = useRef(undefined);

    function getRoom(){
        const urlParams = new URLSearchParams(window.location.search);
        const room = urlParams.get("room");
        return room;
    }

    useEffect(()=>{
        stompClient.current = new Client({
            brokerURL: 'ws://localhost:8080/ws/connect',
        });
        
        stompClient.current.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            
            const room = getRoom();
            // acknowledges change in endpoint and makes changes to frontend
            stompClient.current.subscribe('/ws/topic/players/'+room, (msg) => {
                console.log(msg.body)
                //addPlayerJoined(msg);
            });

            

            stompClient.current.subscribe('/ws/topic/settings/'+room, (msg) => {
                //setSettings(msg);
            });

            stompClient.current.subscribe('/ws/topic/canvas/'+room, (msg) => {
                
            });

            stompClient.current.subscribe('/ws/topic/chat/'+room, (msg) => {
                //addGuesses(msg);
            });
            
            
        };

        stompClient.current.onWebSocketError = (error) => {
            console.error('Error with websocket', error);
        };
        
        stompClient.current.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        stompClient.current.activate();
        return () => {
            stompClient.current.deactivate();
        }
    },[])

    return (
        <div>
            
        </div>
    );
}
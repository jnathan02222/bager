
import { useRef, useEffect } from "react"

import { Client } from '@stomp/stompjs';


export default function MultiplayerClient(){

    const stompClient = useRef(undefined);
    useEffect(()=>{
        stompClient.current = new Client({
            brokerURL: 'ws://localhost:8080/ws/connect',
            
        });
        
        stompClient.current.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            stompClient.current.subscribe('/ws/topic/hello', (msg) => {
                console.log(msg.body)
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
        <div></div>
    );
}
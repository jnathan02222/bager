package com.example.backend.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


//Create a Message Broker. This will allow messages to be handled with a Controller class
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    //Outgoing messages to /ws/topic will be routed to all WebSocket clients
    config.enableSimpleBroker("/ws/topic");
    //Incoming messages starting with /ws/multiplayer will be sent to the Controller
    config.setApplicationDestinationPrefixes("/ws/multiplayer");
    
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    //This is how a STOMP connection will be established
    registry.addEndpoint("/ws/connect");
  }

}
package com.example.backend;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MultiplayerController {
    @MessageMapping("/hello")
    @SendTo("/ws/topic/hello")
    public String hello() throws Exception{
        return "Hello!";
    }
}
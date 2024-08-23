package com.example.backend;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;

// reads updates in the /players endpoint and sends it to the /ws/topic/players endpoint
@Controller
public class MultiplayerController {
    @MessageMapping("/players/{id}")
    @SendTo("/ws/topic/players/{id}")
    public String player(@DestinationVariable String id) throws Exception{
        return "Stuff"; // msg to be sent to the /ws/topic/players endpoint
    }
    
}

/*
private class Player{
    private String name;
    private int avatar;
    private int points;

    public Player(String name, int avatar){
        this.name = name;
        this.avatar = avatar;
        this.points = 0;
    }
}

private class Settings{
    private int time, rounds, hints;

    public Settings(int time, int rounds, int hints){
        this.time = time;
        this.rounds = rounds;
        this.hints = hints;
    }
}

private class GuessingChat{
    private String[] listOfGuesses;
    
    public GuessingChat(String[] listOfGuesses){
        this.listOfGuesses = listOfGuesses;
    }
}
*/
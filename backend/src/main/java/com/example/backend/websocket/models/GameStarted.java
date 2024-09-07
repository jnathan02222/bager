package com.example.backend.websocket.models;

public class GameStarted{
    private boolean gameStarted;

    public void setGameStarted(boolean gameStarted){
        this.gameStarted = gameStarted;
    }
    public boolean getGameStarted(){
        return gameStarted;
    }
}
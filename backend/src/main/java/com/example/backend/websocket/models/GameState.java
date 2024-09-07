package com.example.backend.websocket.models;

public class GameState{
    public static final int CHOOSE_WORD = 0;
    public static final int DRAW_AND_GUESS = 1;
    public static final int TALLY_SCORE = 2;
    private int gameState;

    public void setGameState(int gameState){
        this.gameState = gameState;
    }
    public int getGameState(){
        return gameState;
    }
}
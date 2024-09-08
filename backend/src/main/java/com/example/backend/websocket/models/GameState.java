package com.example.backend.websocket.models;

public class GameState{
    public static final int CHOOSE_WORD = 0;
    public static final int DRAW_AND_GUESS = 1;
    public static final int TALLY_SCORE = 2;
    public static final int NONE = -1;
    private int gameState;

    public GameState(){

    }
    public GameState(int gameState){
        this.gameState = gameState;
    }
    public void setGameState(int gameState){
        this.gameState = gameState;
    }
    public int getGameState(){
        return gameState;
    }
}
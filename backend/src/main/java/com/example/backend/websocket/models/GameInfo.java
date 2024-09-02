package com.example.backend;
import java.util.HashMap;

public class GameInfo{
    private boolean gameStarted;
    private HashMap<String, Player> players;
    private Settings settings;

    public GameInfo(){
        this.gameStarted = false;
        this.players = new HashMap<String, Player>();
        this.settings = new Settings();
        //synchronized 
    }

    public synchronized boolean isGameStarted(){
        return this.gameStarted;
    }

    public synchronized void setGameStarted(boolean gameStarted){
        this.gameStarted = gameStarted;
    }

    public synchronized void updatePlayer(String sessionId, Player p){
        players.put(sessionId, p);
    }

    public synchronized void setPlayers(HashMap<String, Player> players){
        this.players = players;
    }
    
    public synchronized HashMap<String, Player> getPlayers(){
        return players;
    }

    public synchronized Player getPlayerBySessionId(String sessionId){
        return players.get(sessionId);
    }

    public synchronized void setSettings(Settings s){
        this.settings = s;
    }

    public synchronized Settings getSettings(){
        return settings;
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
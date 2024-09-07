
package com.example.backend.websocket.models;
import java.util.HashMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.time.Instant;

public class GameInfo{
    

    private boolean gameStarted;
    private HashMap<String, Player> players;
    private ArrayList<Player> playerQueue;
    private int selectedPlayer = 0;
    private String currentWord;
    
    private Settings settings;
    private boolean noPlayers = true;
    private int gameState;
    private CanvasData canvasData;
    private ArrayList<Message> chat;
    private HashMap<String, Long> guesses;
    private Long roundStartTime;
    

    public GameInfo(){
        this.gameStarted = false;
        this.players = new HashMap<String, Player>();
        this.settings = new Settings();
        this.gameState = 1;
        this.playerQueue = new ArrayList<Player>();
        this.chat = new ArrayList<Message>();
        this.currentWord = "";
        this.guesses = new HashMap<String, Long>();
    }
    
    public synchronized boolean getGameStarted(){
        return this.gameStarted;
    }
    public synchronized void setGameStarted(boolean gameStarted){
        if(!this.gameStarted && gameStarted){
            Collections.shuffle(playerQueue);
            selectedPlayer = 0;
        }
        this.gameStarted = gameStarted;

        
    }

    public synchronized void updatePlayer(String sessionId, Player p){
        if(!players.containsKey(sessionId)){
            if(noPlayers){
                p.setIsAdmin(true);
            }else{
                p.setIsAdmin(false);
            }
            noPlayers = false;

            playerQueue.add(p);
        }
        players.put(sessionId, p);
    }

    public synchronized HashMap<String, Player> getPlayers(){
        return players;
    }
    public synchronized void setPlayers(HashMap<String, Player> players){
        this.players = players;
    }

    public synchronized Settings getSettings(){
        return settings;
    }
    public synchronized void setSettings(Settings settings){
        this.settings = settings;
    }
    

    public synchronized int getGameState(){
        return gameState;
    }
    public synchronized void setGameState(int gameState){
        this.gameState = gameState;


    }

    public synchronized CanvasData getCanvasData(){
        return canvasData;
    }
    public synchronized void setCanvasData(CanvasData canvasData){
        this.canvasData = canvasData;
    }

    public synchronized Player popSelectedPlayer(){
        if(playerQueue.size() == 0){
            return null;
        }
        if(selectedPlayer >= playerQueue.size()){
            selectedPlayer = 0;
        }
        Player p = playerQueue.get(selectedPlayer);
        selectedPlayer += 1;
        return p;
    }

    public synchronized void setWord(String word){
        this.currentWord = word;
    }

    /* 
    public void setChat(ArrayList<Message> chat){
        this.chat = chat;
    }
    public ArrayList<Message> getChat(){
        return chat;
    }*/
    public synchronized Message checkGuess(Message msg, String sessionId, SimpMessagingTemplate messagingTemplate, String roomId){
        chat.add(msg);
        
        if(msg.getMessage().equals(currentWord) && !guesses.containsKey(sessionId)){
            guesses.put(sessionId, Instant.now().getEpochSecond());

            Message success = new Message();
            success.setName("Server");
            success.setMessage(msg.getName() + " guessed the word!");
            
            return success;
        }
        return msg;
    }

    public synchronized void setRoundStartTime(){
        roundStartTime = Instant.now().getEpochSecond();
        this.guesses = new HashMap<String, Long>();
    }
}


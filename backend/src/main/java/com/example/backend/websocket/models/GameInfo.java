
package com.example.backend.websocket.models;
import java.util.HashMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.example.backend.websocket.MultiplayerService;

import java.util.ArrayList;
import java.util.Collections;
import java.time.Instant;

public class GameInfo{
    

    private boolean gameStarted;

    private HashMap<String, Player> players;
    private ArrayList<Player> playerQueue;
    private HashMap<String, Long> guesses;
    private int selectedPlayer = 0;
    private GameState gameState;

    private String currentWord;
    private Settings settings;
    private boolean noPlayers = true;

    private CanvasData canvasData;
    private ArrayList<Message> chat;
    private Long turnStartTime;
    private int rounds;
    private int turns;

    public GameInfo(){
        this.gameStarted = false;
        this.players = new HashMap<String, Player>();
        this.settings = new Settings();
        this.gameState = new GameState(GameState.NONE);
        this.playerQueue = new ArrayList<Player>();
        this.chat = new ArrayList<Message>();
        this.currentWord = "";
        this.guesses = new HashMap<String, Long>();
        this.rounds = 0;
        this.turns = 0;
    }
    
    public synchronized boolean getGameStarted(){
        return this.gameStarted;
    }
    public synchronized void updateGameStarted(boolean gameStarted, MultiplayerService multiplayerService, SimpMessagingTemplate messagingTemplate, String id){
        if(!this.gameStarted && gameStarted){
            Collections.shuffle(playerQueue);
            rounds = 0;
            turns = 0;
            selectedPlayer = 0;
            updateGameState(new GameState(GameState.CHOOSE_WORD), id, multiplayerService, messagingTemplate);
            messagingTemplate.convertAndSend("/ws/topic/gameState/"+id, gameState);
        }

        setGameStarted(gameStarted);
    }
    public synchronized void setGameStarted(boolean gameStarted){
        
        this.gameStarted = gameStarted;

    }

    public synchronized int getTurns(){
        return turns;
    }

    public synchronized void updateScore(String id, MultiplayerService multiplayerService, SimpMessagingTemplate messagingTemplate){
        messagingTemplate.convertAndSend("/ws/topic/gameState/"+id, new GameState(GameState.TALLY_SCORE));
        updateGameState(new GameState(GameState.TALLY_SCORE), id, multiplayerService, messagingTemplate);
        
        ArrayList<Score> points = new ArrayList<Score>();
        for(String sessionId : players.keySet()){
            long gain = 0;
            if(guesses.containsKey(sessionId)){
                gain = settings.getTime()-(guesses.get(sessionId)-turnStartTime);
            }
            points.add(new Score(players.get(sessionId), gain));

            players.get(sessionId).addPoints(gain);
        }
        messagingTemplate.convertAndSend("/ws/topic/tally/"+id, points);
        messagingTemplate.convertAndSend("/ws/topic/players/"+id, getPlayers());
        
    }
    
    public synchronized void updateGameState(GameState g, String id, MultiplayerService multiplayerService, SimpMessagingTemplate messagingTemplate){
        if((g.getGameState() == GameState.CHOOSE_WORD && gameState.getGameState() != GameState.CHOOSE_WORD)){
            messagingTemplate.convertAndSend("/ws/topic/currentPlayer/"+id, popSelectedPlayer());
        }
        if(g.getGameState() == GameState.DRAW_AND_GUESS && gameState.getGameState()  != GameState.DRAW_AND_GUESS){
            startRound();
            int currentTurns = turns;
            multiplayerService.scheduleTask(()->{
                if(currentTurns == getTurns()){
                    updateScore(id, multiplayerService, messagingTemplate);
                }
            }, settings.getTime());
        }

        if(g.getGameState() == GameState.TALLY_SCORE && gameState.getGameState()  != GameState.TALLY_SCORE){
            turns += 1;
           
            multiplayerService.scheduleTask(()->{
                

                messagingTemplate.convertAndSend("/ws/topic/gameState/"+id, new GameState(GameState.CHOOSE_WORD));
                updateGameState(new GameState(GameState.CHOOSE_WORD), id, multiplayerService, messagingTemplate);
                
                if(rounds == settings.getRounds()-1 && selectedPlayer >= playerQueue.size()){
                    gameStarted = false;
                    gameState = new GameState(GameState.NONE);
                    
                    messagingTemplate.convertAndSend("/ws/topic/info/"+id, this);
                    for(String sessionId : players.keySet()){
                        players.get(sessionId).setPoints(0);
                    }
                    messagingTemplate.convertAndSend("/ws/topic/players/"+id, players);
                    return;
                }

            }, 5);
        }
        setGameState(g);
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
    

    public synchronized GameState getGameState(){
        return gameState;
    }
    public synchronized void setGameState(GameState gameState){
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
            rounds += 1;
            
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
    public synchronized Message checkGuess(Message msg, String sessionId, SimpMessagingTemplate messagingTemplate, String roomId, MultiplayerService multiplayerService){
        chat.add(msg);
        
        if(msg.getMessage().equals(currentWord) && !guesses.containsKey(sessionId)){
            guesses.put(sessionId, Instant.now().getEpochSecond());

            Message success = new Message();
            success.setName("Server");
            success.setMessage(msg.getName() + " guessed the word!");

            if(guesses.size() == players.size()-1){
                updateScore(roomId, multiplayerService, messagingTemplate);
            }
            
            return success;
        }
        return msg;
    }

    public synchronized void startRound(){
        turnStartTime = Instant.now().getEpochSecond();
        this.guesses = new HashMap<String, Long>();
        
    }

    public synchronized void removePlayer(String sessionId, MultiplayerService multiplayerService, SimpMessagingTemplate messagingTemplate, String roomId){
        Player p = players.get(sessionId);

       
        if(playerQueue.indexOf(p) == selectedPlayer - 1 && gameStarted){
            
            selectedPlayer -= 1;
            updateGameState(new GameState(GameState.TALLY_SCORE), roomId, multiplayerService, messagingTemplate);
        }

        playerQueue.remove(p);
        players.remove(sessionId);

        if(guesses.containsKey(sessionId)){
            guesses.remove(sessionId);
        }

        //Select new admin
        for(Player pl : players.values()){
            pl.setIsAdmin(true);
            break;
        }
    }
}


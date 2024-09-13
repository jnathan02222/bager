package com.example.backend.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

import org.springframework.stereotype.Controller;

import com.example.backend.websocket.models.CanvasData;
import com.example.backend.websocket.models.GameInfo;
import com.example.backend.websocket.models.GameStarted;
import com.example.backend.websocket.models.GameState;
import com.example.backend.websocket.models.Message;
import com.example.backend.websocket.models.Player;
import com.example.backend.websocket.models.Settings;
import com.example.backend.websocket.models.Word;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import java.util.HashMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;


// reads updates in the /players endpoint and sends it to the /ws/topic/players endpoint
@Controller
public class MultiplayerController {
    private MultiplayerService multiplayerService;
    private SimpMessagingTemplate messagingTemplate;

    
	@Autowired
	public MultiplayerController(MultiplayerService multiplayerService, SimpMessagingTemplate messagingTemplate){
		this.multiplayerService = multiplayerService;
        this.messagingTemplate = messagingTemplate;
	}
    
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        for(String id : multiplayerService.getRooms().keySet()){
            GameInfo room = multiplayerService.getRoom(id);

            if(room.getPlayers().containsKey(sessionId)){
                //Delete room
                if(room.getPlayers().size() == 1){
                    multiplayerService.closeRoom(id);
                    return;
                }

                //Remove player, adjust admin and advance the turn if necessary
                room.removePlayer(sessionId, multiplayerService, messagingTemplate, id);
                messagingTemplate.convertAndSend("/ws/topic/players/"+id, room.getPlayers());
                messagingTemplate.convertAndSend("/ws/topic/gameState/"+id, room.getGameState());

            }
        }
    }

    @MessageMapping("/info/{id}")
    @SendTo("/ws/topic/info/{id}")
    public GameInfo info(@DestinationVariable String id) throws Exception{
        return multiplayerService.getRoom(id);
    }
    
    @MessageMapping("/players/{id}")
    @SendTo("/ws/topic/players/{id}")
    public HashMap<String, Player> player(Player p, @DestinationVariable String id, SimpMessageHeaderAccessor headerAccessor) throws Exception{
        GameInfo room = multiplayerService.getRoom(id);
        room.updatePlayer(headerAccessor.getSessionId(), p);
        //room.updatePlayer(p.getSessionId(), p);
        return room.getPlayers(); // msg to be sent to the /ws/topic/players endpoint
    }
    
    @MessageMapping("/settings/{id}")
    @SendTo("/ws/topic/settings/{id}")
    public Settings settings(Settings s, @DestinationVariable String id){
        GameInfo room = multiplayerService.getRoom(id);
        room.setSettings(s);
        return room.getSettings();
    }

    @MessageMapping("/gameMode/{id}")
    @SendTo("/ws/topic/gameMode/{id}")
    public boolean gameMode(GameStarted g, @DestinationVariable String id){
        GameInfo room = multiplayerService.getRoom(id);
        room.updateGameStarted(g.getGameStarted(), multiplayerService, messagingTemplate, id);
        return room.getGameStarted();
    }

    @MessageMapping("/gameState/{id}")
    @SendTo("/ws/topic/gameState/{id}")
    public GameState gameState(GameState g, @DestinationVariable String id){
        GameInfo room = multiplayerService.getRoom(id);
        room.updateGameState(g, id, multiplayerService, messagingTemplate);
        return room.getGameState();
    }

    @MessageMapping("/canvas/{id}")
    @SendTo("/ws/topic/canvas/{id}")
    public CanvasData canvas(CanvasData c, @DestinationVariable String id){
        GameInfo room = multiplayerService.getRoom(id);
        room.setCanvasData(c);
        return room.getCanvasData();
    }

    @MessageMapping("/currentWord/{id}")
    @SendTo("/ws/topic/currentWord/{id}")
    public void currentWord(Word w, @DestinationVariable String id){
        GameInfo room = multiplayerService.getRoom(id);
        room.setWord(w.getWord());
    }

    @MessageMapping("/chat/{id}")
    @SendTo("/ws/topic/chat/{id}")
    public Message chat(Message m, @DestinationVariable String id, SimpMessageHeaderAccessor headerAccessor){
        GameInfo room = multiplayerService.getRoom(id);
        return room.checkGuess(m, headerAccessor.getSessionId(), messagingTemplate, id, multiplayerService);
    }

    @MessageMapping("/ping/{id}")
    @SendTo("/ws/topic/ping/{id}")
    public Player ping(@DestinationVariable String id, SimpMessageHeaderAccessor headerAccessor){
        return multiplayerService.getRoom(id).getPlayers().get(headerAccessor.getSessionId());
    }
}


package com.example.backend;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.example.backend.GameInfo;
import com.example.backend.Player;
import com.example.backend.Settings;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import java.util.HashMap;

// reads updates in the /players endpoint and sends it to the /ws/topic/players endpoint
@Controller
public class MultiplayerController {
    private MultiplayerService multiplayerService;
	@Autowired
	public MultiplayerController(MultiplayerService multiplayerService){
		this.multiplayerService = multiplayerService;
	}


    @MessageMapping("/players/{id}")
    @SendTo("/ws/topic/players/{id}")
    public HashMap<String, Player> player(Player p, @DestinationVariable String id, SimpMessageHeaderAccessor headerAccessor) throws Exception{
        GameInfo room = multiplayerService.getRoom(id);
        room.updatePlayer(headerAccessor.getSessionId(), p);
        return room.getPlayers(); // msg to be sent to the /ws/topic/players endpoint
    }

    @MessageMapping("/settings/{id}")
    @SendTo("/ws/topic/settings/{id}")
    public Settings settings(Settings s, @DestinationVariable String id, SimpMessageHeaderAccessor headerAccessor) throws Exception{
        GameInfo room = multiplayerService.getRoom(id);
        Player player = room.getPlayerBySessionId(headerAccessor.getSessionId());
        if(player.getAdmin()){
            room.setSettings(s);
            return room.getSettings();
        }
        return s;
    }
    
    @MessageMapping("/info/{id}")
    @SendTo("/ws/topic/info/{id}")
    public GameInfo gameInfo(@DestinationVariable String id) throws Exception{
        GameInfo room = multiplayerService.getRoom(id);
        return room;
    }

    @MessageMapping("/gameStarted/{id}")
    @SendTo("/ws/topic/gameStarted/{id}")
    public boolean startGame(HashMap<String, Boolean> payload, @DestinationVariable String id) throws Exception{
        boolean gameStarted = payload.get("gameStarted");
        GameInfo room = multiplayerService.getRoom(id);
        room.setGameStarted(gameStarted);
        return room.isGameStarted();
    }
}


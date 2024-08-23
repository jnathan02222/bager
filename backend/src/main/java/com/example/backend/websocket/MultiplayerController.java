package com.example.backend;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

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
    
}


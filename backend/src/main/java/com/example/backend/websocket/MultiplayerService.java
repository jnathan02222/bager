package com.example.backend;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class MultiplayerService {
    private final Map<String, GameInfo> rooms = new ConcurrentHashMap<>();

    public void addRoom(String id, GameInfo gameInfo) {
        rooms.put(id, gameInfo);
    }

    public boolean roomExists(String id){
        return rooms.containsKey(id);
    }

    public GameInfo getRoom(String id) {
        return rooms.get(id);
    }

    public void closeRoom(String id) {
        rooms.remove(id);
    }

    
}
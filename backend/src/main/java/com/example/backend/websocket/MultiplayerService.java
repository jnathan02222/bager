package com.example.backend.websocket;
import org.springframework.stereotype.Service;

import com.example.backend.websocket.models.GameInfo;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class MultiplayerService {
    private final Map<String, GameInfo> rooms = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);


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

    public void scheduleTask(Runnable task, int delay) {
        scheduler.schedule(task, delay, TimeUnit.SECONDS);
    }
    
}
package com.example.backend.websocket.models;

public class Score {
    private Player player;
    private long points;

    public Score(Player player, long points) {
        this.player = player;
        this.points = points;
    }

    // Getter for player
    public Player getPlayer() {
        return player;
    }

    // Setter for player
    public void setPlayer(Player player) {
        this.player = player;
    }

    // Getter for points
    public long getPoints() {
        return points;
    }

    // Setter for points
    public void setPoints(long points) {
        this.points = points;
    }
}
package com.example.backend.websocket.models;

public class Player{
    private String name;
    private int avatar;
    private int points;
    private String id;
    private boolean isAdmin;

    public Player() {
        
    }
    public Player(String name, int avatar, int points, String id, boolean isAdmin) {
        this.name = name;
        this.avatar = avatar;
        this.points = points;
        this.id = id;
        this.isAdmin = isAdmin;
    }

    public synchronized String getName() {
      return name;
    }
    public synchronized void setName(String name) {
      this.name = name;
    }

    public synchronized int getAvatar() {
      return avatar;
    }
    public synchronized void setAvatar(int avatar) {
      this.avatar = avatar;
    }

    public synchronized int getPoints() {
      return points;
    }
    public synchronized void setPoints(int points) {
      this.points = points;
    }

    public synchronized String getId() {
      return id;
    }
    public synchronized void setId(String id) {
      this.id = id;
    }

    public synchronized boolean getIsAdmin(){
      return isAdmin;
    }
    public synchronized void setIsAdmin(boolean isAdmin){
      this.isAdmin = isAdmin;
    }

}
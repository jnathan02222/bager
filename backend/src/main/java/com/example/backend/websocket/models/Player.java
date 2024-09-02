package com.example.backend;

public class Player{
    private String name;
    private int avatar;
    private int points;
    private boolean admin;

    public Player() {
        
    }
    public Player(String name, int avatar, int points, boolean admin) {
        this.name = name;
        this.avatar = avatar;
        this.points = points;
        this.admin = admin;
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

    public synchronized boolean getAdmin() {
      return admin;
    }

    public synchronized void setAdmin(boolean admin) {
      this.admin = admin;
    }
}
package com.example.backend.websocket.models;

public class Settings{
    private int time;
    private int rounds;
    private int hints;

    public Settings(){
        time = 60;
        rounds = 3;
        hints = 1;
    }

    public synchronized int getTime() {
      return time;
    }
    public synchronized void setTime(int time) {
      this.time = time;
    }
    public synchronized int getRounds() {
      return rounds;
    }
    public synchronized void setRounds(int rounds) {
      this.rounds = rounds;
    }
    public synchronized int getHints() {
      return hints;
    }
    public synchronized void setHints(int hints) {
      this.hints = hints;
    }
   
}
package com.example.backend;

public class Settings {
    private int rounds, hints, time;

    public Settings() {
        this.rounds = 3;
        this.hints = 1;
        this.time = 60;
    }

    public Settings(int rounds, int hints, int time) {
        this.rounds = rounds;
        this.hints = hints;
        this.time = time;
    }

    public synchronized int getRounds() {
        return rounds;
    }

    public synchronized int getHints() {
        return hints;
    }

    public synchronized int getTime() {
        return time;
    }

    public synchronized void setRounds(int rounds) {
        this.rounds = rounds;
    }

    public synchronized void setHints(int hints) {
        this.hints = hints;
    }

    public synchronized void setTime(int time) {
        this.time = time;
    }
}

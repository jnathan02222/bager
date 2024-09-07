package com.example.backend.websocket.models;

public class Coords {
    private Point thumb;
    private Point pointer;
    private Point middle;
    private Point ring;
    private Point pinky;

    public Point getThumb(){
        return thumb;
    }
    public void setThumb(Point thumb){
        this.thumb = thumb;
    }

    public Point getPointer(){
        return pointer;
    }
    public void setPointer(Point pointer){
        this.pointer = pointer;
    }

    public Point getMiddle(){
        return middle;
    }
    public void setMiddle(Point middle){
        this.middle = middle;
    }

   
    public Point getRing(){
        return ring;
    }
    public void setRing(Point ring){
        this.ring = ring;
    }

    public Point getPinky(){
        return pinky;
    }
    public void setPinky(Point pinky){
        this.pinky = pinky;
    }


}

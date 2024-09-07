package com.example.backend.websocket.models;

public class Colors {
    private String thumb;
    private String pointer;
    private String middle;
    private String ring;
    private String pinky;

    public String getThumb(){
        return thumb;
    }
    public void setThumb(String thumb){
        this.thumb = thumb;
    }

    public String getPointer(){
        return pointer;
    }
    public void setPointer(String pointer){
        this.pointer = pointer;
    }

    public String getMiddle(){
        return middle;
    }
    public void setMiddle(String middle){
        this.middle = middle;
    }

   
    public String getRing(){
        return ring;
    }
    public void setRing(String ring){
        this.ring = ring;
    }

    public String getPinky(){
        return pinky;
    }
    public void setPinky(String pinky){
        this.pinky = pinky;
    }
}

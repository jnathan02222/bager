package com.example.backend.websocket.models;

public class Message {
    private String msg;
    private String name;

    public void setMessage(String msg){
        this.msg = msg;
    }
    public void setName(String name){
        this.name = name;
    }

    public String getMessage(){
        return msg;
    }
    public String getName(){
        return name;
    }

    

}

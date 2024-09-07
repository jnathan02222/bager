package com.example.backend.websocket.models;

public class CanvasData{
    private Coords coords;
    private Colors colors;
    private boolean clearCanvas;

    public void setCoords(Coords coords){
        this.coords = coords;
    }
    public void setColors(Colors colors){
        this.colors = colors;
    }
    public void setClearCanvas(boolean clearCanvas){
        this.clearCanvas = clearCanvas;
    }

    public Coords getCoords(){
        return coords;
    }
    public Colors getColors(){
        return colors;
    }
    public boolean getClearCanvas(){
        return clearCanvas;
    }
}
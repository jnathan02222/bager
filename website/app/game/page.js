import Guesses from "./guesses";
import Scoreboard from "./scoreboard";
import Camera from "./camera";
import Canvas from "./canvas";

export default function Game(){
    return (
        <div className="w-full min-h-screen flex justify-content items-center p-24">
           <div className="w-1/4">
                <Scoreboard></Scoreboard>
                <Camera></Camera>
            </div> 
            <div className="w-1/2">
                <div>Hints</div>
                <Canvas></Canvas>
                <div>Timer</div>
            </div> 
            <div className="w-1/4">
                <Guesses></Guesses>
                <div>Invite more people: </div>
            </div> 
        </div>
    );
}
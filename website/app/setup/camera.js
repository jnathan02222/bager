import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useState, useRef, useEffect } from "react";
export default function Camera(props){
    const landmarkColors = {
        4 : ["white", "black"], //Thumb
        8 : ["black", "black"], //Pointer
        12: ["red", "red"],     //Middle
        16: ["green", "green"], //Ring
        20: ["blue", "blue"]    //Pinky
    }
    
    //Initialization
    const [webcamSupported, setWebcamSupported] = useState(true);
    const handLandmarker = useRef(null);
    const createHandLandmarker = async () => {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        handLandmarker.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: 'VIDEO',
          numHands: 2
        });
    };
    useEffect(() => {
        createHandLandmarker();
        setWebcamSupported(!!navigator.mediaDevices?.getUserMedia);
        return () => {
            handLandmarker.current = null;
        }
    }, []);

    //Recording
    const [recording, setRecording] = useState(false);
    const lastVideoTime = useRef(-1);
    const results = useRef(undefined);
    const enableCam = () => {
        if(handLandmarker.current === null){
            return
        }
        setRecording(true);
        navigator.mediaDevices.getUserMedia({video: true}).then(
            (stream) => {
                const video = document.getElementById("webcam");
                video.srcObject = stream;
                video.addEventListener("loadeddata", predictWebcam);
            }
        )
    }
    async function predictWebcam() {
        const video = document.getElementById("webcam");
        const canvasElement = document.getElementById("output_canvas");
        const canvasCtx = canvasElement.getContext("2d");

        canvasElement.style.width = video.videoWidth;
        canvasElement.style.height = video.videoHeight;
        canvasElement.width = video.offsetWidth;
        canvasElement.height = video.offsetHeight;

        let coords = {};
        
        let startTimeMs = performance.now();
        if (lastVideoTime.current !== video.currentTime) {
            lastVideoTime.current = video.currentTime;
            results.current = handLandmarker.current.detectForVideo(video, startTimeMs);
        }
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        if (results.current.landmarks) {
            for (const landmarks of results.current.landmarks) {
                let index = 0;
                for (const point of landmarks){

                    if(index % 4 == 0 && index !== 0){
                        canvasCtx.beginPath();
                        canvasCtx.arc(point.x * video.offsetWidth, point.y * video.offsetHeight, 10, 0, 2 * Math.PI);
                        canvasCtx.fillStyle = landmarkColors[index][0];
                        canvasCtx.strokeStyle = landmarkColors[index][1];
                        canvasCtx.lineWidth = 4;
                        canvasCtx.fill();
                        canvasCtx.stroke();
                        coords[index] = [point.x, point.y];
                    }
                    index += 1
                }
            }
        }
        if(props.startCamera){
            props.getCoords(coords);
        }
        canvasCtx.restore();
        window.requestAnimationFrame(predictWebcam);
    }

    return (
        <div style={{minWidth:320, minHeight:240}} className='rounded-3xl flex justify-center items-center'>
            <video id="webcam" autoPlay={true} playsInline={true} className="rounded-2xl -z-10 -scale-x-[1]"></video>
            <canvas id="output_canvas" className="absolute -scale-x-[1] z-10"></canvas>
            <div className="absolute">{webcamSupported ? "" : "Webcam is not supported by your browser"}</div>
            {(!recording) && <button className="absolute p-2 border-4 rounded-md z-20" onClick={enableCam}>Start Recording</button>}
        </div>
    );
}
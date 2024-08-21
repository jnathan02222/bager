import { FilesetResolver, HandLandmarker, GestureRecognizer } from "@mediapipe/tasks-vision";
import { useState, useRef, useEffect } from "react";
import { ColorRing } from 'react-loader-spinner'

export default function Camera(props){
    const landmarkColors = {
        4 : ["gray", "gray"], //Thumb
        8 : ["black", "white"], //Pointer
        12: ["magenta", "red"],     //Middle
        16: ["yellow", "green"], //Ring
        20: ["cyan", "blue"]    //Pinky
    }
    const indexToFinger = {
        4 : "thumb",
        8 : "pointer",
        12: "middle",
        16: "ring",
        20: "pinky"
    }
    
    //Initialization
    const [webcamSupported, setWebcamSupported] = useState(true);
    const [loading, setLoading] = useState(true);
    const handLandmarker = useRef(null);
    const gestureRecognizer = useRef(null);
    const recordingRef = useRef(false);
    const videoElem = useRef(null);
    const canvasElem = useRef(null);


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
          numHands: 1
        });
        gestureRecognizer.current = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
                delegate: "GPU"
            },
            runningMode: 'VIDEO'
        });
        
        if(props.startCamera){
            if(!recordingRef.current)
                enableCam();
            recordingRef.current = true;
        }else{
            setLoading(false);
        }
        
    };
    useEffect(() => {
        createHandLandmarker(animationFrameId.current);
        setWebcamSupported(!!navigator.mediaDevices?.getUserMedia);
        return () => {
            handLandmarker.current = null;
            gestureRecognizer.current = null;
        }
    }, []);

    


    //Recording
    const [recording, setRecording] = useState(false);
    const [gesture, setGesture] = useState(undefined);
    const lastVideoTime = useRef(-1);
    const results = useRef(undefined);
    const animationFrameId = useRef(null);
    const palette = useRef(0);

    const enableCam = () => {
        if(handLandmarker.current === null || gestureRecognizer.current == null){
            return
        }
        setRecording(true);
        setLoading(true);
        navigator.mediaDevices.getUserMedia({video: true}).then(
            (stream) => {
                const video = videoElem.current;
                if(!video){
                    return;
                }
                video.srcObject = stream;
                video.addEventListener("loadeddata", predictWebcam);
            }
        )
    }
    async function predictWebcam() {
        setLoading(false);
        const video = videoElem.current;
        const canvasElement = canvasElem.current;
        let canvasCtx = undefined;
        try {
            canvasCtx = canvasElement.getContext("2d");
        }catch{
            return;
        }
        

        canvasElement.style.width = video.videoWidth;
        canvasElement.style.height = video.videoHeight;
        canvasElement.width = video.offsetWidth;
        canvasElement.height = video.offsetHeight;

        let coords = {};
        
        let startTimeMs = performance.now();
        let gesture;
        if (lastVideoTime.current !== video.currentTime) {
            lastVideoTime.current = video.currentTime;
            results.current = handLandmarker.current.detectForVideo(video, startTimeMs);

            const gestureInfo = gestureRecognizer.current.recognizeForVideo(video, startTimeMs);
            if(gestureInfo.gestures.length > 0){
                gesture = gestureInfo.gestures[0][0].categoryName.replace("_", " ");
                if(gesture == "Pointing Up"){
                    palette.current = 0;
                }else if(gesture == "Victory"){
                    palette.current = 1;
                }   

                setGesture(gesture);
            }else{
                setGesture("None");
            }
        }
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        if (results.current.landmarks) {
            for (const landmarks of results.current.landmarks) {
                let index = 0;
                for (const point of landmarks){

                    if(index % 4 == 0 && index !== 0){
                        canvasCtx.beginPath();
                        canvasCtx.arc(point.x * video.offsetWidth, point.y * video.offsetHeight, video.offsetWidth/50, 0, 2 * Math.PI); //Math.abs(point.z)*50 or video.offsetWidth/50
                        canvasCtx.fillStyle = landmarkColors[index][palette.current];
                        canvasCtx.strokeStyle = landmarkColors[index][palette.current];
                        canvasCtx.lineWidth = 4;
                        canvasCtx.fill();
                        canvasCtx.stroke();
                        coords[indexToFinger[index]] = {x:point.x, y:point.y, z:point.z};
                    }
                    index += 1
                }
            }
        }
        if(props.startCamera){
            var colors = {};
            for(const key in indexToFinger){
                colors[indexToFinger[key]] = landmarkColors[key][palette.current];
            }
            props.getCoords(coords, colors, gesture=="Thumb Down");
        }
        canvasCtx.restore();
        animationFrameId.current = window.requestAnimationFrame(predictWebcam);
    }

    return (
        <div>
            <div className='rounded-3xl flex justify-center items-center'>
                <video ref={videoElem} id="webcam" autoPlay={true} playsInline={true} className="rounded-2xl -z-10 -scale-x-[1]"></video>
                <canvas ref={canvasElem} id="output_canvas" className="absolute -scale-x-[1] z-10"></canvas>
                <div className="absolute ">
                    <ColorRing  visible={loading} height="40" width="40" ariaLabel="tail-spin-loading" colors={["#625366", "#625366", "#625366", "#625366", "#625366"]}/>
                </div>
                <div className="absolute">{webcamSupported ? "" : "Webcam is not supported by your browser"}</div>
                {(!recording && !props.startCamera && !loading) && <button className="absolute p-2 border-4 rounded-md z-20" onClick={enableCam}>Start Recording</button>}
            </div>
            <div>{gesture}</div>
        </div>
    );
}
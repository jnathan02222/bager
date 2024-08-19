//import { createRoot } from 'react-dom/client';
import { Stage, Layer, Line, Text } from 'react-konva';
import { useState, useRef, useEffect } from "react";

export default function Canvas({coords}){
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const handleResize = ()=>{
      setWidth(canvasRef.current.offsetWidth);
      setHeight(0.75 * canvasRef.current.offsetWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
    
  }, []);

  const pointingThreshold = 3;
  const colors = {
    "thumb" : "white",
    "pointer" : "black",
    "middle" : "red",
    "ring" : "green",
    "pinky" : "blue"
  }

  const [lines, setLines] = useState([]);
  const isDrawing = useRef({
      "thumb" : false,
      "pointer" : false,
      "middle" : false,
      "ring" : false,
      "pinky" : false
  });

  function getDistance(palm, finger){
    return Math.sqrt(Math.pow((palm.x-finger.x),2) + Math.pow((palm.y-finger.y),2))/Math.abs(finger.z);
  }
  useEffect(()=>{
    console.log(isDrawing.current)
    if("palm" in coords){
      for(const finger in coords){
        if(finger != "palm"){
          if(getDistance(coords["palm"], coords[finger]) > pointingThreshold){
            handleMouseDown(finger, coords[finger]);
          }else{
            handleMouseUp(finger);
          }
          handleMouseMove(finger, coords[finger]);
        }
      }
    }
  }, [coords]);

  const handleMouseDown = (finger, point) => {
    if(isDrawing.current[finger]){
      return;
    }
    isDrawing.current[finger] = true;

    setLines([...lines, { finger: finger, points: [point.x , point.y] }]);
  };
  const handleMouseMove = (finger, point) => {
    // no drawing - skipping
    if (!isDrawing.current[finger]) {
      return;
    }
    let lastLine = undefined;
    var i = lines.length - 1; 
    for( ; i >= 0; i--){
      if(lines[i].finger == finger){
        lastLine = lines[i];
        break;
      }
    }
    // add point
    if(!lastLine)return;
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(i, 1, lastLine);
    setLines(lines.concat());
  };
  const handleMouseUp = (finger) => {
    isDrawing.current[finger] = false;
  };

  

  return (
    <div ref={canvasRef} id='canvas' className='w-full border-4 border-black m-10 stage-canvas rounded-md -scale-x-[1] z-10 overflow-hidden	'>
      <Stage
        width={width}
        height={height}
        
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points.map((point, i) => {
                if(i % 2 == 0){
                  return point * width;
                }
                return point * height;
              })}
              stroke={colors[line.finger]}
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.finger === 'thumb' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
      
    </div>
  );
};


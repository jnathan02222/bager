import { Stage, Layer, Line, Circle } from 'react-konva';
import { useState, useRef, useEffect } from "react";

export default function Canvas({coords, colors, clearCanvas}){
  const [lines, setLines] = useState([]);

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

  const pointingThreshold = 1;
 

  
  const isDrawing = useRef({
      "pointer" : false,
      "middle" : false,
      "ring" : false,
      "pinky" : false
  });

  function getDistance(thumb, finger){
    return Math.sqrt(Math.pow((thumb.x-finger.x),2) + Math.pow((thumb.y-finger.y),2))/Math.abs(finger.z);
  }
  useEffect(()=>{
    if("thumb" in coords){
      for(const finger in coords){
        if(coords[finger] === null){
          continue;
        }
        if(finger != "thumb"){
          if(getDistance(coords["thumb"], coords[finger]) < pointingThreshold){
            handleMouseDown(finger, coords[finger]);
          }else{
            handleMouseUp(finger);
          }
          handleMouseMove(finger, coords[finger]);
        }
      }
    }
  }, [coords]);
  useEffect(()=>{
    setLines((prev)=>[]);
    isDrawing.current = {
      "pointer" : false,
      "middle" : false,
      "ring" : false,
      "pinky" : false
    }
  }, [clearCanvas])

  const prevColors = useRef(colors);
  useEffect(()=>{
    if(prevColors.current["pointer"] != colors["pointer"]){
      isDrawing.current = {
        "pointer" : false,
        "middle" : false,
        "ring" : false,
        "pinky" : false
      }
      prevColors.current = colors;
    }
    
  }, [colors]);

  const sensitivity = 0.2;

  const handleMouseDown = (finger, point) => {
    if(isDrawing.current[finger]){
      return;
    }
    isDrawing.current[finger] = true;
    setLines(prev=>[...prev, { finger: finger, color : colors[finger], points: [point.x , point.y] }]);
  };
  
  const handleMouseMove = (finger, point) => {
    // no drawing - skipping
    if (!isDrawing.current[finger]) {
      return;
    }

    setLines(prev=>{
    if(!prev)return prev;

    let lastLine = undefined;

    var i = prev.length - 1; 
    for( ; i >= 0; i--){
      if(prev[i].finger == finger){
        lastLine = prev[i];
        break;
      }
    }
    // add point
    if(!lastLine)return prev;
    let lastPoint = {x: lastLine.points[lastLine.points.length - 4], y: lastLine.points[lastLine.points.length - 3]};
    if(lastPoint.x == undefined){
      lastLine.points = lastLine.points.concat([point.x, point.y]);
    } else if (getDistance(lastPoint, point) > sensitivity){
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      // replace last
      prev.splice(i, 1, lastLine);
      return prev.concat();
    }
    return prev;
    });
  }
  const handleMouseUp = (finger) => {
    isDrawing.current[finger] = false;
  };
  function showFingers(){
    var circles = [];
    for(const finger in coords){
      if(coords[finger] === null){
        continue;
      }
      if(finger != "thumb" && isDrawing.current[finger]){
        circles.push(<Circle key={finger} x={coords[finger].x * width} y={coords[finger].y * height} width={colors[finger] == "white" ? 40 : 20} height={colors[finger] == "white" ? 40 : 20} fill={colors[finger]} stroke="black"></Circle>);
      }
    }
    return circles;     
  }

  useEffect(()=>{
    
  }, [lines])

  return (
    <div ref={canvasRef}  className='w-full border-4 border-black m-10 stage-canvas rounded-md -scale-x-[1] z-10 overflow-hidden	'>
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
              stroke={line.color}
              strokeWidth={line.color == "white" ? 40 : 10}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            
            />
          ))}
        </Layer>
        <Layer>
          {showFingers()}
        </Layer>
      </Stage>
      
    </div>
  );
};


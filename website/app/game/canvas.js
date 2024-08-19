//import { createRoot } from 'react-dom/client';
import { Stage, Layer, Line, Text } from 'react-konva';
import { useState, useRef, useEffect } from "react";
import { prototype } from 'postcss/lib/at-rule';

// export default function Canvas(){
//     return (
//         <canvas id='output_canvas' className='w-full h-4/5 border-4 border-black p-5 m-10'></canvas>
//     );
// }

export default function Canvas(props){
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const coords = props.coords;

  const handleMouseDown = (e) => {

    if (coords && Object.keys(coords).length !== 0) {
      //const pos = e.target.getStage().getPointerPosition();
      //setLines([...lines, { tool, points: [pos.x, pos.y] }]);
      setLines([...lines, { tool, points: [width-coords[8][0]*width, coords[8][1]*height] }]);
      isDrawing.current = true;
      console.log(lines)
      if(lines.length !==0){
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([width-coords[8][0]*width, coords[8][1]*height]);
        lines.splice(lines.length - 1, 1, lastLine);  
      }
    } else {
      return;
    }
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current || !coords || Object.keys(coords).length === 0) {
      return;
    }

    // let lastLine = lines[lines.length - 1];
    // lastLine.points = lastLine.points.concat([width-coords[8][0]*width, coords[8][1]*height]);
    // lines.splice(lines.length - 1, 1, lastLine);
    // setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
      const resizeObserver = new ResizeObserver((event) => {
          setWidth(event[0].contentBoxSize[0].inlineSize);
          setHeight(event[0].contentBoxSize[0].blockSize);
      });

      resizeObserver.observe(document.getElementById("canvas"));
  });

  return (
    <div id='canvas' className='w-full h-4/5 border-4 border-black m-10 stage-canvas'>
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
      {/* <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select> */}
    </div>
  );
};


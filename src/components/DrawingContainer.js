import React, { useState, useRef } from "react";
import { Stage } from "react-konva";
import Drawing  from "./Drawing";
import BackgroundLayer from "./BackgroundLayer";
import { CirclePicker, HuePicker } from 'react-color';
import { MapMode, ColorList } from "./constants";
import IconButton, { IconToggle } from '@material/react-icon-button';
import MaterialIcon from '@material/react-material-icon'
import '@material/react-icon-button/dist/icon-button.css';

let history = [[]];
let historyStep = 0;
const mapSize = 500;

const DrawingContainer = () => {
  const [lines, setLines] = useState([])
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState("red")
  const [mapMode, setMapMode] = useState(MapMode.Drawing)
  const stageRef = useRef(null);

  const handleUndo = () => {
    if (historyStep === 0) {
      return;
    }
    historyStep -= 1;
    const previous = history[historyStep];
    setLines(previous);
  };

  const handleRedo = () => {
    if (historyStep === history.length - 1) {
      return;
    }
    historyStep += 1;
    const next = history[historyStep];
    setLines(next);
  };

  const handleMouseDown = () => {
    setDrawing(true);
    // add line
    setLines([...lines, []]);
  };

  const handleMouseMove = e => {
    // no drawing - skipping
    if (!drawing) {
      return;
    }
    const stage = stageRef.current.getStage();
    const point = stage.getPointerPosition();

    let lastLine = lines[lines.length - 1];
    // add point
    let newLines = lastLine.concat([point.x, point.y]);
    newLines.storke = color;
    // replace last
    lines.splice(lines.length - 1, 1, newLines);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    //add to history
    history.push(lines);
    historyStep += 1;

    setDrawing(false);
  };

  const handleColorChange = (value, event) => {
    setColor(value.hex)
  }
  return (
    <div className="drawing--container" >
      <div className="toolbar">

        <IconButton className="mx-5" onClick={handleUndo}>
          <MaterialIcon style={{ color: "white" }} icon='Undo' />
        </IconButton>
        <IconButton className="mb-3" onClick={handleRedo}>
          <MaterialIcon style={{ color: "white" }} icon='Redo' />
        </IconButton>

        <CirclePicker
          width="30px"
          circleSpacing={3}
          colors={ColorList}
          onChange={handleColorChange} />
      </div>

      <div className={`${mapMode === MapMode.Drawing ? "drawing" : ""}`}>
        <Stage
          width={mapSize}
          height={mapSize}
          onContentMousedown={handleMouseDown}
          onContentMousemove={handleMouseMove}
          onContentMouseup={handleMouseUp}
          ref={stageRef}
        >
           <BackgroundLayer mapSize={mapSize} />
          {
            mapMode === MapMode.Drawing && (
              <Drawing mapSize={mapSize} lines={lines} storke={color} />
            )
          }
        </Stage>
      </div>
    </div>
  );
}

export default DrawingContainer;

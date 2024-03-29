import "./Grid.css";

import Cell from "./Cell";
import {
  CellId, PLACEABLE_COLOR_MAPPINGS_TYPE,
} from "../Utility/types";
import React, { useEffect, useState } from "react";
import Graph from "../Algorithms/Graph/Graph";
import { ALL_COLOR_MAPPINGS, PLACEABLE_COLOR_MAPPINGS } from "../Utility/constants";
import { createCellId } from "../Utility/CellId";

interface GridProps {
  graph: Graph;
  height: number;
  width: number;
  currentCellToPlace: PLACEABLE_COLOR_MAPPINGS_TYPE | null;
  sourceCellId: CellId | null;
  targetCellId: CellId | null;
  setSourceCellId: (value: CellId | null) => void;
  setTargetCellId: (value: CellId | null) => void;
}

export default function Grid({
  graph,
  height,
  width,
  currentCellToPlace,
  sourceCellId,
  targetCellId,
  setSourceCellId,
  setTargetCellId,
}: GridProps) {
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  function generateRow(width: number, y: number) {
    var cells: Cell[] = [];
    for (var x = 0; x < width; x++) {
      cells.push(
        <Cell
          key={JSON.stringify(createCellId(y, x))}
          graph={graph}
          cellId={createCellId(y, x)}
          mouseDown={mouseDown}
          currentCellToPlace={currentCellToPlace}
          sourceCellId={sourceCellId}
          targetCellId={targetCellId}
          setSourceCellId={setSourceCellId}
          setTargetCellId={setTargetCellId}
          height={height}
          width={width}
        />
      );
    }
    return <tr key={`${y}`}>{cells}</tr>;
  }

  function generateTable(height: number, width: number) {
    var rows: JSX.Element[] = [];
    for (var y = 0; y < height; y++) {
      //var row = <tr id={`grid-row-${y}`}></tr>;
      var currentRow = generateRow(width, y);
      rows.push(currentRow);
    }
    return (
      <table
        className="grid hover:cursor-pointer"
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => {setMouseDown(false)}}
      >
        <tbody>{rows}</tbody>
      </table>
    );
  }
  return <>{generateTable(height, width)}</>;
}

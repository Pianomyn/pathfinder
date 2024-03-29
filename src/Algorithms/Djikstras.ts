import { CellId } from "../Utility/types";
import Algorithm from "./AlgorithmTemplate";
import Graph from "./Graph/Graph";
import Node from "./Graph/Node";
import { Heap } from "heap-js";
import { cellIdIsEqual, createCellId } from "../Utility/CellId";
import {
  ALL_COLOR_MAPPINGS,
  COLOR_WEIGHT_MAPPINGS,
} from "../Utility/constants";

export default class Djikstras extends Algorithm {
  minHeap: Heap<[number, CellId]>; // Cost is measured in manhattan dist to target
  distanceMatrix: number[][];

  constructor(graph: Graph, animationDelay: number) {
    super(graph);
    this.animationDelay = animationDelay;
    this.minHeap = new Heap((a, b) => a[0] - b[0]);
    this.distanceMatrix = this.createDistanceMatrix();
  }

  setGraph(graph: Graph) {
    this.graph = graph;
  }

  createDistanceMatrix() {
    const height = this.graph.getGraphHeight();
    const width = this.graph.getGraphWidth();
    var distMatrix = [];

    for (var r = 0; r < height; r++) {
      let distRow: number[] = [];
      for (var c = 0; c < width; c++) {
        distRow.push(Number.MAX_SAFE_INTEGER);
      }
      distMatrix.push(distRow);
    }

    return distMatrix;
  }

  setAnimationDelay(animationDelay: number) {
    this.animationDelay = animationDelay;
  }

  reset() {
    this.minHeap.clear()

    const height = this.graph.getGraphHeight();
    const width = this.graph.getGraphWidth();

    for (var r = 0; r < height; r++) {
      for (var c = 0; c < width; c++) {
        this.distanceMatrix[r][c] = Number.MAX_SAFE_INTEGER
      }
    }
  }

  findPath() {
    var sourceCellId = this.graph.getSourceCellId();
    var targetCellId = this.graph.getTargetCellId();

    if (!sourceCellId || !targetCellId) {
      window.alert(
        "Please make sure both a source and target cell have been placed"
      );
      return;
    }

    this.minHeap.add([0, sourceCellId]);
    this.distanceMatrix[sourceCellId.y][sourceCellId.x] = 0

    while (!this.minHeap.isEmpty()) {
      const pair = this.minHeap.pop();
      if (pair === undefined) {
        // Not necessary, but TS interpreter complains
        break;
      }
      const [cost, currCoords] = pair;

      // Visit current node
      this.expanded.push(this.graph.getNode(currCoords));

      if (cellIdIsEqual(currCoords, targetCellId)) {
        break;
      }

      // Add node neighbours
      this.getNeighbours(currCoords).forEach((neighbour) => {
        if (targetCellId === null) return; // Not sure why TS interpreter needs this.
        var newCost = cost;
        newCost += this.graph.getNode(neighbour).getIsWeight()
          ? COLOR_WEIGHT_MAPPINGS.Weight
          : COLOR_WEIGHT_MAPPINGS.Unvisited;
        if (this.distanceMatrix[neighbour.y][neighbour.x] > newCost) {
          this.distanceMatrix[neighbour.y][neighbour.x] = newCost;
          this.minHeap.push([newCost, neighbour]);
          this.graph.getNode(neighbour).setPreviouslyVisitedCellId(currCoords);
        }
      });
    }
  }

  getNeighbours(coords: CellId) {
    const dirs = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    var validNeighbours: CellId[] = [];

    dirs.forEach((d) => {
      var newX = coords.x + d[0];
      var newY = coords.y + d[1];

      if (
        newX >= 0 &&
        newX < this.graph.getGraphWidth() &&
        newY >= 0 &&
        newY < this.graph.getGraphHeight() &&
        !this.graph.getNode(createCellId(newY, newX)).getIsWall()
      ) {
        validNeighbours.push({ y: newY, x: newX });
      }
    });

    return validNeighbours;
  }
}

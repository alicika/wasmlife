import { Universe ,Cell } from "wasmlife";
import { memory } from "wasmlife/wasmlife_bg";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#efe42c";
const DEAD_COLOR = "#e22323";
const ALIVE_COLOR = "rgba(36,17,17,0.85)";

// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

let animationId= null;

const renderLoop = () => {
    // debugger;
    fps.render();
    drawGrid();
    drawCells();
    universe.tick();

    animationId = requestAnimationFrame(renderLoop);
};

const isPaused = () => {
    return animationId == null;
};

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

const getIndex = (row, column) => {
    return row * width + column;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = cells[idx] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

const playPauseButton = document.getElementById("play-pause");

const play = () => {
    playPauseButton.textContent = "■";
    renderLoop();
};

const pause = () => {
    playPauseButton.textContent = "▶";
    cancelAnimationFrame(animationId);
    animationId = null;
}

canvas.addEventListener("click", event => {
    const boundingRect = canvas.getBoundingClientRect();
  
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;
  
    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;
  
    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);
  
    universe.toggle_cell(row, col);
  
    drawGrid();
    drawCells();
  });

// This is used for `requestAnimationFrame(renderLoop)`.
play();

const fps = new class {
    constructor() {
      this.fps = document.getElementById("fps");
      this.frames = [];
      this.lastFrameTimeStamp = performance.now();
    }
}

const fps = new class {
    constructor() {
      this.fps = document.getElementById("fps");
      this.frames = [];
      this.lastFrameTimeStamp = performance.now();
    }
  
    render() {
      const now = performance.now();
      const delta = now - this.lastFrameTimeStamp;
      this.lastFrameTimeStamp = now;
      const fps = 1 / delta * 1000;
  
      this.frames.push(fps);
      if (this.frames.length > 100) {
        this.frames.shift();
      }
  
      let min = Infinity;
      let max = -Infinity;
      let sum = 0;
      
      for (let i = 0; i < this.frames.length; i++) {
        sum += this.frames[i];
        min = Math.min(this.frames[i], min);
        max = Math.max(this.frames[i], max);
      }
      let mean = sum / this.frames.length;
  
      this.fps.textContent = `
  Frames per Second:
           latest = ${Math.round(fps)}
  avg of last 100 = ${Math.round(mean)}
  min of last 100 = ${Math.round(min)}
  max of last 100 = ${Math.round(max)}
  `.trim();
    }
  };
import "./style.css";

import { 
  VertexShaderSource, 
  UpdateFragmentShaderSource, 
  DisplayFragmentShaderSource, 
} from './shaders';

import { 
  getRelativeMousePos,
  createTexture,
  createProgram, 
  createShader, 
  initWebGL 
} from "./utils";

let width = 1024;
let height = 768;
let isRandomGridInit = false;

let isDrawing = false;
let aliveCells = [];

const setupControlButtons = (canvas) => {
  const clearGridBtn = document.getElementById("clearGridBtn");
  const randomGridBtn = document.getElementById("randomGridBtn");
  
  clearGridBtn.addEventListener("click", () => {
    isRandomGridInit = false;
    initApp(canvas);
  });

  randomGridBtn.addEventListener("click", () => {
    isRandomGridInit = true;
    initApp(canvas);
  });
}

const setupControlSize = (canvas) => {
  const widthInput = document.getElementById("widthInput");
  widthInput.value = width;

  const heightInput = document.getElementById("heightInput");
  heightInput.value = height;

  const updateSizeBtn = document.getElementById("updateSizeBtn");
  updateSizeBtn.addEventListener(("click"), () => {
    const updatedWidth = widthInput.value;
    const updatedHeight = heightInput.value;

    if (updatedWidth !== width || updatedHeight !== height) {
      width = updatedWidth;
      height = updatedHeight;

      initApp(canvas);
      return;
    }
  });
}

const setupDrawingCells = (canvas) => {
  const startDraw = (event) => { 
    isDrawing = true 
    aliveCells.push(getRelativeMousePos(canvas, event));
  };

  const draw = (event) => {
     if (isDrawing) aliveCells.push(getRelativeMousePos(canvas, event));
  }

  const stopDraw = () => { 
    aliveCells = [];
    isDrawing = false 
  };

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);
}


const setup = () => {
  const canvas = document.getElementById("app-canvas");
  
  setupControlButtons(canvas);
  setupControlSize(canvas);
  setupDrawingCells(canvas);
  
  initApp(canvas);
}


const initApp = (canvas) => {
  canvas.width = width; 
  canvas.height = height;

  const glCtx = initWebGL(canvas);
  if (!glCtx) return;

  // Shader for calc next Game Of Life state
  const updateVertexShader = createShader(glCtx, glCtx.VERTEX_SHADER, VertexShaderSource);
  const updateFragmentShader = createShader(glCtx, glCtx.FRAGMENT_SHADER, UpdateFragmentShaderSource);
  const updateShaderProgram = createProgram(glCtx, updateVertexShader, updateFragmentShader);

  // Shader for display current game state
  const displayVertexShader = createShader(glCtx, glCtx.VERTEX_SHADER, VertexShaderSource);
  const displayFragmentShader = createShader(glCtx, glCtx.FRAGMENT_SHADER, DisplayFragmentShaderSource);
  const displayShaderProgram = createProgram(glCtx, displayVertexShader, displayFragmentShader);

  let updateTexture = createTexture(glCtx, width, height, isRandomGridInit);
  let displayTexture = createTexture(glCtx, width, height);
 
  const vertices = [
     1.0,  1.0, 
    -1.0,  1.0,
     1.0, -1.0,
    -1.0, -1.0,
  ];
  
  const vertexBuffer = glCtx.createBuffer();
  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, vertexBuffer);
  glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array(vertices), glCtx.STATIC_DRAW);

  const verticesPosition = glCtx.getAttribLocation(displayShaderProgram, 'aPosition');
  glCtx.enableVertexAttribArray(verticesPosition);
  glCtx.vertexAttribPointer(verticesPosition, 2, glCtx.FLOAT, false, 0, 0);

  const frameBuffer = glCtx.createFramebuffer();
  const cellWidthLoc = glCtx.getUniformLocation(updateShaderProgram, "uCellWidth");
  const cellHeightLoc = glCtx.getUniformLocation(updateShaderProgram, "uCellHeight");
  const reviveLoc = glCtx.getUniformLocation(updateShaderProgram, "uRevive");
  glCtx.activeTexture(glCtx.TEXTURE0);

  const FPS = 60;
  const millisecondsPerFrame = 1000 / FPS;
  let lastFrameTime = 0;

  const render = (currentTime) => {
    requestAnimationFrame(render);

    const deltaTime = currentTime - lastFrameTime;

    if (deltaTime > millisecondsPerFrame) {
      glCtx.clearColor(0.0, 0.0, 0.0, 1.0);
      glCtx.clear(glCtx.COLOR_BUFFER_BIT);

      glCtx.useProgram(updateShaderProgram);
      glCtx.uniform1f(cellWidthLoc, 1.0 / width);
      glCtx.uniform1f(cellHeightLoc, 1.0 / height);
      glCtx.uniform2f(reviveLoc, -1, -1);

      let revive = [-1, -1];
      if (isDrawing) {
        if (aliveCells.length > 0) {
          const currentCell = aliveCells.shift();
          revive[0] = (currentCell.xPos / width);
          revive[1] = 1.0 - (currentCell.yPos / height);
        }
      } 
      glCtx.uniform2f(reviveLoc, revive[0], revive[1]);

      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, frameBuffer);
      glCtx.framebufferTexture2D(glCtx.FRAMEBUFFER, glCtx.COLOR_ATTACHMENT0, glCtx.TEXTURE_2D, displayTexture, 0);
      glCtx.viewport(0, 0, width, height);
      glCtx.bindTexture(glCtx.TEXTURE_2D, updateTexture);
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);
      glCtx.useProgram(null);
      glCtx.framebufferTexture2D(glCtx.FRAMEBUFFER, glCtx.COLOR_ATTACHMENT0, glCtx.TEXTURE_2D, null, 0);
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, null);

      glCtx.useProgram(displayShaderProgram);
      glCtx.viewport(0, 0, width, height);
      glCtx.bindTexture(glCtx.TEXTURE_2D, updateTexture);
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);
      glCtx.bindTexture(glCtx.TEXTURE_2D, null);
      glCtx.useProgram(null);

      [displayTexture, updateTexture] = [updateTexture, displayTexture];

      lastFrameTime = currentTime - (deltaTime % millisecondsPerFrame);
    }
  };

  requestAnimationFrame(render);
};

setup();

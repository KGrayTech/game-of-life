import "./style.css";

import { 
  VertexShaderSource, 
  UpdateFragmentShaderSource, 
  DisplayFragmentShaderSource, 
} from './shaders';

import { 
  createIdentityMatrix,
  createTexture,
  createProgram, 
  createShader, 
  initWebGL 
} from "./utils";

const canvasWidth = 1024;
const canvasHeight = 1024;

const initApp = () => {
  const canvas = document.getElementById("app-canvas");
  canvas.width = canvasWidth; //window.innerWidth;
  canvas.height = canvasHeight; //window.innerHeight;

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

  let updateTexture = createTexture(glCtx, canvasWidth, canvasHeight, true);
  let displayTexture = createTexture(glCtx, canvasWidth, canvasHeight);
 
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
  const transformMatrixLoc = glCtx.getUniformLocation(updateShaderProgram, "uTransformMatrix");
  const displayTransformMatrixLoc = glCtx.getUniformLocation(displayShaderProgram, "uTransformMatrix");
  glCtx.activeTexture(glCtx.TEXTURE0);

  const FPS = 144;
  const millisecondsPerFrame = 1000 / FPS;
  let lastFrameTime = 0;

  const render = (currentTime) => {
    requestAnimationFrame(render);

    const deltaTime = currentTime - lastFrameTime;

    if (deltaTime > millisecondsPerFrame) {

      glCtx.clearColor(0.0, 0.0, 0.0, 1.0);
      glCtx.clear(glCtx.COLOR_BUFFER_BIT);

      glCtx.useProgram(updateShaderProgram);
      glCtx.uniform1f(cellWidthLoc, 1.0 / canvas.width);
      glCtx.uniform1f(cellHeightLoc, 1.0 / canvas.width);
      glCtx.uniformMatrix4fv(transformMatrixLoc, glCtx.FALSE, createIdentityMatrix());

      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, frameBuffer);
      glCtx.framebufferTexture2D(glCtx.FRAMEBUFFER, glCtx.COLOR_ATTACHMENT0, glCtx.TEXTURE_2D, displayTexture, 0);
      glCtx.viewport(0, 0, canvasWidth, canvasHeight);
      glCtx.bindTexture(glCtx.TEXTURE_2D, updateTexture);
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);
      glCtx.useProgram(null);
      glCtx.framebufferTexture2D(glCtx.FRAMEBUFFER, glCtx.COLOR_ATTACHMENT0, glCtx.TEXTURE_2D, null, 0);
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, null);

      glCtx.useProgram(displayShaderProgram);
      glCtx.viewport(0, 0, canvasWidth, canvasHeight);
      glCtx.uniformMatrix4fv(displayTransformMatrixLoc, glCtx.FALSE, createIdentityMatrix());
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

initApp();

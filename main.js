import "./style.css";
import { createProgram, createShader, initWebGL } from "./utils";

const vertexShaderSource = `
  precision mediump float;

  attribute vec2 aPosition;
  attribute vec2 aTexCoord;

  uniform vec2 uResolution;

  varying vec2 vTexCoord;

  void main() {
    vTexCoord = aTexCoord;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 vTexCoord;

  uniform vec2 uResolution;

  void main() {
    vec2 uv = vTexCoord;
    uv.x *= uResolution.x / uResolution.y;

    float d = length(uv);
    float c = d;

    if (d < 0.3) c = 1.0;
    else c = 0.0;

    gl_FragColor = vec4(vec3(c), 1.0);
  }
`;

const initApp = () => {
  const canvas = document.getElementById("app-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const glCtx = initWebGL(canvas);
  glCtx.viewport(0, 0, canvas.width, canvas.height);

  if (!glCtx) return;

  const vertexShader = createShader(
    glCtx,
    glCtx.VERTEX_SHADER,
    vertexShaderSource,
  );
  const fragmentShader = createShader(
    glCtx,
    glCtx.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  const shaderProgram = createProgram(glCtx, vertexShader, fragmentShader);
  glCtx.useProgram(shaderProgram);

  const resolutionUniformLocation = glCtx.getUniformLocation(shaderProgram, "uResolution");
  glCtx.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
 
  const texCoordBuffer = glCtx.createBuffer();
  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, texCoordBuffer);
  glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 1.0
  ]), glCtx.STATIC_DRAW);
  const texCoordLocation = glCtx.getAttribLocation(shaderProgram, "aTexCoord");


  const positionBuffer = glCtx.createBuffer();
  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, positionBuffer);
  const vertices = [
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    1.0, 1.0
  ]
  glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array(vertices), glCtx.STATIC_DRAW);
  const positionAttributeLocation = glCtx.getAttribLocation(shaderProgram, "aPosition");

  glCtx.enableVertexAttribArray(positionAttributeLocation);
  glCtx.enableVertexAttribArray(texCoordLocation);

  glCtx.vertexAttribPointer(positionAttributeLocation, 2, glCtx.FLOAT, false, 0, 0);
  glCtx.vertexAttribPointer(texCoordLocation, 2, glCtx.FLOAT, false, 0, 0);

  glCtx.clearColor(0.0, 0.0, 0.0, 1.0);
  glCtx.clear(glCtx.COLOR_BUFFER_BIT);
  glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);

  glCtx.disableVertexAttribArray(positionAttributeLocation);
  glCtx.disableVertexAttribArray(texCoordLocation);
};

initApp();

import "./style.css";
import { createProgram, createShader, initWebGL } from "./utils";

const vertexShaderSource = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

const initApp = () => {
  const canvas = document.getElementById("app-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const glCtx = initWebGL(canvas);

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

  const positionAttributeLocation = glCtx.getAttribLocation(shaderProgram, "a_position");
  const positionBuffer = glCtx.createBuffer();

  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, positionBuffer);

  const positions = [
    0.0,
    0.5,
    -0.5,
    -0.5,
    0.5,
    -0.5,
  ];

  glCtx.viewport(0, 0, canvas.width, canvas.height);
  glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array(positions), glCtx.STATIC_DRAW);
  glCtx.enableVertexAttribArray(positionAttributeLocation);
  glCtx.vertexAttribPointer(positionAttributeLocation, 2, glCtx.FLOAT, false, 0, 0);

  glCtx.clearColor(0.0, 0.0, 0.0, 1.0);
  glCtx.clear(glCtx.COLOR_BUFFER_BIT);
  glCtx.drawArrays(glCtx.TRIANGLES, 0, 3);

  glCtx.disableVertexAttribArray(positionAttributeLocation);
};

initApp();

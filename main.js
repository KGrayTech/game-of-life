import "./style.css";
import { VertexShaderSource, FragmentShaderSource } from './shaders';
import { 
  createTexture,
  createProgram, 
  createShader, 
  initWebGL 
} from "./utils";

const initApp = () => {
  const canvas = document.getElementById("app-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const glCtx = initWebGL(canvas);
  if (!glCtx) return;

  glCtx.viewport(0, 0, canvas.width, canvas.height);

  const vertexShader = createShader(glCtx, glCtx.VERTEX_SHADER, VertexShaderSource);
  const fragmentShader = createShader(glCtx, glCtx.FRAGMENT_SHADER, FragmentShaderSource);
  const shaderProgram = createProgram(glCtx, vertexShader, fragmentShader);
  glCtx.useProgram(shaderProgram);

  const inputTexture = createTexture(glCtx, 1024, true);

  const textureUniformLocation = glCtx.getUniformLocation(shaderProgram, "uTexture");
  glCtx.activeTexture(glCtx.TEXTURE0);
  glCtx.bindTexture(glCtx.TEXTURE_2D, inputTexture);
  glCtx.uniform1i(textureUniformLocation, 0);

  const resolutionUniformLocation = glCtx.getUniformLocation(shaderProgram, "uResolution");
  glCtx.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);

  const normalResLocation = glCtx.getUniformLocation(shaderProgram, "normalRes");
  glCtx.uniform2fv(normalResLocation, [1.0 / canvas.width, 1.0 / canvas.height]);

  const texCoordBuffer = glCtx.createBuffer();
  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, texCoordBuffer);
  glCtx.bufferData(
    glCtx.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
    ]),
    glCtx.STATIC_DRAW,
  );
  const texCoordLocation = glCtx.getAttribLocation(shaderProgram, "aTexCoord");

  const positionBuffer = glCtx.createBuffer();
  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, positionBuffer);
  const vertices = [
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    1.0, 1.0,
  ];
  glCtx.bufferData(
    glCtx.ARRAY_BUFFER,
    new Float32Array(vertices),
    glCtx.STATIC_DRAW,
  );
  const positionAttributeLocation = glCtx.getAttribLocation(
    shaderProgram,
    "aPosition",
  );

  glCtx.enableVertexAttribArray(positionAttributeLocation);
  glCtx.enableVertexAttribArray(texCoordLocation);

  glCtx.vertexAttribPointer(
    positionAttributeLocation,
    2,
    glCtx.FLOAT,
    false,
    0,
    0,
  );
  glCtx.vertexAttribPointer(texCoordLocation, 2, glCtx.FLOAT, false, 0, 0);

  glCtx.clearColor(0.0, 0.0, 0.0, 1.0);
  glCtx.clear(glCtx.COLOR_BUFFER_BIT);
  glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);

  glCtx.disableVertexAttribArray(positionAttributeLocation);
  glCtx.disableVertexAttribArray(texCoordLocation);
};

initApp();

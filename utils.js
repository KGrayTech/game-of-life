const initWebGL = (canvas) => {
  const glCtx = canvas.getContext("webgl");

  if (!glCtx) {
    alert("Sorry, your device or browser not support WebGL");
    return null;
  }

  return glCtx;
};

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    console.log(
      "Failed to compile shader:",
      gl.getShaderInfoLog(shader),
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.log(
      "Failed to create a shader program:",
      gl.getProgramInfoLog(program),
    );
    gl.deleteProgram(program);
    return null;
  }

  return program;
};

const generateRandomTextureState = (width, height) => {
  const state = new Uint8Array(width * height * 4);

  for (let i = 0; i < state.length; i += 4) {
    state[i + 1]  = Math.random() > 0.5 ? 255 : 0;
    state[i + 3] = 255;
  }

  return state;
};

const createTexture = (glCtx, width, height, isHasRandomState = false) => {
  const initialState = isHasRandomState 
    ? generateRandomTextureState(width, height) 
    : null;

  const texture = glCtx.createTexture();
  glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
  glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, width, height, 0, glCtx.RGBA, glCtx.UNSIGNED_BYTE, initialState);
  glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.NEAREST);
  glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.NEAREST);
  glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.REPEAT);
  glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.REPEAT);
  glCtx.bindTexture(glCtx.TEXTURE_2D, null);

  return texture;
}

const createIdentityMatrix = () => {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
}

export { 
  createIdentityMatrix,
  createTexture, 
  createProgram, 
  createShader, 
  initWebGL 
};

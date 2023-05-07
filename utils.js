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

const generateRandomTextureState = (size) => {
  const state = new Uint8Array(size * size * 4);

  for (let i = 0; i < size * size * 4; i += 4) {
    const alive = Math.random() > 0.5 ? 255 : 0;

    state[i] = alive;
    state[i + 1] = alive;
    state[i + 2] = alive;
    state[i + 3] = 255;
  }

  return state;
};

const createTexture = (glCtx, size, isSetRandomState = false) => {
  const initialState = isSetRandomState 
    ? generateRandomTextureState(size) 
    : null;

  const texture = glCtx.createTexture();
  glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
  glCtx.texImage2D(
    glCtx.TEXTURE_2D,
    0,
    glCtx.RGBA,
    size,
    size,
    0,
    glCtx.RGBA,
    glCtx.UNSIGNED_BYTE,
    initialState,
  );

  glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
  glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
  glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.LINEAR);
  glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.LINEAR);

  return texture;
}

export { createTexture, createProgram, createShader, initWebGL };

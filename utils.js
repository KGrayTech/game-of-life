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

export { createProgram, createShader, initWebGL };

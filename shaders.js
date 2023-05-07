const VertexShaderSource = `
  precision mediump float;

  attribute vec2 aPosition;
  attribute vec2 aTexCoord;
  uniform vec2 uResolution;
  varying vec2 vTexCoord;

  void main() {
    vec2 clipSpace = aPosition.xy * 2.0 - 1.0;
    gl_Position = vec4(clipSpace, 0.0, 1.0);
    vTexCoord = aTexCoord;
  }
`;

const FragmentShaderSource = `
  precision mediump float;

  varying vec2 vTexCoord;
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 normalRes;

  void main() {
    vec2 uv = vTexCoord;

    uv.y = 1.0 - uv.y;     

    vec4 col = texture2D(uTexture, uv);
    float a = col.r;

    float num = 0.0;
    for (float i = -1.0; i < 2.0; i++) {
      for (float j = -1.0; j < 2.0; j++) {
        float x = uv.x + i * normalRes.x; 
        float y = uv.y + j * normalRes.y;

        num += texture2D(uTexture, vec2(x, y)).r;
      }
    }

    num -= a;

    if (a > 0.5) {
      if (num < 1.5) a = 0.0;
      if (num > 3.5) a = 0.0;
    } else {
      if (num > 2.5 && num < 3.5)  a = 1.0;
    }

    gl_FragColor = vec4(a, a, a, 1.0);
  }
`;

export { VertexShaderSource, FragmentShaderSource };

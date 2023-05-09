const VertexShaderSource = `
  precision mediump float;

  attribute vec4 aPosition;

  uniform float uCellWidth;
  uniform float uCellHeight;

  varying float vWidth;
  varying float vHeight;
  varying vec2 vTexCoord; 
  varying vec2 neighbors[8];
   
  void main() {
    gl_Position = aPosition;   

    vTexCoord = (aPosition.xy + vec2(1.0, 1.0)) * 0.5;
  
    neighbors[0] = vec2(uCellWidth, uCellHeight);
    neighbors[1] = vec2(-uCellWidth, -uCellHeight);
    neighbors[2] = vec2(uCellWidth, -uCellHeight);
    neighbors[3] = vec2(-uCellWidth, uCellHeight);
    neighbors[4] = vec2(0, uCellHeight);
    neighbors[5] = vec2(uCellWidth, 0);
    neighbors[6] = vec2(0, -uCellHeight);
    neighbors[7] = vec2(-uCellWidth, 0);

    vWidth = uCellWidth;
    vHeight = uCellHeight;
  }
`;

const UpdateFragmentShaderSource = `
  precision mediump float;

  uniform sampler2D uTexture;
  uniform vec2 uRevive;
  
  varying float vWidth, vHeight;
  varying vec2 vTexCoord;
  varying vec2 neighbors[8];
 
  void main() {
    int count = 0;
    
    for (int i = 0; i <= 7; i++) {
      if (texture2D(uTexture, vTexCoord + neighbors[i]).g == 1.0) count += 1; 
    }

    float g = texture2D(uTexture, vTexCoord).g;
    if ((count == 3) || (g == 1.0 && count == 2) || (abs(vTexCoord.x - uRevive.x) < vWidth * 5.0 &&
      abs(vTexCoord.y - uRevive.y) < vHeight * 5.0))
      gl_FragColor = vec4(0.9, 1.0, 0.9, 1);
    else
      gl_FragColor = vec4(0.2, 0.1, 0.2, 1);
  }
`;

const DisplayFragmentShaderSource = `
   precision mediump float;
    
   uniform sampler2D uTexture; 
   varying vec2 vTexCoord;
  
   void main() {
    gl_FragColor = texture2D(uTexture, vTexCoord);
   }
`;

export {
  DisplayFragmentShaderSource,
  UpdateFragmentShaderSource,
  VertexShaderSource,
};

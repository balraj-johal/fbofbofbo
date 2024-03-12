export const POINTS_SHADERS = {
  vertex: `
    uniform float uTime;
    uniform sampler2D uTexture;
    
    out vec2 vUv;
  
    void main() {
      vUv = uv;

      vec3 pos = texture(uTexture, vUv).xyz;
  
      vec3 newPos = position;
      newPos.xy = pos.xy;
    //   newPos.z += sin( uTime + position.x * 10.0 ) * 0.2;
    //   newPos.z += sin( uTime + position.y * 8.0 ) * 0.2;
  
      vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
      
      gl_PointSize = ( 30.0 / - mvPosition.z );
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragment: `
    in vec2 vUv;

    uniform sampler2D uTexture;

    out vec4 FragColor;

    void main() {
        FragColor = texture(uTexture, vUv);
    }
`,
};

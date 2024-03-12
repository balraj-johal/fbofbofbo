/* eslint-disable prettier/prettier */
import { useEffect, useRef } from "react";

import {
  BufferAttribute,
  BufferGeometry,
  Camera,
  DataTexture,
  FloatType,
  GLSL3,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";

import { POINTS_SHADERS } from "./shaders";

const dimension = 128; // px
const size = dimension * dimension; // px

const Points = () => {
  const shaderMaterialRef = useRef<ShaderMaterial>(null);
  const geometryRef = useRef<BufferGeometry>(null);

  //fbo stuff
  const fboSceneRef = useRef<Scene>();
  const fboCameraRef = useRef<Camera>();

  useEffect(() => {
    const setTestTexture = async () => {
      if (!shaderMaterialRef.current) return;
      const texture = await new TextureLoader().loadAsync(
        "/assets/images/test.jpg"
      );
      shaderMaterialRef.current.uniforms.uTexture.value = texture;
      shaderMaterialRef.current.uniformsNeedUpdate = true;
    };

    const createFBOScene = () => {
      fboSceneRef.current = new Scene();
      fboCameraRef.current = new OrthographicCamera(-1, 1, 1, -1, -2, 2);
      fboCameraRef.current.position.z = 1;
      fboCameraRef.current.lookAt(new Vector3(0, 0, 0));

      // TODO: should this also be a triangle?
      const quadForRenderingUpdatedDataTexture = new PlaneGeometry(2, 2, 1, 1);
      const updatedDataTextureMaterial = new MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      const mesh = new Mesh(
        quadForRenderingUpdatedDataTexture,
        updatedDataTextureMaterial
      );
      fboSceneRef.current.add(mesh);
    };

    const setGeometryAttributes = () => {
      const positionLength = 3; // vec3
      const positions = new Float32Array(positionLength * size);
      const uvLength = 2; // vec2
      const uvs = new Float32Array(uvLength * size);

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const index = row * dimension + col;

          const positionsStride = positionLength * index;
          positions[positionsStride + 0] = (10 * col) / dimension - 5;
          positions[positionsStride + 1] = (10 * row) / dimension - 5;
          positions[positionsStride + 2] = 0;

          const uvStride = uvLength * index;
          uvs[uvStride + 0] = col / dimension;
          uvs[uvStride + 1] = row / dimension;
        }
      }

      geometryRef.current?.setAttribute(
        "position",
        new BufferAttribute(positions, positionLength)
      );
      geometryRef.current?.setAttribute(
        "uv",
        new BufferAttribute(uvs, uvLength)
      );
    };

    const setDataTexture = () => {
      if (!shaderMaterialRef.current) return;

      const data = new Float32Array(4 * size); // 4 channels per px

      for (let i = 0; i < size; i++) {
        const stride = i * 4;

        data[stride + 0] = Math.random() * 2 - 1;
        data[stride + 1] = Math.random() * 2 - 1;
        data[stride + 2] = 0;
        data[stride + 3] = 1.0;
      }

      const texture = new DataTexture(
        data,
        dimension,
        dimension,
        RGBAFormat,
        FloatType
      );
      texture.needsUpdate = true;

      shaderMaterialRef.current.uniforms.uTexture.value = texture;
      shaderMaterialRef.current.uniformsNeedUpdate = true;
    };

    setDataTexture();
    setGeometryAttributes();
    createFBOScene();
  }, []);

  useFrame(({ gl }) => {
    if (!!fboSceneRef.current && !!fboCameraRef.current) {
      gl.render(fboSceneRef.current, fboCameraRef.current);
      console.log("render");
    }
  }, 1);

  useFrame((_, delta) => {
    if (!shaderMaterialRef.current) return;
    shaderMaterialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <points>
      <bufferGeometry ref={geometryRef} />
      <shaderMaterial
        ref={shaderMaterialRef}
        vertexShader={POINTS_SHADERS.vertex}
        fragmentShader={POINTS_SHADERS.fragment}
        uniforms={{
          uTime: { value: 0 },
          uTexture: { value: null },
        }}
        glslVersion={GLSL3}
      />
    </points>
  );
};

export default Points;

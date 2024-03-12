"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Points from "../Points";
import css from "./styles.module.scss";

const Scene = () => {
  return (
    <div className={css.SceneWrapper}>
      <Canvas>
        <OrbitControls />
        <Points />
      </Canvas>
    </div>
  );
};

export default Scene;

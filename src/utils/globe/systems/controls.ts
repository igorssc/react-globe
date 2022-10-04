import { PerspectiveCamera } from "three";
import { cameraZ } from "./config";
import { Orbit } from "./Orbit";

interface CreateControlsProps {
  camera: PerspectiveCamera;
  canvas: HTMLCanvasElement;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

function createControls({
  camera,
  canvas,
  autoRotate = true,
  autoRotateSpeed = 0.5,
}: CreateControlsProps) {
  const controls = new Orbit(camera, canvas);

  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minDistance = cameraZ;
  controls.maxDistance = cameraZ;
  controls.autoRotateSpeed = autoRotateSpeed;
  controls.autoRotate = autoRotate;

  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;

  // forward controls.update to our custom .tick method
  controls.tick = () => controls.update();

  return controls;
}

export { createControls };

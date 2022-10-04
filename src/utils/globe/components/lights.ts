import { AmbientLight, DirectionalLight, PointLight } from "three";

type CreateLightsProps = {
  ambient?: string;
  directionalLeft?: string;
  directionalTop?: string;
  point?: string;
};

function createLights({
  ambient = "#000000",
  directionalLeft = "#ffffff",
  directionalTop = "#ffffff",
  point = "#ffffff",
}: CreateLightsProps) {
  const ambientLight = new AmbientLight(ambient, 0.6);

  const dLight = new DirectionalLight(directionalLeft, 0.6);
  dLight.position.set(-400, 100, 400);

  const dLight1 = new DirectionalLight(directionalTop, 1);
  dLight1.position.set(-200, 500, 200);

  const dLight2 = new PointLight(point, 0.8);
  dLight2.position.set(-200, 500, 200);

  return { ambientLight, dLight, dLight1, dLight2 };
}

export { createLights };

import { Fog, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { flights as flightsDefault } from "../config.globe";
import { Globe } from "./components/globe";
import { createLights } from "./components/lights";
import { aspect, cameraZ, canvasHeight, canvasWidth } from "./systems/config";
import { createControls } from "./systems/controls";
import { Loop } from "./systems/loop";
import { Orbit } from "./systems/Orbit";
import { pointOfView } from "./systems/utils";

export type FlightsProps = {
  order: number;
  from?: string;
  to?: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  flightTime?: number;
  flightLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

class World {
  static defaultProps = {
    // China HongKong
    initialPosition: { lat: 22.3193, lng: 114.1694 },
  };

  globeConfig: GlobeConfig = {};
  flights: FlightsProps[] = [];

  camera: PerspectiveCamera;
  controls: Orbit;
  renderer: WebGLRenderer;
  scene: Scene;
  loop: Loop;
  globe: Globe;

  constructor(
    container: Element,
    flights?: FlightsProps[],
    props?: GlobeConfig
  ) {
    this.globeConfig.initialPosition =
      props?.initialPosition || World.defaultProps.initialPosition;
    this.globeConfig.pointSize = props?.pointSize;
    this.globeConfig.showAtmosphere = props?.showAtmosphere;
    this.globeConfig.atmosphereColor = props?.atmosphereColor;
    this.globeConfig.atmosphereAltitude = props?.atmosphereAltitude;
    this.globeConfig.polygonColor = props?.polygonColor;
    this.globeConfig.globeColor = props?.globeColor;
    this.globeConfig.emissive = props?.emissive;
    this.globeConfig.emissiveIntensity = props?.emissiveIntensity;
    this.globeConfig.shininess = props?.shininess;
    this.globeConfig.flightTime = props?.flightTime;
    this.globeConfig.flightLength = props?.flightLength;
    this.globeConfig.rings = props?.rings;
    this.globeConfig.maxRings = props?.maxRings;
    this.globeConfig.autoRotate = props?.autoRotate;
    this.globeConfig.autoRotateSpeed = props?.autoRotateSpeed;
    this.globeConfig.ambientLight = props?.ambientLight;
    this.globeConfig.directionalLeftLight = props?.directionalLeftLight;
    this.globeConfig.directionalTopLight = props?.directionalTopLight;
    this.globeConfig.pointLight = props?.pointLight;

    if (flights) {
      flights.map((flight) => this.flights.push(flight));
    } else {
      flightsDefault.map((flight) => this.flights.push(flight));
    }

    this.scene = new Scene();

    // this.scene =
    this.scene.fog = new Fog(0xffffff, 400, 2000);

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvasWidth(), canvasHeight());
    this.renderer.setClearColor(0xffaaff, 0);
    this.renderer.domElement.id = "globe-canvas";

    this.camera = new PerspectiveCamera(50, aspect, 180, 1800);
    this.camera.position.set(0, 0, cameraZ);

    this.loop = new Loop(this.camera, this.scene, this.renderer);
    this.controls = createControls({
      camera: this.camera,
      canvas: this.renderer.domElement,
      autoRotate: this.globeConfig.autoRotate,
      autoRotateSpeed: this.globeConfig.autoRotateSpeed,
    });
    this.controls.update();
    this.loop.updatables.push(this.controls);

    const { ambientLight, dLight, dLight1, dLight2 } = createLights({
      ambient: this.globeConfig.ambientLight,
      directionalLeft: this.globeConfig.directionalLeftLight,
      directionalTop: this.globeConfig.directionalTopLight,
      point: this.globeConfig.pointLight,
    });
    this.camera.add(ambientLight, dLight, dLight1, dLight2);

    this.globe = new Globe(
      {
        pointSize: this.globeConfig.pointSize,
        atmosphereColor: this.globeConfig.atmosphereColor,
        atmosphereAltitude: this.globeConfig.atmosphereAltitude,
        showAtmosphere: this.globeConfig.showAtmosphere,
        polygonColor: this.globeConfig.polygonColor,
        globeColor: this.globeConfig.globeColor,
        emissive: this.globeConfig.emissive,
        emissiveIntensity: this.globeConfig.emissiveIntensity,
        shininess: this.globeConfig.shininess,
        flightTime: this.globeConfig.flightTime,
        flightLength: this.globeConfig.flightLength,
        rings: this.globeConfig.rings,
        maxRings: this.globeConfig.maxRings,
      },
      this.flights
    );
    this.globe.init();
    this.loop.updatables.push(this.globe.instance);

    this.scene.add(this.camera, this.globe.instance);

    pointOfView(
      this.camera,
      this.controls,
      this.globe.instance,
      // Brazil
      // { lat: -22.9068, lng: -43.1729 },
      this.globeConfig.initialPosition,
      1000
    );

    const pJS_canvas_id = "globe-canvas";

    const exist_canvas = document.getElementById(pJS_canvas_id);

    if (exist_canvas) {
      container.removeChild(exist_canvas);
    }

    container.prepend(this.renderer.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
    this.renderer.setAnimationLoop(null);
  }
}

export { World };

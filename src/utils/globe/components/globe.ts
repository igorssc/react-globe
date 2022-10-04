import { Color } from "three";
import { FlightsProps } from "..";
import flightsDefault from "../assets/arcs.json";
import countries from "../assets/globe.json";
import { Globe as ThreeGlobe } from "../systems/Globe";
import { genRandomNumbers, hexToRgb } from "../systems/utils";

interface GlobeProps {
  pointSize?: number;
  atmosphereColor?: string;
  showAtmosphere?: boolean;
  atmosphereAltitude?: number;
  polygonColor?: string;
  globeColor?: string;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  flightTime?: number;
  flightLength?: number;
  rings?: number;
  maxRings?: number;
}

class Globe {
  instance: ThreeGlobe;
  pointsData: {
    size: number;
    order: number;
    color: (t: number) => string;
    label: string;
    lat: number;
    lng: number;
  }[];

  pointSize: number;
  atmosphereColor: string;
  showAtmosphere: boolean;
  atmosphereAltitude: number;
  polygonColor: string;
  globeColor: string;
  emissive: string;
  emissiveIntensity: number;
  shininess: number;
  flightTime: number;
  flightLength: number;
  rings: number;
  maxRings: number;

  flights: FlightsProps[] = [];

  RING_PROPAGATION_SPEED = 3;
  interval = 2;
  deltaGlobe = 0;
  numbersOfRings = [0];

  static defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    flightTime: 2000,
    flightLength: 0.9,
    rings: 1,
    maxRings: 3,
  };

  constructor(props: GlobeProps, flights: FlightsProps[]) {
    this.pointSize = props.pointSize || Globe.defaultProps.pointSize;
    this.showAtmosphere =
      props.showAtmosphere || Globe.defaultProps.showAtmosphere;
    this.atmosphereColor =
      props.atmosphereColor || Globe.defaultProps.atmosphereColor;
    this.atmosphereAltitude =
      props.atmosphereAltitude || Globe.defaultProps.atmosphereAltitude;
    this.polygonColor = props.polygonColor || Globe.defaultProps.polygonColor;
    this.globeColor = props.globeColor || Globe.defaultProps.globeColor;
    this.emissive = props.emissive || Globe.defaultProps.emissive;
    this.emissiveIntensity =
      props.emissiveIntensity || Globe.defaultProps.emissiveIntensity;
    this.shininess = props.shininess || Globe.defaultProps.shininess;
    this.flightTime = props.flightTime || Globe.defaultProps.flightTime;
    this.flightLength = props.flightLength || Globe.defaultProps.flightLength;
    this.rings = props.rings || Globe.defaultProps.rings;
    this.maxRings = props.maxRings || Globe.defaultProps.maxRings;

    if (flights.length > 0) {
      flights.map((flight) => this.flights.push(flight));
    } else {
      this.flights = flightsDefault.flights;
    }

    this.instance = new ThreeGlobe({
      waitForGlobeReady: true,
      animateIn: true,
    });
    this.pointsData = [];

    this._buildData();
    this._buildMaterial();

    this.instance.tick = (delta: number) => this.tick(delta);
  }

  init() {
    this.initCountries(1000);
    this.initAnimationData(1000);
  }

  initCountries(delay: number) {
    setTimeout(() => {
      this.instance
        .hexPolygonsData(
          countries.features.filter((d) => d.properties.ISO_A2 !== "AQ")
        )
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(this.showAtmosphere)
        .atmosphereColor(this.atmosphereColor)
        .atmosphereAltitude(this.atmosphereAltitude)
        .hexPolygonColor((e) => {
          return this.polygonColor;
        });
    }, delay);
  }

  initAnimationData(delay: number) {
    setTimeout(() => {
      this.instance
        .arcsData(this.flights)
        .arcStartLat((d) => (d as { startLat: number }).startLat * 1)
        .arcStartLng((d) => (d as { startLng: number }).startLng * 1)
        .arcEndLat((d) => (d as { endLat: number }).endLat * 1)
        .arcEndLng((d) => (d as { endLng: number }).endLng * 1)
        .arcColor((e: any) => (e as { color: string }).color)
        .arcAltitude((e) => {
          return (e as { arcAlt: number }).arcAlt * 1;
        })
        .arcStroke((e) => {
          return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
        })
        .arcDashLength(this.flightLength)
        .arcDashInitialGap((e) => (e as { order: number }).order * 1)
        .arcDashGap(15)
        .arcDashAnimateTime((e) => this.flightTime)
        .pointsData(this.pointsData)
        .pointColor((e) => (e as { color: string }).color)
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(0.25)
        .ringsData([])
        .ringColor((e: any) => (t: any) => e.color(t))
        .ringMaxRadius(this.maxRings)
        .ringPropagationSpeed(this.RING_PROPAGATION_SPEED)
        .ringRepeatPeriod((this.flightTime * this.flightLength) / this.rings);
    }, delay);
  }

  tick(delta: number) {
    this.deltaGlobe += delta;

    if (this.deltaGlobe > this.interval) {
      this.numbersOfRings = genRandomNumbers(
        0,
        this.pointsData.length,
        Math.floor((this.pointsData.length * 4) / 5)
      );
      this.instance.ringsData(
        this.pointsData.filter((d, i) => this.numbersOfRings.includes(i))
      );

      this.deltaGlobe = this.deltaGlobe % this.interval;
    }
  }

  _buildData() {
    const arcs = this.flights;
    let points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
      points.push({
        size: this.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        label: arc.from || "",
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: this.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        label: arc.to || "",
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    // remove duplicates for same lat and lng
    this.pointsData = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
          )
        ) === i
    );
  }

  _buildMaterial() {
    const globeMaterial = this.instance.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(this.globeColor);
    globeMaterial.emissive = new Color(this.emissive);
    globeMaterial.emissiveIntensity = this.emissiveIntensity;
    globeMaterial.shininess = this.shininess;
  }
}

export { Globe };

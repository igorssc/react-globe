import TWEEN from "@tweenjs/tween.js";
import { PerspectiveCamera, Vector3 } from "three";
import threeGlobe from "three-globe";
import { Orbit } from "./Orbit";

export function hexToRgb(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}

export function pointOfView(
  camera: PerspectiveCamera,
  controls: Orbit,
  globe: threeGlobe,
  geoCoords = {} as { lat?: number; lng?: number; altitude?: number },
  transitionDuration = 0
) {
  const curGeoCoords = getGeoCoords();

  // Getter
  if (
    geoCoords.lat === undefined &&
    geoCoords.lng === undefined &&
    geoCoords.altitude === undefined
  ) {
    return curGeoCoords;
  } else {
    // Setter
    const finalGeoCoords = Object.assign({}, curGeoCoords, geoCoords);

    ["lat", "lng", "altitude"].forEach(
      (p) =>
        (finalGeoCoords[p as "lat" | "lng" | "altitude"] =
          +finalGeoCoords[p as "lat" | "lng" | "altitude"])
    ); // coerce coords to number

    if (!transitionDuration) {
      // no animation
      setCameraPos(finalGeoCoords);
    } else {
      // Avoid rotating more than 180deg longitude
      while (curGeoCoords.lng - finalGeoCoords.lng > 180)
        curGeoCoords.lng -= 360;
      while (curGeoCoords.lng - finalGeoCoords.lng < -180)
        curGeoCoords.lng += 360;

      new TWEEN.Tween(curGeoCoords)
        .to(finalGeoCoords, transitionDuration)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(setCameraPos)
        .start();
    }
  }

  function getGeoCoords() {
    return globe.toGeoCoords(cameraPosition());
  }

  function setCameraPos({
    lat,
    lng,
    altitude,
  }: {
    lat: number;
    lng: number;
    altitude: number;
  }) {
    cameraPosition(globe.getCoords(lat, lng, altitude));
  }

  function cameraPosition(
    position?: { x: number; y: number; z: number },
    lookAt?: { x: number; y: number; z: number },
    transitionDuration?: number
  ) {
    // Setter
    if (position) {
      const finalPos = position;
      const finalLookAt = lookAt || { x: 0, y: 0, z: 0 };

      if (!transitionDuration) {
        // no animation
        setCameraPos(finalPos);
        setLookAt(finalLookAt);
      } else {
        const camPos = Object.assign({}, camera.position);
        const camLookAt = getLookAt();

        new TWEEN.Tween(camPos)
          .to(finalPos, transitionDuration)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(setCameraPos)
          .start();

        // Face direction in 1/3rd of time
        new TWEEN.Tween(camLookAt)
          .to(finalLookAt, transitionDuration / 3)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(setLookAt)
          .start();
      }
    }

    // Getter
    return Object.assign({}, camera.position, { lookAt: getLookAt() });

    //

    function setCameraPos(pos: { x: number; y: number; z: number }) {
      const { x, y, z } = pos;
      if (x !== undefined) camera.position.x = x;
      if (y !== undefined) camera.position.y = y;
      if (z !== undefined) camera.position.z = z;
    }

    function setLookAt(lookAt: { x: number; y: number; z: number }) {
      const lookAtVect = new Vector3(lookAt.x, lookAt.y, lookAt.z);
      if (controls.target) {
        controls.target = lookAtVect;
      } else {
        // Fly controls doesn't have target attribute
        camera.lookAt(lookAtVect); // note: lookAt may be overridden by other controls in some cases
      }
    }

    function getLookAt() {
      return Object.assign(
        new Vector3(0, 0, -1000)
          .applyQuaternion(camera.quaternion)
          .add(camera.position)
      );
    }
  }
}

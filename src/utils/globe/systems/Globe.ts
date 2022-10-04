import threeGlobe from "three-globe";

class Globe extends threeGlobe {
  constructor({
    waitForGlobeReady,
    animateIn,
  }: {
    waitForGlobeReady?: boolean;
    animateIn?: boolean;
  }) {
    super({ waitForGlobeReady, animateIn });
  }

  tick: (delta: number) => void = () => {};
}

export { Globe };

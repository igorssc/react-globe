# React Globe

![cover](https://user-images.githubusercontent.com/26682297/193670814-9fe9b358-a2d2-4c19-a310-b2588615ffb4.gif)

This project was created with the intention of studying and improving Javascript development techniques. The Globe is based on what is presented on the `GitHub` homepage.

## ✨ Technologies

This project was developed with the following technologies:

- React
- Next.js
- TypeScript
- Three
- Three-globe

## 🚀 How to run

- Clone the repository

```bash
git clone https://github.com/igorssc/react-globe.git

cd react-globe
```

- Install dependencies

```bash
yarn

# or

npm init
```

- Start the server

```bash
yarn start

# or

npm run start
```

You can now access [`localhost:3000`](http://localhost:3000) from your browser.

### `Options`

You can change animation settings via the `config.globe.ts` file

`globeConfig:`

| Name                 | Type    | Default                 |
| -------------------- | ------- | ----------------------- |
| pointSize            | number  | 1                       |
| globeColor           | string  | "#062056"               |
| showAtmosphere       | boolean | true                    |
| atmosphereColor      | string  | "#ffffff"               |
| atmosphereAltitude   | number  | 0.1                     |
| emissive             | string  | "#000000"               |
| emissiveIntensity    | number  | 0.1                     |
| shininess            | number  | 0.9                     |
| polygonColor         | string  | "rgba(255,255,255,0.7)" |
| ambientLight         | string  | "#000000"               |
| directionalLeftLight | string  | "#000000"               |
| directionalTopLight  | string  | "#ffffff"               |
| pointLight           | string  | "#ffffff"               |
| flightTime           | number  | 1000                    |
| flightLength         | number  | 0.9                     |
| rings                | number  | 1                       |
| maxRings             | number  | 3                       |
| autoRotate           | boolean | true                    |
| autoRotateSpeed      | number  | 0.5                     |
| initialPosition:     |         |                         |
| lat                  | number  | 22.3193                 |
| lng                  | number  | 114.1694                |

`flights:`

| Name     | Type   | Example        |
| -------- | ------ | -------------- |
| order    | number | 1              |
| from     | string | "New Delhi"    |
| to       | string | "Kuala Lumpur" |
| startLat | number | 28.6139        |
| startLng | number | 77.209         |
| endLat   | number | 3.139          |
| endLng   | number | 101.6869       |
| arcAlt   | number | 0.2            |
| color    | string | "#FFFFFF"      |

## 🪄 Preview

Access <https://react-anim-globe.vercel.app>

## 📝 Licence

This project is under MIT licence. See the archive [LICENSE](LICENSE.md) to more details.

---

Made with 💜 by [IGS Design](https://igsdesign.com.br) - Igor Santos 👋


# Boids Simulation using p5 and bitECS 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is my attempt of modeling a Craig Reynolds boids behavior simulation.

## Usage:
- yarn
    ``` 
    yarn install

    yarn dev

    ```

## Features
- Draw system using [p5](https://p5js.org/)
- [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system) implemented with [bitECS](https://github.com/NateTheGreatt/bitECS)
- Delta-time movement and world-wrapping ([Delta timing](https://en.wikipedia.org/wiki/Delta_timing)).
- Devtools used: 
    - [Vite](https://vitejs.dev/)

## Connections and Inspirations
- [Craig Reynolds boids model](https://www.red3d.com/cwr/boids/).
- [The Coding Train: Flocking Simulation](https://www.youtube.com/watch?v=mhjuuHl6qHM).
- [Sebastian Lague: Boids](https://www.youtube.com/watch?v=bqtqltqcQhw).
- [Understanding Delta Time by drewcampbell92](https://drewcampbell92.medium.com/understanding-delta-time-b53bf4781a03) (on medium.com).

import p5 from "p5";
import * as bitECS from "./js/bitECS/bitECS.js";
import { PositionProxy } from "./js/bitECS/components/Position.js"
import { VelocityProxy } from "./js/bitECS/components/Velocity.js";

let canvasWidth = 1004;
let canvasHeight = 620;
let p5Obj = undefined;

export default function init() {
    p5Obj = new p5(p5 => {
        p5.setup = function () {
            const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight)
            canvas.parent('parent');
            canvas.imageSmoothingEnabled = false;

            p5.frameRate(60);

            p5.world = bitECS.createNewWorld(this);
            const position = new PositionProxy(null);
            const velocity = new VelocityProxy(null);

            for (let i = 0; i < 256; i++) {
                let newEid = p5.world.createEntity();
                position.eid = newEid;
                velocity.eid = newEid;

                position.x = Math.random() * p5.windowWidth;
                position.y = Math.random() * p5.windowHeight;
                velocity.x = (Math.random() * 2 - 1) * 100;
                velocity.y = (Math.random() * 2 - 1) * 100;

                if (newEid == 1) {
                    let newEnt = p5.world.entities.get(newEid);
                    newEnt.fill = 'red',
                        newEnt.a = 3;
                    newEnt.position.x = p5.windowWidth / 2;
                    newEnt.position.y = p5.windowHeight / 2
                }
            }
        }

        p5.draw = function () {
            if (!p5.world) { return; }
            p5.background(p5.color(0,51,102))
            p5.world.pipeline(p5.world);
            //p5.noLoop()
        },
        p5.windowResized = function() {
            p5.resizeCanvas(window.innerWidth, window.innerHeight);
          }
    })
}
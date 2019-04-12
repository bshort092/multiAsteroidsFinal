'use strict';

let random = require('./random');
let Asteroid = require('./asteroid');

function createManyAsteroids(spec) {
    let newAsteroids = [];

    let canvasWidth = 600;
    let canvasHeight = 600;
    let shipWidth = 35;
    let shipHeight = 35;

    for (let i = 0; i < spec.numOfAsteroids; i++) {
        let eachAsteroid = ({
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
            direction: 0,
            rotation: 0,
            rotateRate: Math.PI / 150,
            speed: 0,
            radius: 0,
        });
        let x = Math.random() * canvasWidth;
        let y = Math.random() * canvasHeight;
        let valid = [canvasWidth / 2 - shipWidth * 2, canvasWidth / 2 + shipWidth * 2, canvasHeight / 2 - shipHeight * 2, canvasHeight / 2 + shipHeight * 2]
        while (x > valid[0] && x < valid[1]) {
            x = Math.random() * canvasWidth;
        }
        while (y > valid[2] && y < valid[3]) {
            y = Math.random() * canvasHeight;
        }
        eachAsteroid.position.x = x;
        eachAsteroid.position.y = y;
        let size = spec.asteroidSizes[2];
        eachAsteroid.size.width = size;
        eachAsteroid.size.height = size;
        eachAsteroid.direction = Math.random() * 360;
        eachAsteroid.speed = spec.minVelocity + (Math.random() * ((spec.maxVelocity - 1) - spec.minVelocity));
        eachAsteroid.rotation = Math.random() * 360;
        eachAsteroid.radius = size / 2;
        let randomRotate = Math.random() * Math.PI / 150;
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        eachAsteroid.rotateRate = randomRotate * plusOrMinus;

        newAsteroids.push(Asteroid.create(eachAsteroid));
    }
    return newAsteroids;
}

module.exports.create = (spec) => createManyAsteroids(spec);
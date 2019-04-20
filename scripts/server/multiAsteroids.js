'use strict';

let random = require('./random');
let Asteroid = require('./asteroid');

function createRandomAsteroid(spec) {
    let minSpeed = 0; let maxSpeed = 0;
    let randomSize = Math.floor(Math.random() * 3)
    let size = spec.asteroidSizes[randomSize];
    if(randomSize == 0){minSpeed = spec.minVelocity, maxSpeed = spec.minVelocity + 0.5}
    else if(randomSize == 1){minSpeed = spec.minVelocity + 0.5 , maxSpeed = spec.maxVelocity - 0.5}
    else if(randomSize == 2){minSpeed = spec.maxVelocity - 0.5, maxSpeed = spec.maxVelocity}

    let eachAsteroid = ({
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        direction: 0,
        rotation: 0,
        rotateRate: Math.PI / 150,
        speed: 0,
        radius: 0,
    });
    
    eachAsteroid.position.x = spec.position.x;
    eachAsteroid.position.y = spec.position.y;
    eachAsteroid.size.width = size;
    eachAsteroid.size.height = size;
    eachAsteroid.direction = Math.random() * 360;
    eachAsteroid.speed = minSpeed + (Math.random() * (maxSpeed - minSpeed));
    eachAsteroid.rotation = Math.random() * 360;
    eachAsteroid.radius = size / 2;
    let randomRotate = Math.random() * Math.PI / 150;
    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    eachAsteroid.rotateRate = randomRotate * plusOrMinus;

    if (eachAsteroid.direction > 359) { eachAsteroid.direction = 345 }
    if (eachAsteroid.direction >= 0 && eachAsteroid.direction <= 45 || eachAsteroid.direction > 315 && eachAsteroid.direction <= 359) { // appear from left
        eachAsteroid.position.x = 0 - eachAsteroid.size.width * 2;
        eachAsteroid.position.y = 1152 / 2 - eachAsteroid.size.width * 2;
    }
    else if (eachAsteroid.direction > 45 && eachAsteroid.direction <= 135) { // appear from bottom
        eachAsteroid.position.x = 1920 / 2 + eachAsteroid.size.width * 2;
        eachAsteroid.position.y = 1152 + eachAsteroid.size.width * 2;
    }
    else if (eachAsteroid.direction > 135 && eachAsteroid.direction <= 225) { // appear from right
        eachAsteroid.position.x = 1920 + eachAsteroid.size.width * 2;
        eachAsteroid.position.y = 1152 / 2 + eachAsteroid.size.width * 2;
    }
    else if (eachAsteroid.direction > 225 && eachAsteroid.direction <= 315) { // appear from top
        eachAsteroid.position.x = 1920 / 2 - eachAsteroid.size.width * 2;
        eachAsteroid.position.y = 0 - eachAsteroid.size.width * 2;
    }

    return eachAsteroid;
}

module.exports.createRandom = (spec) => createRandomAsteroid(spec);

function createManyAsteroids(spec) {
    let newAsteroids = [];
    
    for (let i = 0; i < spec.numOfAsteroids; i++) {
        let eachAsteroid = createRandomAsteroid(spec);
        newAsteroids.push(Asteroid.create(eachAsteroid));
    }
    return newAsteroids;
}

module.exports.init = (spec) => createManyAsteroids(spec);

function createAsteroids(spec) {
    let newAsteroids = [];

    for (let i = 0; i < spec.numOfAsteroids; i++) {
        let eachAsteroid = ({
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
            direction: 0,
            rotation: 0,
            rotateRate: Math.PI / 150,
            speed: 0,
            radius: 0,
            type: ''
        });
        eachAsteroid.position.x = spec.parentPosition.x
        eachAsteroid.position.y = spec.parentPosition.y
        let size = spec.size;
        eachAsteroid.size.width = size;
        eachAsteroid.size.height = size;
        eachAsteroid.direction = Math.random() * 360;
        eachAsteroid.speed = spec.minVelocity + (Math.random() * (spec.maxVelocity - spec.minVelocity));
        eachAsteroid.rotation = Math.random() * 360;
        eachAsteroid.radius = size / 2;
        let randomRotate = Math.random() * Math.PI / 150;
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        eachAsteroid.rotateRate = randomRotate * plusOrMinus;

        newAsteroids.push(Asteroid.create(eachAsteroid));
    }
    return newAsteroids;
}

module.exports.create = (spec) => createAsteroids(spec);
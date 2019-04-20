'use strict';

let random = require('./random');
let Ufo = require('./ufo');


function getSize(sizes) {
    let chooseRandomUFO = Math.random();
    let size = null;
    if (chooseRandomUFO < 0.5) {
        size = sizes[0]
    }
    else { size = sizes[1]; }
    return size;
}

function createRandomUfo(spec) {
    let eachUFO = ({
        size: { width: 0, height: 0 },
        position: { x: 0, y: 0 },
        rotation: 0,
        speed: 0,
        direction: 0,
        radius: 0,
    });

    let size = getSize(spec.UfoSizes);
    eachUFO.size.width = size[0];
    eachUFO.size.height = size[1];
    eachUFO.radius = size[1] / 2;
    eachUFO.direction = 15 + Math.random() * 360;
    eachUFO.speed = spec.minVelocity + (Math.random() * (spec.maxVelocity - spec.minVelocity));

    if (eachUFO.direction > 359) { eachUFO.direction = 345 }
    if (eachUFO.direction >= 0 && eachUFO.direction <= 45 || eachUFO.direction > 315 && eachUFO.direction <= 359) { // appear from left
        eachUFO.position.x = 0 - eachUFO.size.width * 2;
        eachUFO.position.y = 1152 / 2 - eachUFO.size.width * 2;
    }
    else if (eachUFO.direction > 45 && eachUFO.direction <= 135) { // appear from bottom
        eachUFO.position.x = 1920 / 2 + eachUFO.size.width * 2;
        eachUFO.position.y = 1152 + eachUFO.size.width * 2;
    }
    else if (eachUFO.direction > 135 && eachUFO.direction <= 225) { // appear from right
        eachUFO.position.x = 1920 + eachUFO.size.width * 2;
        eachUFO.position.y = 1152 / 2 + eachUFO.size.width * 2;
    }
    else if (eachUFO.direction > 225 && eachUFO.direction <= 315) { // appear from top
        eachUFO.position.x = 1920 / 2 - eachUFO.size.width * 2;
        eachUFO.position.y = 0 - eachUFO.size.width * 2;
    }

    return eachUFO;
}
module.exports.createRandom = (spec) => createRandomUfo(spec);

function createManyUfos(spec) {
    let newUfos = [];

    for (let i = 0; i < spec.numOfUfos; i++) {
        
        let eachUFO = createRandomUfo(spec);
        newUfos.push(Ufo.create(eachUFO));
    }
    return newUfos;
}

module.exports.create = (spec) => createManyUfos(spec);
'use strict';

let random = require ('./random');
let Asteroid = require('./asteroid');

function createManyAsteroids(spec) {
    let newAsteroids = [];
    for(let i = 0; i < spec.numOfAsteroids; i++){
        newAsteroids.push(Asteroid.create());
    }
    return newAsteroids;
}

module.exports.create = (spec) => createManyAsteroids(spec);
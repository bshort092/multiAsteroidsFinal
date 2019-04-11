'use strict';

let random = require ('./random');
let Ufo = require('./ufo');

function createManyUfos(spec) {
    let newUfos = [];
    for(let i = 0; i < spec.numOfUfos; i++){
        newUfos.push(Ufo.create());
    }
    return newUfos;
}

module.exports.create = (spec) => createManyUfos(spec);
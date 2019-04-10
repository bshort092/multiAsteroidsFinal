'use strict';

let random = require ('./random');
// let canvas = document.getElementById('canvas-main');


function checkXpos(canvas){
    let x = Math.random() * 600;
    // let x = Math.random() * canvas.width;
    // while(x > valid[0] && x < valid[1]){
    //     x = Math.random() * canvas.width;
    // }
    return x;
}
function checkYpos(canvas){
    let y = Math.random() * 600;
    // let y = Math.random() * canvas.height;
    // while(y > valid[2] && y < valid[3]) {
    //     y = Math.random() * canvas.height;
    // }
    return y;
}
function getNewSpeed(){
    let minSpeed = 0.5;
    let maxSpeed = 2;
    return minSpeed + (Math.random() * ((maxSpeed-1) - minSpeed));
}
function difRotations(){
    let randomRotate = Math.random() * Math.PI / 150;
    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return randomRotate * plusOrMinus;
}

function createAsteroid() {
    // let valid = [canvas.width/2 - shipWidth*2, canvas.width/2 + shipWidth*2, canvas.height/2 - shipHeight*2, canvas.height/2 + shipHeight*2];
    
    
    let that = {
        position:{ x: checkXpos(), y: checkYpos() },
        size: { width: 148, height: 148 },
        direction: Math.random() * 360, // Angle in radians
        rotation: Math.random() * 360, // Angle in radians
        rotateRate: difRotations(), // radians per millisecond
        speed: getNewSpeed(), // unit distance per millisecond
        reportUpdate: false, // Indicates if this model was updated during the last update 

        update: function() {
            
            that.reportUpdate = true;
        
            let vectorX = Math.cos(that.direction);
            let vectorY = Math.sin(that.direction);
        
            that.position.x += (vectorX * that.speed);
            that.position.y += (vectorY * that.speed);
        
            that.rotation += that.rotateRate;
        
            // if (position.x - (size.width/2) > canvas.width)  { position.x = 0 - (size.width/2); }
            // if (position.x + (size.width/2)  < 0)      { position.x = canvas.width + (size.width/2); }
            // if (position.y - (size.height/2) > canvas.height) { position.y = 0 - (size.height/2); }
            // if (position.y + (size.height/2) < 0)      { position.y = canvas.height + (size.height/2); }
        
            if (that.position.x - (that.size.width/2) > 600)  { that.position.x = 0 - (that.size.width/2); }
            if (that.position.x + (that.size.width/2)  < 0)      { that.position.x = 600 + (that.size.width/2); }
            if (that.position.y - (that.size.height/2) > 600) { that.position.y = 0 - (that.size.height/2); }
            if (that.position.y + (that.size.height/2) < 0)      { that.position.y = 600 + (that.size.height/2); }

        },
    };
    return that;
}

module.exports.create = () => createAsteroid();
// ------------------------------------------------------------------
//
// Nodejs module that provides the server-side game model.
//
// ------------------------------------------------------------------
'use strict';

let present = require('present');
let Player = require('./player');
let Laser = require('./laser');
let Asteroid = require('./asteroid');
let Powerup = require('./powerup');
let MultiAsteroids = require('./multiAsteroids');
let Ufo = require('./ufo');
let MultiUfos = require('./multiUFOs');

// TODO: create asteroid manager instead of one asteroid: 
let asteroids = MultiAsteroids.init({
    numOfAsteroids: 20,
    asteroidSizes: [37, 74, 148],
    minVelocity: 0.5,
    maxVelocity: 2,
    position: { x: Math.random() * 1920, y: Math.random() * 1152 }
})

let ufos = MultiUfos.create({
    numOfUfos: 1,
    UfoSizes: [[101, 60], [55, 30]],
    minVelocity: 0.5,
    maxVelocity: 1.5,
})

let laserArray = [];
let ufoLaserArray = [];
let powerupArray = [];

const UPDATE_RATE_MS = 10;
let quit = false;
let activeClients = {};
let inputQueue = [];
let fireTime = 0;
let ufoFireDelay = 1000;
let lastUpdateTime = present();

let playerNumbers = [{ num: 1, available: true }, { num: 2, available: true }, { num: 3, available: true }, { num: 4, available: true }];
// let playerNumbers = [{num: 1, available: true}];

//------------------------------------------------------------------
//
// Process the network inputs we have received since the last time
// the game loop was processed.
//
//------------------------------------------------------------------
function processInput() {
    //
    // Double buffering on the queue so we don't asynchronously receive inputs
    // while processing.
    let processMe = inputQueue;
    inputQueue = [];

    for (let inputIndex in processMe) {
        let input = processMe[inputIndex];
        let client = activeClients[input.clientId];
        client.lastMessageId = input.message.id;
        switch (input.message.type) {
            case 'thrust':
                // Need to compute the difference since the last update and when the thrust
                // input was received.  This time difference needs to be simulated before the
                // thrust input is processed in order to keep the client and server thinking
                // the same think about the player's ship.
                client.player.thrust(input.message.elapsedTime, input.receiveTime - lastUpdateTime);
                lastUpdateTime = input.receiveTime;

                //adjust for ship thrust particles
                let vectorX = Math.cos(client.player.direction);
                let vectorY = Math.sin(client.player.direction);

                let adjustParticlesX = vectorX * client.player.size.width / 2;
                let adjustParticlesY = vectorY * client.player.size.height / 2;

                let position = {
                    x: client.player.position.x - adjustParticlesX,
                    y: client.player.position.y - adjustParticlesY
                }
                let system = {
                    type: 'thrust',
                    position: position,
                }
                for (let clientId in activeClients) {
                    activeClients[clientId].socket.emit('create-particle-system', system);
                }
                break;
            case 'rotate-left':
                client.player.rotateLeft(input.message.elapsedTime);
                break;
            case 'rotate-right':
                client.player.rotateRight(input.message.elapsedTime);
                break;
            case 'fire-laser':
                fireLaser(client.player, input.message.elapsedTime, input.clientId);
                break;
            case 'hyperspace':
                moveSafe(client.player, input.message.elapsedTime, client, true);
                break;
        }
    }
}

function fireLaser(playerSpec, elapsedTime, playerId) {
    if (playerSpec.hasWiderSpread) {
        let laserSpec = {
            position: {
                x: playerSpec.position.x,
                y: playerSpec.position.y,
            },
            direction: playerSpec.direction,
            shipId: playerId,
            speed: .75
        };

        let laserSpec2 = {
            position: {
                x: playerSpec.position.x,
                y: playerSpec.position.y,
            },
            direction: playerSpec.direction + Math.PI / 12,
            shipId: playerId,
            speed: .75
        };

        let laserSpec3 = {
            position: {
                x: playerSpec.position.x,
                y: playerSpec.position.y,
            },
            direction: playerSpec.direction - Math.PI / 12,
            shipId: playerId,
            speed: .75
        };
        laserArray.push(Laser.create(laserSpec));
        laserArray.push(Laser.create(laserSpec2));
        laserArray.push(Laser.create(laserSpec3));
    }
    if (playerSpec.hasGuidedMissles) {
        let laserSpec = {
            position: {
                x: playerSpec.position.x,
                y: playerSpec.position.y,
            },
            direction: playerSpec.direction,
            shipId: playerId,
            speed: .75
        };
        laserArray.push(Laser.create(laserSpec, true));
    }
    else {
        let laserSpec = {
            position: {
                x: playerSpec.position.x,
                y: playerSpec.position.y,
            },
            direction: playerSpec.direction,
            shipId: playerId,
            speed: .75
        };
        laserArray.push(Laser.create(laserSpec));
    }

}

function fireUfoLaser(ufoSpec, elapsedTime) {
    let laserSpec = {
        position: {
            x: ufoSpec.position.x,
            y: ufoSpec.position.y,
        },
        direction: Math.random() * 360,
        speed: .25
    };
    ufoLaserArray.push(Laser.create(laserSpec));
}

function createPowerup() {
    let powerupTypes = ['shield', 'rate', 'spread', 'guided'];
    let powerupSpec = {
        position: {
            x: Math.random() * 1820 + 50,
            y: Math.random() * 1052 + 50
        },
        // type: powerupTypes[Math.floor(Math.random() * 4)],
        type: powerupTypes[3],
    };
    powerupArray.push(Powerup.create(powerupSpec));
}

for (let i = 0; i < 20; i++) {
    createPowerup();
}

function moveSafe(playerShip, elapsedTime, client, hyperspace) {
    let randomX;
    let randomY;
    while (true) {
        randomX = Math.floor(Math.random() * 1920);
        randomY = Math.floor(Math.random() * 1152);

        if (randomX < 128) {
            randomX += 128;
        }
        if (randomX > 1792) {
            randomX -= 128;
        }
        if (randomY < 128) {
            randomY += 128;
        }
        if (randomY > 1024) {
            randomY -= 128;
        }

        let shipSafeZone = {
            position: {
                x: randomX,
                y: randomY
            },
            radius: playerShip.radius * 10
        }

        let safeSpot = true;
        asteroids.forEach(asteroid => {
            if (didCollide(shipSafeZone, asteroid)) {
                safeSpot = false;
            }
        })

        ufos.forEach(ufo => {
            if (didCollide(shipSafeZone, ufo)) {
                safeSpot = false;
            }
        })
        if (safeSpot) {
            break;
        }
    }

    playerShip.position.x = randomX;
    playerShip.position.y = randomY;
    playerShip.momentum.x = 0;
    playerShip.momentum.y = 0;

    if (hyperspace) {
        let system = {
            type: 'hyperspace',
            position: playerShip.position,
        }
        for (let clientId in activeClients) {
            activeClients[clientId].socket.emit('create-particle-system', system);
        }
    }
    else {
        let system = {
            type: 'sadParticles',
            position: playerShip.position,
        }
        for (let clientId in activeClients) {
            activeClients[clientId].socket.emit('create-particle-system', system);
        }
    }

    let update = {
        clientId: client.id,
        lastMessageId: client.lastMessageId,
        direction: client.player.direction,
        position: client.player.position,
        momentum: client.player.momentum,
        updateWindow: elapsedTime,
    };
    client.socket.emit('update-self', update);
}

function didCollide(obj1, obj2) {
    if (obj1 && obj2) {
        let dx = obj1.position.x - obj2.position.x;
        let dy = obj1.position.y - obj2.position.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        return (distance < obj1.radius + obj2.radius)
    }
    return false;
}

function addAsteroid() {
    while (asteroids.length < 20) {
        let eachAsteroid = MultiAsteroids.createRandom({
            asteroidSizes: [37, 74, 148],
            minVelocity: 0.5,
            maxVelocity: 2,
            position: { x: Math.random() * 1920, y: Math.random() * 1152 }
        })
        asteroids.push(Asteroid.create(eachAsteroid))
    }
}
function addUFO() {
    let eachUFO = MultiUfos.createRandom({
        UfoSizes: [[101, 60], [55, 30]],
        minVelocity: 0.5,
        maxVelocity: 1.5,
    })
    ufos.push(Ufo.create(eachUFO))
}

function resetPowerups(playerShip) {
    playerShip.firingRate = 250;
    playerShip.firingRateTime = 10000;
    playerShip.hasWiderSpread = false;
    playerShip.widerSpreadTime = 10000;
    playerShip.hasShield = false;
    playerShip.blinking = false;
    playerShip.shieldTime = 10000;
    playerShip.hasGuidedMissles = false;
    playerShip.guidedMisslesTime = 10000;
}

function detectCollision(playerShip, elapsedTime, client) {
    //for each asteroid detect ship collision

    if (!playerShip.hasShield) {
        for (let i = 0; i < asteroids.length; i++) {
            if (didCollide(asteroids[i], playerShip)) {
                if (asteroids[i].size.width == 148) { playerShip.score -= 40; }
                else if (asteroids[i].size.width == 74) { playerShip.score -= 100; }
                else if (asteroids[i].size.width == 37) { playerShip.score -= 200; }
                if (playerShip.score < 0) { playerShip.score = 0; }
                resetPowerups(playerShip);
                let system = {
                    type: 'asteroidBreakup',
                    position: asteroids[i].position,
                }
                for (let clientId in activeClients) { // player hits asteroid
                    activeClients[clientId].socket.emit('create-particle-system', system);
                }
                let system1 = {
                    type: 'shipDestroyed',
                    position: playerShip.position,
                }
                for (let clientId in activeClients) {
                    activeClients[clientId].socket.emit('create-particle-system', system1);
                }
                moveSafe(playerShip, elapsedTime, client, false);
                if (asteroids[i].size.width === 148) {
                    let createdAsteroids = MultiAsteroids.create({
                        numOfAsteroids: 3,
                        minVelocity: 1,
                        maxVelocity: 1.5,
                        parentPosition: asteroids[i].position,
                        size: 74,
                    });
                    asteroids.splice(i, 1);
                    asteroids = asteroids.concat(createdAsteroids);
                }
                else if (asteroids[i].size.width === 74) {
                    let createdAsteroids = MultiAsteroids.create({
                        numOfAsteroids: 4,
                        minVelocity: 1.5,
                        maxVelocity: 2,
                        parentPosition: asteroids[i].position,
                        size: 37,
                    });
                    asteroids.splice(i, 1);
                    asteroids = asteroids.concat(createdAsteroids);
                }
                else {
                    asteroids.splice(i, 1);
                }
                addAsteroid();
            }
        }
    }

    for (let i = 0; i < asteroids.length; i++) {
        for (let j = 0; j < laserArray.length; j++) {
            if (didCollide(asteroids[i], laserArray[j])) {
                if (asteroids[i].size.width == 148) {
                    activeClients[laserArray[j].shipId].player.score += 20;
                }
                else if (asteroids[i].size.width == 74) {
                    activeClients[laserArray[j].shipId].player.score += 50;
                }
                else if (asteroids[i].size.width == 37) {
                    activeClients[laserArray[j].shipId].player.score += 100;
                }

                let system = {
                    type: 'asteroidBreakup',
                    position: asteroids[i].position,
                }
                for (let clientId in activeClients) {
                    activeClients[clientId].socket.emit('create-particle-system', system);
                }
                laserArray.splice(j, 1);
                if (asteroids[i].size.width === 148) {
                    let createdAsteroids = MultiAsteroids.create({
                        numOfAsteroids: 3,
                        minVelocity: 1,
                        maxVelocity: 1.5,
                        parentPosition: asteroids[i].position,
                        size: 74,
                    });
                    asteroids.splice(i, 1);
                    asteroids = asteroids.concat(createdAsteroids);
                }
                else if (asteroids[i].size.width === 74) {
                    let createdAsteroids = MultiAsteroids.create({
                        numOfAsteroids: 4,
                        minVelocity: 1.5,
                        maxVelocity: 2,
                        parentPosition: asteroids[i].position,
                        size: 37,
                    });
                    asteroids.splice(i, 1);
                    asteroids = asteroids.concat(createdAsteroids);
                }
                else {
                    asteroids.splice(i, 1);
                }
                addAsteroid();
            }
        }
    }
    for (let i = 0; i < ufos.length; i++) {
        if (!playerShip.hasShield) {
            if (ufos[i] && didCollide(ufos[i], playerShip)) {
                if (ufos[i].size.width == 101) { playerShip.score -= 1000; }
                else if (ufos[i].size.width == 55) { playerShip.score -= 2000; }
                if (playerShip.score < 0) { playerShip.score = 0; }
                resetPowerups(playerShip);
                let system = {
                    type: 'shipDestroyed',
                    position: playerShip.position,
                }
                for (let clientId in activeClients) {
                    activeClients[clientId].socket.emit('create-particle-system', system);
                }
                let system1 = {
                    type: 'ufoDestroyed',
                    position: ufos[i].position,
                }
                for (let clientId in activeClients) {
                    activeClients[clientId].socket.emit('create-particle-system', system1);
                }
                moveSafe(playerShip, elapsedTime, client, false);
                ufos.splice(i, 1);
                break;
            }
        }
        for (let j = 0; j < laserArray.length; j++) {
            if (didCollide(laserArray[j], ufos[i])) {
                if (ufos[i].size.width == 101) {
                    activeClients[laserArray[j].shipId].player.score += 500;
                }
                else if (ufos[i].size.width == 55) {
                    activeClients[laserArray[j].shipId].player.score += 1000;
                }

                let system = {
                    type: 'ufoDestroyed',
                    position: ufos[i].position,
                }
                for (let clientId in activeClients) {
                    activeClients[clientId].socket.emit('create-particle-system', system);
                }
                ufos.splice(i, 1);
                laserArray.splice(j, 1);
            }
        }
    }

    if (!playerShip.hasShield) {
        for (let i = 0; i < ufoLaserArray.length; i++) {
            if (didCollide(ufoLaserArray[i], playerShip)) {
                playerShip.score -= 5000;
                if (playerShip.score < 0) { playerShip.score = 0; }
                resetPowerups(playerShip);
                let system = {
                    type: 'shipDestroyed',
                    position: playerShip.position,
                }
                for (let clientId in activeClients) {
                    activeClients[clientId].socket.emit('create-particle-system', system);
                }
                moveSafe(playerShip, elapsedTime, client, false);
                ufoLaserArray.splice(i, 1);
            }
        }
    }

    for (let i = 0; i < powerupArray.length; i++) {
        if (didCollide(playerShip, powerupArray[i])) {
            let system = {
                type: 'powerupPickup',
                position: powerupArray[i].position,
            }
            for (let clientId in activeClients) {
                activeClients[clientId].socket.emit('create-particle-system', system);
            }

            if (powerupArray[i].type === 'guided') {
                playerShip.hasGuidedMissles = 100;
                playerShip.guidedMisslesTime = 10000;
            }

            if (powerupArray[i].type === 'rate') {
                playerShip.firingRate = 100;
                playerShip.firingRateTime = 10000;
            }

            if (powerupArray[i].type === 'spread') {
                playerShip.hasWiderSpread = true;
                playerShip.widerSpreadTime = 10000;
            }

            if (powerupArray[i].type === 'shield') {
                playerShip.hasShield = true;
                playerShip.shieldTime = 10000;
            }
            powerupArray.splice(i, 1);
        }
    }
}

//------------------------------------------------------------------
//
// Update the simulation of the game.
//
//------------------------------------------------------------------
function update(elapsedTime) {
    for (let clientId in activeClients) {
        activeClients[clientId].player.update(elapsedTime, false);
        detectCollision(activeClients[clientId].player, elapsedTime, activeClients[clientId]);
    }

    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].update();
    }

    for (let i = 0; i < ufos.length; i++) {
        ufos[i].update();
        ufoFireDelay -= elapsedTime;
        if (ufoFireDelay <= 1000) {
            fireUfoLaser(ufos[i], elapsedTime);
            ufoFireDelay += 1000;
        }
    }

    let flyingObjects = asteroids.concat(ufos);

    for (let i = 0; i < laserArray.length; i++) {
        laserArray[i].lifetime -= elapsedTime;
        laserArray[i].update(elapsedTime, flyingObjects);
        if (laserArray[i].lifetime <= 0) {
            laserArray.splice(i, 1);
        }
    }

    for (let i = 0; i < ufoLaserArray.length; i++) {
        ufoLaserArray[i].lifetime -= elapsedTime * .25;
        ufoLaserArray[i].update(elapsedTime);
        if (ufoLaserArray[i].lifetime <= 0) {
            ufoLaserArray.splice(i, 1);
        }
    }

    for (let i = 0; i < powerupArray.length; i++) {
        powerupArray[i].update(elapsedTime);
    }
}

//------------------------------------------------------------------
//
// Send state of the game to any connected clients.
//
//------------------------------------------------------------------
function updateClients(elapsedTime) {
    for (let clientId in activeClients) {
        let client = activeClients[clientId];

        let updateAsteroid = {
            asteroids: asteroids,
        }
        client.socket.emit('update-self-asteroid', updateAsteroid);

        let updateUfo = {
            ufos: ufos,
        }
        client.socket.emit('update-self-ufo', updateUfo);

        let updateLasers = {
            lasers: laserArray,
        }
        client.socket.emit('update-self-laser', updateLasers);

        let updateUfoLasers = {
            ufoLasers: ufoLaserArray,
        }
        client.socket.emit('update-ufo-laser', updateUfoLasers);

        let updatePowerups = {
            powerups: powerupArray,
        }
        client.socket.emit('update-self-powerup', updatePowerups);

        let update = {
            clientId: clientId,
            lastMessageId: client.lastMessageId,
            direction: client.player.direction,
            position: client.player.position,
            momentum: client.player.momentum,
            score: client.player.score,
            firingRate: client.player.firingRate,
            firingRateTime: client.player.firingRateTime,
            hasWiderSpread: client.player.hasWiderSpread,
            widerSpreadTime: client.player.widerSpreadTime,
            hasShield: client.player.hasShield,
            blinking: client.player.blinking,
            shieldTime: client.player.shieldTime,
            hasGuidedMissles: client.player.hasGuidedMissles,
            guidedMisslesTime: client.player.guidedMisslesTime,
            name: client.player.name,
            playerNumber: client.playerNumber,
            updateWindow: elapsedTime,
        };

        if (client.player.reportUpdate) {
            client.socket.emit('update-self', update);

            //
            // Notify all other connected clients about every
            // other connected client status...but only if they are updated.
            for (let otherId in activeClients) {
                if (otherId !== clientId) {
                    activeClients[otherId].socket.emit('update-other', update);
                }
            }
        }
    }

    for (let clientId in activeClients) {
        activeClients[clientId].player.reportUpdate = false;
    }
    lastUpdateTime = present();
}

//------------------------------------------------------------------
//
// Server side game loop
//
//------------------------------------------------------------------
function gameLoop(currentTime, elapsedTime) {
    processInput();
    update(elapsedTime);
    updateClients(elapsedTime);

    if (!quit) {
        setTimeout(() => {
            let now = present();
            gameLoop(now, now - currentTime);
        }, UPDATE_RATE_MS);
    }
}

//------------------------------------------------------------------
//
// Get the socket.io server up and running so it can begin
// collecting inputs from the connected clients.
//
//------------------------------------------------------------------
function initializeSocketIO(httpServer) {
    let io = require('socket.io')(httpServer);

    //------------------------------------------------------------------
    //
    // Notifies the already connected clients about the arrival of this
    // new client.  Plus, tell the newly connected client about the
    // other players already connected.
    //
    //------------------------------------------------------------------
    function notifyConnect(socket, newPlayer) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (newPlayer.clientId !== clientId) {
                //
                // Tell existing about the newly connected player
                client.socket.emit('connect-other', {
                    clientId: newPlayer.clientId,
                    direction: newPlayer.direction,
                    position: newPlayer.position,
                    rotateRate: newPlayer.rotateRate,
                    size: newPlayer.size,
                    thrustRate: newPlayer.thrustRate,
                    maxSpeed: newPlayer.maxSpeed,
                    momentum: newPlayer.momentum,
                    radius: newPlayer.radius,
                    score: newPlayer.score,
                    firingRate: newPlayer.firingRate,
                    firingRateTime: newPlayer.firingRateTime,
                    hasWiderSpread: newPlayer.hasWiderSpread,
                    widerSpreadTime: newPlayer.widerSpreadTime,
                    hasShield: newPlayer.hasShield,
                    blinking: newPlayer.blinking,
                    shieldTime: newPlayer.shieldTime,
                    hasGuidedMissles: newPlayer.hasGuidedMissles,
                    guidedMisslesTime: newPlayer.guidedMisslesTime,
                    name: newPlayer.name,
                    playerNumber: newPlayer.playerNumber,
                });

                //
                // Tell the new player about the already connected player
                socket.emit('connect-other', {
                    clientId: client.player.clientId,
                    direction: client.player.direction,
                    position: client.player.position,
                    rotateRate: client.player.rotateRate,
                    size: client.player.size,
                    maxSpeed: client.player.maxSpeed,
                    thrustRate: client.player.thrustRate,
                    momentum: client.player.momentum,
                    radius: client.player.radius,
                    score: client.player.score,
                    firingRate: client.player.firingRate,
                    firingRateTime: client.player.firingRateTime,
                    hasWiderSpread: client.player.hasWiderSpread,
                    widerSpreadTime: client.player.widerSpreadTime,
                    hasShield: client.player.hasShield,
                    blinking: client.player.blinking,
                    shieldTime: client.player.shieldTime,
                    hasGuidedMissles: client.player.hasGuidedMissles,
                    guidedMisslesTime: client.player.guidedMisslesTime,
                    name: client.player.name,
                    playerNumber: client.playerNumber,
                });
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Notifies the already connected clients about the disconnect of
    // another client.
    //
    //------------------------------------------------------------------
    function notifyDisconnect(playerId) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (playerId !== clientId) {
                client.socket.emit('disconnect-other', {
                    clientId: playerId
                });
            }
        }
    }

    io.on('connection', function (socket) {
        console.log('Connection established: ', socket.id);
        //
        // Create an entry in our list of connected clients
        let playerNum = findAvailablePlayerNum();
        // if(playerNum != null){
        let newPlayer = Player.create();
        newPlayer.clientId = socket.id;

        activeClients[socket.id] = {
            socket: socket,
            player: newPlayer,
            playerNumber: playerNum,
        };

        socket.emit('connect-ack', {
            momentum: newPlayer.momentum,
            direction: newPlayer.direction,
            position: newPlayer.position,
            size: newPlayer.size,
            rotateRate: newPlayer.rotateRate,
            maxSpeed: newPlayer.maxSpeed,
            thrustRate: newPlayer.thrustRate,
            radius: newPlayer.radius,
            score: newPlayer.score,
            firingRate: newPlayer.firingRate,
            firingRateTime: newPlayer.firingRateTime,
            hasWiderSpread: newPlayer.hasWiderSpread,
            widerSpreadTime: newPlayer.widerSpreadTime,
            hasShield: newPlayer.hasShield,
            blinking: newPlayer.blinking,
            shieldTime: newPlayer.shieldTime,
            hasGuidedMissles: newPlayer.hasGuidedMissles,
            guidedMisslesTime: newPlayer.guidedMisslesTime,
            name: newPlayer.name,
            playerNumber: newPlayer.playerNumber,
        });

        socket.on('changeName', newName => {
            activeClients[socket.id].player.name = newName;
        });

        socket.on('input', data => {
            inputQueue.push({
                clientId: socket.id,
                message: data,
                receiveTime: present()
            });
        });

        socket.on('disconnect', function () {
            if (activeClients[socket.id].playerNumber != null) {
                playerNumbers[activeClients[socket.id].playerNumber - 1].available = true;
            }
            delete activeClients[socket.id];
            notifyDisconnect(socket.id);
        });

        // socket.on('quit', function () {
        //     console.log('terminating game');
        // });

        notifyConnect(socket, newPlayer);
        // }

    });
}

function findAvailablePlayerNum() {
    for (let i = 0; i < playerNumbers.length; i++) {
        if (playerNumbers[i].available) {
            playerNumbers[i].available = false;
            return playerNumbers[i].num;
        }
    }
    return null;
}

//------------------------------------------------------------------
//
// Entry point to get the game started.
//
//------------------------------------------------------------------
function initialize(httpServer) {
    initializeSocketIO(httpServer);
    gameLoop(present(), 0);
}

//------------------------------------------------------------------
//
// Public function that allows the game simulation and processing to
// be terminated.
//
//------------------------------------------------------------------
function terminate() {
    this.quit = true;
}

module.exports.initialize = initialize;

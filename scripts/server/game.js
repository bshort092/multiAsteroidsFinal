// ------------------------------------------------------------------
//
// Nodejs module that provides the server-side game model.
//
// ------------------------------------------------------------------
'use strict';

let present = require('present');
let Player = require('./player');
let Asteroid = require('./asteroid');

const UPDATE_RATE_MS = 250;
let quit = false;
let activeClients = {};
let activeAsteroids = {};
let inputQueue = [];

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
            case 'move':
                client.player.move(input.message.elapsedTime);
                break;
            case 'rotate-left':
                client.player.rotateLeft(input.message.elapsedTime);
                break;
            case 'rotate-right':
                client.player.rotateRight(input.message.elapsedTime);
                break;
        }
    }
}

//------------------------------------------------------------------
//
// Update the simulation of the game.
//
//------------------------------------------------------------------
function update(elapsedTime, currentTime) {
    for (let clientId in activeClients) {
        activeClients[clientId].player.update(currentTime);
    }
    // ASTEROID
    for (let clientId in activeAsteroids) {
        activeAsteroids[clientId].asteroid.update(currentTime);
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
        let update = {
            clientId: clientId,
            lastMessageId: client.lastMessageId,
            direction: client.player.direction,
            position: client.player.position,
            updateWindow: elapsedTime
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

    // ASTEROID
    for (let clientId in activeAsteroids) {
        let client = activeAsteroids[clientId];
        let update = {
            clientId: clientId,
            lastMessageId: client.lastMessageId,
            direction: client.asteroid.direction,
            position: client.asteroid.position,
            updateWindow: elapsedTime
        };
        if (client.asteroid.reportUpdate) {
            client.socket.emit('update-self-asteroid', update);

            //
            // Notify all other connected clients about every
            // other connected client status...but only if they are updated.

            // for (let otherId in activeAsteroids) {
            //     if (otherId !== clientId) {
            //         activeAsteroids[otherId].socket.emit('update-other-asteroid', update);
            //     }
            // }
        }
    }

    for (let clientId in activeClients) {
        activeClients[clientId].player.reportUpdate = false;
    }

    // ASTEROID
    for (let clientId in activeAsteroids) {
        activeAsteroids[clientId].asteroid.reportUpdate = false;
    }
}

//------------------------------------------------------------------
//
// Server side game loop
//
//------------------------------------------------------------------
function gameLoop(currentTime, elapsedTime) {
    processInput();
    update(elapsedTime, currentTime);
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
    function notifyConnect(socket, newPlayer, newAsteroid) {
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
                    speed: newPlayer.speed,
                    size: newPlayer.size
                });

                //
                // Tell the new player about the already connected player
                socket.emit('connect-other', {
                    clientId: client.player.clientId,
                    direction: client.player.direction,
                    position: client.player.position,
                    rotateRate: client.player.rotateRate,
                    speed: client.player.speed,
                    size: client.player.size
                });
            }
        }

        // ASTEROID
        // for (let clientId in activeAsteroids) {
        //     let client = activeAsteroids[clientId];
        //     if (newAsteroid.clientId !== clientId) {
        //         //
        //         // Tell existing about the newly connected player
        //         client.socket.emit('connect-other-asteroid', {
        //             clientId: newAsteroid.clientId,
        //             direction: newAsteroid.direction,
        //             position: newAsteroid.position,
        //             rotateRate: newAsteroid.rotateRate,
        //             rotation: newAsteroid.rotation,
        //             speed: newAsteroid.speed,
        //             size: newAsteroid.size
        //         });
        //
        //         //
        //         // Tell the new player about the already connected player
        //         socket.emit('connect-other-asteroid', {
        //             clientId: client.asteroid.clientId,
        //             direction: client.asteroid.direction,
        //             position: client.asteroid.position,
        //             rotateRate: client.asteroid.rotateRate,
        //             rotation: client.asteroid.rotation,
        //             speed: client.asteroid.speed,
        //             size: client.asteroid.size
        //         });
        //     }
        // }
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

    // ASTEROID
    function notifyDisconnectAsteroid(asteroidId) {
        for (let clientId in activeAsteroids) {
            let client = activeAsteroids[clientId];
            if (asteroidId !== clientId) {
                client.socket.emit('disconnect-other-asteroid', {
                    clientId: asteroidId
                });
            }
        }
    }
    
    io.on('connection', function(socket) {
        console.log('Connection established: ', socket.id);
        //
        // Create an entry in our list of connected clients
        let newPlayer = Player.create();
        newPlayer.clientId = socket.id;
        activeClients[socket.id] = {
            socket: socket,
            player: newPlayer
        };

        // ASTEROID
        let newAsteroid = Asteroid.create();
        console.log('newAsteroid:');
        console.log('direction: ' + newAsteroid.direction);
        console.log('position: ' + newAsteroid.position.x + ', ' + newAsteroid.position.y);
        console.log('rotation: ' + newAsteroid.rotation);
        console.log('rotateRate: ' + newAsteroid.rotateRate);
        console.log('size: ' + newAsteroid.size.width + ', ' + newAsteroid.size.height);
        console.log('speed: ' + newAsteroid.speed);
        newAsteroid.clientId = socket.id;
        activeAsteroids[socket.id] = {
            socket: socket,
            asteroid: newAsteroid
        };


        socket.emit('connect-ack', {
            direction: newPlayer.direction,
            position: newPlayer.position,
            size: newPlayer.size,
            rotateRate: newPlayer.rotateRate,
            speed: newPlayer.speed
        });

        // ASTEROID
        socket.emit('connect-ack-asteroid', {
            direction: newAsteroid.direction,
            position: newAsteroid.position,
            size: newAsteroid.size,
            rotateRate: newAsteroid.rotateRate,
            rotation: newAsteroid.rotation,
            speed: newAsteroid.speed
        });

        socket.on('input', data => {
            inputQueue.push({
                clientId: socket.id,
                message: data
            });
        });

        socket.on('disconnect', function() {
            delete activeClients[socket.id];
            notifyDisconnect(socket.id);
        });

        // ASTEROID
        socket.on('disconnect-asteroid', function() {
            delete activeAsteroids[socket.id];
            // notifyDisconnectAsteroid(socket.id);
        });

        notifyConnect(socket, newPlayer, newAsteroid);
    });
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

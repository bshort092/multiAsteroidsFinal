//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function (graphics, renderer, input, components) {
    'use strict';

    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();
    let playerSelf = {
        model: components.Player(),
        texture: MyGame.assets['player-self']
    };
    let asteroids = {
        model: components.Asteroid(),
        texture: MyGame.assets['asteroid']
    };
    // let asteroids = {};
    let playerOthers = {};
    let messageHistory = MyGame.utilities.Queue();
    let messageId = 1;
    let socket = io();

    //------------------------------------------------------------------
    //
    // Handler for when the server ack's the socket connection.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    socket.on('connect-ack', function (data) {
        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;

        playerSelf.model.size.x = data.size.x;
        playerSelf.model.size.y = data.size.y;

        playerSelf.model.direction = data.direction;
        playerSelf.model.rotateRate = data.rotateRate;
        playerSelf.model.acceleration = data.acceleration;
        playerSelf.model.velocityVector = data.velocityVector;
        playerSelf.model.maxSpeed = data.maxSpeed;
    });

    // ASTEROID
    socket.on('connect-ack-asteroid', function (data) {
        asteroids.model.position.x = data.position.x;
        asteroids.model.position.y = data.position.y;

        asteroids.model.size.x = data.size.x;
        asteroids.model.size.y = data.size.y;

        asteroids.model.direction = data.direction;
        asteroids.model.speed = data.speed;
        asteroids.model.rotateRate = data.rotateRate;
        asteroids.model.rotation = data.rotation;
    });

    //------------------------------------------------------------------
    //
    // Handler for when a new player connects to the game.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    socket.on('connect-other', function (data) {
        let model = components.PlayerRemote();
        model.state.position.x = data.position.x;
        model.state.position.y = data.position.y;
        model.state.direction = data.direction;
        model.state.lastUpdate = performance.now();

        model.goal.position.x = data.position.x;
        model.goal.position.y = data.position.y;
        model.goal.direction = data.direction;
        model.goal.updateWindow = 0;

        model.size.x = data.size.x;
        model.size.y = data.size.y;

        playerOthers[data.clientId] = {
            model: model,
            texture: MyGame.assets['player-other']
        };
    });

    // ASTEROID
    // socket.on('connect-other-asteroid', function (data) {
    //     let model = components.Asteroid();
    //     model.state.position.x = data.position.x;
    //     model.state.position.y = data.position.y;
    //     model.state.direction = data.direction;
    //     model.state.lastUpdate = performance.now();
    //
    //     model.goal.position.x = data.position.x;
    //     model.goal.position.y = data.position.y;
    //     model.goal.direction = data.direction;
    //     model.goal.updateWindow = 0;
    //
    //     model.size.x = data.size.x;
    //     model.size.y = data.size.y;
    //
    //     asteroids[data.clientId] = {
    //         model: model,
    //         texture: MyGame.assets['asteroid']
    //     };
    // });

    //------------------------------------------------------------------
    //
    // Handler for when another player disconnects from the game.
    //
    //------------------------------------------------------------------
    socket.on('disconnect-other', function (data) {
        delete playerOthers[data.clientId];
    });

    // ASTEROID
    // socket.on('disconnect-other-asteroid', function (data) {
    //     delete asteroids[data.clientId];
    // });

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about the self player.
    //
    //------------------------------------------------------------------
    socket.on('update-self', function (data) {
        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;
        playerSelf.model.direction = data.direction;

        //
        // Remove messages from the queue up through the last one identified
        // by the server as having been processed.
        let done = false;
        while (!done && !messageHistory.empty) {
            if (messageHistory.front.id === data.lastMessageId) {
                done = true;
            }
            //console.log('dumping: ', messageHistory.front.id);
            messageHistory.dequeue();
        }

        //
        // Update the client simulation since this last server update, by
        // replaying the remaining inputs.
        let memory = MyGame.utilities.Queue();
        while (!messageHistory.empty) {
            let message = messageHistory.dequeue();
            switch (message.type) {
                case 'move':
                    playerSelf.model.move(message.elapsedTime);
                    break;
                case 'rotate-right':
                    playerSelf.model.rotateRight(message.elapsedTime);
                    break;
                case 'rotate-left':
                    playerSelf.model.rotateLeft(message.elapsedTime);
                    break;
            }
            memory.enqueue(message);
        }
        messageHistory = memory;
    });


    // ASTEROID
    socket.on('update-self-asteroid', function (data) {
        asteroids.model.position.x = data.position.x;
        asteroids.model.position.y = data.position.y;
        asteroids.model.direction = data.direction;
        asteroids.model.rotation = data.rotation;

        //
        // Remove messages from the queue up through the last one identified
        // by the server as having been processed.
        let done = false;
        while (!done && !messageHistory.empty) {
            if (messageHistory.front.id === data.lastMessageId) {
                done = true;
            }
            //console.log('dumping: ', messageHistory.front.id);
            messageHistory.dequeue();
        }
    });

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about other players.
    //
    //------------------------------------------------------------------
    socket.on('update-other', function (data) {
        if (playerOthers.hasOwnProperty(data.clientId)) {
            let model = playerOthers[data.clientId].model;
            model.goal.updateWindow = data.updateWindow;

            model.goal.position.x = data.position.x;
            model.goal.position.y = data.position.y;
            model.goal.direction = data.direction;
        }
    });

    //------------------------------------------------------------------
    //
    // Process the registered input handlers here.
    //
    //------------------------------------------------------------------
    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    //------------------------------------------------------------------
    //
    // Update the game simulation
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        asteroids.model.update(elapsedTime);
        playerSelf.model.update(elapsedTime);
        for (let id in playerOthers) {
            playerOthers[id].model.update(elapsedTime);
        }
    }

    //------------------------------------------------------------------
    //
    // Render the current state of the game simulation
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        renderer.Asteroid.render(asteroids.model, asteroids.texture);
        renderer.Player.render(playerSelf.model, playerSelf.texture);
        for (let id in playerOthers) {
            let player = playerOthers[id];
            renderer.PlayerRemote.render(player.model, player.texture);
        }
        renderer.Player.render(playerSelf.model, playerSelf.texture);
    }

    //------------------------------------------------------------------
    //
    // Client-side game loop
    //
    //------------------------------------------------------------------
    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    //------------------------------------------------------------------
    //
    // Public function used to get the game initialized and then up
    // and running.
    //
    //------------------------------------------------------------------
    function initialize() {
        console.log('game initializing...');
        //
        // Create the keyboard input handler and register the keyboard commands
        myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: 'move'
            };
            socket.emit('input', message);
            messageHistory.enqueue(message);
            playerSelf.model.move(elapsedTime);
        },
            'w', true);

        myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: 'rotate-right'
            };
            socket.emit('input', message);
            messageHistory.enqueue(message);
            playerSelf.model.rotateRight(elapsedTime);
        },
            'd', true);

        myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: 'rotate-left'
            };
            socket.emit('input', message);
            messageHistory.enqueue(message);
            playerSelf.model.rotateLeft(elapsedTime);
        },
            'a', true);

        //
        // Get the game loop started
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize
    };

}(MyGame.graphics, MyGame.renderer, MyGame.input, MyGame.components));

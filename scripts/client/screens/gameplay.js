//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.screens['game-play'] = (function (game, graphics, renderer, input, components, systems) {
    'use strict';

    let lastTimeStamp = performance.now(),
        cancelNextRequest,
        myKeyboard = input.Keyboard(),
        socket = io(),

        playerSelf = {},
        multiAsteroids = [],
        multiUfoLasers = [],
        multiUfos = [],
        multiLasers = [],
        multiPowerups = [],
        myParticles = systems.Manager({
            particlesArray: [],
        }),
        particlesArray = [],
        playerOthers = {},
        messageHistory = MyGame.utilities.Queue(),
        messageId = 1,
        fireTime = 0,
        hyperspaceTime = 3000,
        canFire = true,
        canHyperspace = true,
        controls = null,
        thrustKey = null,
        leftKey = null,
        rightKey = null,
        shootKey = null,
        hyperspaceKey = null,
        current_scores = [{name: '', score: 0}, {name: '', score: 0}, {name: '', score: 0}, {name: '', score: 0}, {name: '', score: 0}];

    //------------------------------------------------------------------
    //
    // Handler for when the server ack's the socket connection.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    socket.on('connect-ack', function (data) {
        playerSelf.model.momentum.x = data.momentum.x;
        playerSelf.model.momentum.y = data.momentum.y;

        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;

        playerSelf.model.size.x = data.size.x;
        playerSelf.model.size.y = data.size.y;

        playerSelf.model.direction = data.direction;
        playerSelf.model.rotateRate = data.rotateRate;
        playerSelf.model.thrustRate = data.thrustRate;
        playerSelf.model.maxSpeed = data.maxSpeed;
        playerSelf.model.radius = data.radius;
        playerSelf.model.score = data.score;
        playerSelf.model.firingRate = data.firingRate;
        playerSelf.model.firingRateTime = data.firingRateTime,
        playerSelf.model.hasWiderSpread = data.hasWiderSpread,
        playerSelf.model.widerSpreadTime = data.widerSpreadTime,
        playerSelf.model.hasShield = data.hasShield,
        playerSelf.model.blinking = data.blinking,
        playerSelf.model.shieldTime = data.shieldTime,
        playerSelf.model.hasGuidedMissles = data.hasGuidedMissles,
        playerSelf.model.guidedMisslesTime = data.guidedMisslesTime,
        playerSelf.model.name = data.name;
        playerSelf.model.playerNumber = data.playerNumber;
    });

    //------------------------------------------------------------------
    //
    // Handler for when a new player connects to the game.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    socket.on('connect-other', function (data) {
        let model = components.PlayerRemote();
        model.state.momentum.x = data.momentum.x;
        model.state.momentum.y = data.momentum.y;

        model.state.position.x = data.position.x;
        model.state.position.y = data.position.y;
        model.state.direction = data.direction;
        model.state.lastUpdate = performance.now();
        model.state.score = data.score;
        model.state.firingRate = data.firingRate;
        model.state.firingRateTime = data.firingRateTime,
        model.state.hasWiderSpread = data.hasWiderSpread,
        model.state.widerSpreadTime = data.widerSpreadTime,
        model.state.hasShield = data.hasShield,
        model.state.shieldTime = data.shieldTime,
        model.state.hasGuidedMissles = data.hasGuidedMissles,
        model.state.guidedMisslesTime = data.guidedMisslesTime,
        model.state.name = data.name;
        model.state.playerNumber = data.playerNumber;

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

    //------------------------------------------------------------------
    //
    // Handler for when another player disconnects from the game.
    //
    //------------------------------------------------------------------
    socket.on('disconnect-other', function (data) {
        delete playerOthers[data.clientId];
    });

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about the self player.
    //
    //------------------------------------------------------------------
    socket.on('update-self', function (data) {
        playerSelf.model.momentum.x = data.momentum.x;
        playerSelf.model.momentum.y = data.momentum.y;

        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;
        playerSelf.model.direction = data.direction;
        playerSelf.model.score = data.score;
        playerSelf.model.firingRate = data.firingRate;
        playerSelf.model.firingRateTime = data.firingRateTime,
        playerSelf.model.hasWiderSpread = data.hasWiderSpread,
        playerSelf.model.widerSpreadTime = data.widerSpreadTime,
        playerSelf.model.hasShield = data.hasShield,
        playerSelf.model.blinking = data.blinking,
        playerSelf.model.shieldTime = data.shieldTime,
        playerSelf.model.hasGuidedMissles = data.hasGuidedMissles,
        playerSelf.model.guidedMisslesTime = data.guidedMisslesTime,
        playerSelf.model.name = data.name;
        playerSelf.model.playerNumber = data.playerNumber;

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
                case 'thrust':
                    playerSelf.model.thrust(message.elapsedTime);
                    break;
                case 'rotate-right':
                    playerSelf.model.rotateRight(message.elapsedTime);
                    break;
                case 'rotate-left':
                    playerSelf.model.rotateLeft(message.elapsedTime);
                    break;
                // case 'fire-laser':
                //     playerSelf.model.fireLaser(message.elapsedTime);
                //     break;
            }
            memory.enqueue(message);
        }
        messageHistory = memory;
    });

    socket.on('update-self-asteroid', function (data) {
        multiAsteroids = [];
        for (let i = 0; i < data.asteroids.length; i++) {
            multiAsteroids.push({
                model: components.Asteroid(),
                texture: MyGame.assets['asteroid']
            })
            multiAsteroids[i].model.position.x = data.asteroids[i].position.x;
            multiAsteroids[i].model.position.y = data.asteroids[i].position.y;
            multiAsteroids[i].model.direction = data.asteroids[i].direction;
            multiAsteroids[i].model.rotation = data.asteroids[i].rotation;
            multiAsteroids[i].model.size = data.asteroids[i].size;
            multiAsteroids[i].model.radius = data.asteroids[i].radius;
        }
    });

    socket.on('update-self-ufo', function (data) {
        multiUfos = [];
        for (let i = 0; i < data.ufos.length; i++) {
            multiUfos.push({
                model: components.Ufo(),
                texture: MyGame.assets['ufo']
            })
            multiUfos[i].model.position.x = data.ufos[i].position.x;
            multiUfos[i].model.position.y = data.ufos[i].position.y;
            multiUfos[i].model.direction = data.ufos[i].direction;
            multiUfos[i].model.rotation = data.ufos[i].rotation;
            multiUfos[i].model.size = data.ufos[i].size;
            multiUfos[i].model.radius = data.ufos[i].radius;
        }
    });

    socket.on('update-self-powerup', function (data) {
        multiPowerups = [];
        for (let i = 0; i < data.powerups.length; i++) {
            if (data.powerups[i].type === 'rate') {
                multiPowerups.push({
                    model: components.Powerup(),
                    texture: MyGame.assets['copperCoin']
                })
            }
            if (data.powerups[i].type === 'spread') {
                multiPowerups.push({
                    model: components.Powerup(),
                    texture: MyGame.assets['silverCoin']
                })
            }
            if (data.powerups[i].type === 'guided') {
                multiPowerups.push({
                    model: components.Powerup(),
                    texture: MyGame.assets['goldCoin']
                })
            }
            if (data.powerups[i].type === 'shield') {
                multiPowerups.push({
                    model: components.Powerup(),
                    texture: MyGame.assets['blueYellowCoin']
                })
            }
            multiPowerups[i].model.position.x = data.powerups[i].position.x;
            multiPowerups[i].model.position.y = data.powerups[i].position.y;
            multiPowerups[i].model.size = data.powerups[i].size;
            multiPowerups[i].model.radius = data.powerups[i].radius;
            multiPowerups[i].model.type = data.powerups[i].type;
            multiPowerups[i].model.spriteCount = data.powerups[i].spriteCount;
            multiPowerups[i].model.spriteTime = data.powerups[i].spriteTime;
            multiPowerups[i].model.animationTime = data.powerups[i].animationTime;
            multiPowerups[i].model.subImageIndex = data.powerups[i].subImageIndex;
            multiPowerups[i].model.subTextureWidth = data.powerups[i].subTextureWidth;
        }
    });

    socket.on('update-self-laser', function (data) {
        multiLasers = [];
        for (let i = 0; i < data.lasers.length; i++) {
            multiLasers.push({
                model: components.Laser(),
                texture: MyGame.assets['laser']
            })
            multiLasers[i].model.position.x = data.lasers[i].position.x;
            multiLasers[i].model.position.y = data.lasers[i].position.y;
            multiLasers[i].model.direction = data.lasers[i].direction;
            multiLasers[i].model.shipId = data.lasers[i].shipId;
            multiLasers[i].model.radius = data.lasers[i].radius;
            multiLasers[i].model.speed = data.lasers[i].speed;
        }
    });

    socket.on('update-ufo-laser', function (data) {
        multiUfoLasers = [];
        for (let i = 0; i < data.ufoLasers.length; i++) {
            multiUfoLasers.push({
                model: components.Laser(),
                texture: MyGame.assets['ufoLaser']
            })
            multiUfoLasers[i].model.position.x = data.ufoLasers[i].position.x;
            multiUfoLasers[i].model.position.y = data.ufoLasers[i].position.y;
            multiUfoLasers[i].model.direction = data.ufoLasers[i].direction;
            multiUfoLasers[i].model.radius = data.ufoLasers[i].radius;
            multiUfoLasers[i].model.speed = data.ufoLasers[i].speed;
        }
    });
    socket.on('highScores', function (data) {
        game.highScores = data.highScores;
    });

    socket.on('create-particle-system', function (data) {
        //data: 
        //type of system (ship explosion, asteroid breakup, etc.)
        //postion of system
        if (data.type === "asteroidBreakup") {
            myParticles.createAsteroidBreakup(data.position.x, data.position.y, particlesArray);
            MyGame.assets['shipBulletHitsAsteroid'].pause();
            if(game.gameIsActive){
                MyGame.assets['shipBulletHitsAsteroid'].play();
            }
        }
        if (data.type === "shipDestroyed") {
            myParticles.createShipExplosion(data.position.x, data.position.y, particlesArray);
            if(game.gameIsActive){
                MyGame.assets['shipHitsObject'].play();
            }
        }
        if (data.type === "ufoDestroyed") {
            myParticles.createUFOExplosion(data.position.x, data.position.y, particlesArray);
            if(game.gameIsActive){
                MyGame.assets['shipBulletHitsUfo'].play();
            }
        }
        if (data.type === "powerupPickup") {
            myParticles.createPowerupPickup(data.position.x, data.position.y, particlesArray);
            if(game.gameIsActive){
                MyGame.assets['coin'].volume = .3;
                MyGame.assets['coin'].play();
            }
        }
        if (data.type === "thrust") {
            // myParticles.createThrustParticles(data.position.x, data.position.y, particlesArray);
        }        
        if (data.type === "sadParticles") {
            myParticles.createSadParticles(data.position.x, data.position.y, particlesArray);
        }
        if (data.type === "hyperspace") {
            myParticles.createHyperspace(data.position.x, data.position.y, particlesArray);
            if(game.gameIsActive) {
                MyGame.assets['hyperspace'].play();
            }
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

            model.state.momentum.x = data.momentum.x;
            model.state.momentum.y = data.momentum.y;
            model.state.score = data.score;
            model.state.firingRate = data.firingRate;
            model.state.firingRateTime = data.firingRateTime,
            model.state.hasWiderSpread = data.hasWiderSpread,
            model.state.widerSpreadTime = data.widerSpreadTime,
            model.state.hasShield = data.hasShield,
            model.state.shieldTime = data.shieldTime,
            model.state.hasGuidedMissles = data.hasGuidedMissles,
            model.state.guidedMisslesTime = data.guidedMisslesTime,
            model.state.name = data.name;
            model.state.playerNumber = data.playerNumber;

            model.goal.position.x = data.position.x;
            model.goal.position.y = data.position.y;
            model.goal.direction = data.direction;
        }
    });

    function callEscape() {
        // game.pauseSound('backgroundSound');
        socket.emit('changeName', '');
        socket.emit('disconnect');
        cancelNextRequest = true;
        myKeyboard.unregisterHandler(controls['Thrust'], thrustKey);
        myKeyboard.unregisterHandler(controls['Rotate_Left'], leftKey);
        myKeyboard.unregisterHandler(controls['Rotate_Right'], rightKey);
        myKeyboard.unregisterHandler(controls['Hyperspace'], hyperspaceKey);
        myKeyboard.unregisterHandler(controls['Shoot'], shootKey);
        // socket.emit('quit');
        game.showScreen('main-menu');
    }

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
        // for (let i = 0; i < multiAsteroids.length; i++) { multiAsteroids[i].model.update(); }
        // for (let i = 0; i < multiUfos.length; i++) { multiUfos[i].model.update(); }
        // multiLasers.forEach(laser => { laser.model.update(elapsedTime); });
        // multiUfoLasers.forEach(laser => { laser.model.update(elapsedTime); });
        // multiPowerups.forEach(powerup => { powerup.model.update(elapsedTime); });

        


        myParticles.updateParticleSystems(elapsedTime);

        fireTime += elapsedTime;
        if (fireTime >= playerSelf.model.firingRate) {
            canFire = true;
            fireTime -= playerSelf.model.firingRate;
        }

        hyperspaceTime += elapsedTime;
        if (hyperspaceTime >= 3000) {
            canHyperspace = true;
            hyperspaceTime = 3000;
        }

        playerSelf.model.update(elapsedTime);

        document.getElementById("game_status_1").innerHTML = '';
        document.getElementById("game_status_2").innerHTML = '';
        document.getElementById("game_status_3").innerHTML = '';
        document.getElementById("game_status_4").innerHTML = '';
        
        document.getElementById("my_score").innerHTML = playerSelf.model.name + ': ' + playerSelf.model.score;
        updateStatus(playerSelf.model);

        document.getElementById("other_score").innerHTML = '';
        for (let id in playerOthers) {
            if(playerOthers[id].model.state.name != '' && playerOthers[id].model.state.name != undefined && playerOthers[id].model.state.playerNumber != null) {
                playerOthers[id].model.update(elapsedTime);
                document.getElementById("other_score").innerHTML += playerOthers[id].model.state.name + ': ' + playerOthers[id].model.state.score + '<br>';
                updateStatus(playerOthers[id].model.state);
            }
        }
        
    }
    function updateStatus(attribute) {
        let gameStatus = document.getElementById("game_status_" + attribute.playerNumber)
        if(attribute.hasShield || attribute.hasWiderSpread || attribute.firingRate < 250 || attribute.hasGuidedMissles){
            gameStatus.innerHTML = attribute.name + ' has '
            if(attribute.hasShield){
                gameStatus.innerHTML += ' a shield, '
            }
            if(attribute.hasWiderSpread){
                gameStatus.innerHTML += ' multiple missiles, '
            }
            if(attribute.firingRate < 250){
                gameStatus.innerHTML += ' faster firing speed, '
            }
            if(attribute.hasGuidedMissles){
                gameStatus.innerHTML += ' guided missiles, '
            }
        }
        else if(attribute.score >= 100000){
            gameStatus.innerHTML = attribute.name + ' has surpassed a score of 100,000'
        }
        else if(attribute.score >= 50000){
            gameStatus.innerHTML = attribute.name + ' has surpassed a score of 50,000'
        }
        else if(attribute.score >= 25000){
            gameStatus.innerHTML = attribute.name + ' has surpassed a score of 25,000'
        }
        else if(attribute.score >= 10000){
            gameStatus.innerHTML = attribute.name + ' has surpassed a score of 10,000'
        }
    }

    //------------------------------------------------------------------
    //
    // Render the current state of the game simulation
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();

        renderer.Tiles.render();

        renderer.Manager.render(myParticles);

        for (let i = 0; i < multiAsteroids.length; i++) {
            renderer.Asteroid.render(multiAsteroids[i].model, multiAsteroids[i].texture);
        }

        for (let i = 0; i < multiUfoLasers.length; i++) {
            renderer.Laser.render(multiUfoLasers[i].model, multiUfoLasers[i].texture);
        }

        for (let i = 0; i < multiUfos.length; i++) {
            renderer.Ufo.render(multiUfos[i].model, multiUfos[i].texture);
        }

        for (let i = 0; i < multiLasers.length; i++) {
            renderer.Laser.render(multiLasers[i].model, multiLasers[i].texture);
        }

        for (let i = 0; i < multiPowerups.length; i++) {
            renderer.Powerup.render(multiPowerups[i].model, multiPowerups[i].texture);
        }

        renderer.Player.render(playerSelf.model, playerSelf.texture);
        for (let id in playerOthers) {
            let player = playerOthers[id];
            if(player.model.state.name != '' && player.model.state.name != undefined && player.model.state.playerNumber != null) {
                renderer.PlayerRemote.render(player.model, player.texture);
            }
        }
        renderer.Player.render(playerSelf.model, playerSelf.texture);

        var c = document.getElementById("canvas-main");
        var ctx = c.getContext("2d");

        ctx.save();

        ctx.fillStyle = 'lightblue'
        ctx.fillRect(250, 10, hyperspaceTime / 30, 20);

        ctx.fillStyle = 'black';
        ctx.font = '12pt Arial';
        ctx.lineWidth = .2;
        ctx.textBaseline = 'top';
        ctx.fillText("Hyperspace", 260, 12);
        ctx.restore();
    }

    //------------------------------------------------------------------
    //
    // Client-side game loop
    //
    //------------------------------------------------------------------
    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        if(playerSelf.model.name != '' && playerSelf.model.name != undefined && playerSelf.model.playerNumber != null) {
            processInput(elapsedTime);
            update(elapsedTime);
            render();
        }

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

        playerSelf = {
            model: components.Player(),
            texture: MyGame.assets['player-self']
        };

        playerOthers = {};
        messageHistory = MyGame.utilities.Queue();
        messageId = 1;

        myKeyboard.registerHandler(elapsedTime => {
            callEscape();
        },
            'Escape', true);
    }

    function run() {
        // start in a safe location:
        socket.emit('startSafe', playerSelf.model);
        //
        
        if(playerSelf.model.playerNumber == null){
            cancelNextRequest = true;
            game.showScreen('main-menu');
        }
        let username = document.getElementById("username").value;
        socket.emit('changeName', username);
        // Create the keyboard input handler and register the keyboard commands
        let defaultControls = { Thrust: 'ArrowUp', Rotate_Left: 'ArrowLeft', Rotate_Right: 'ArrowRight', Shoot: ' ', Hyperspace: 'z' }
        let current_controls = localStorage.getItem('MultiAsteroids.controls');
        controls = JSON.parse(current_controls)

        for (let key in controls) {
            if (controls[key] == '') { controls[key] = [defaultControls[key]] }
        }

        thrustKey = myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: 'thrust'
            };
            socket.emit('input', message);
            messageHistory.enqueue(message);
            playerSelf.model.thrust(elapsedTime);
        },
            controls['Thrust'], true);

        rightKey = myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: 'rotate-right'
            };
            socket.emit('input', message);
            messageHistory.enqueue(message);
            playerSelf.model.rotateRight(elapsedTime);
        },
            controls['Rotate_Right'], true);

        leftKey = myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: 'rotate-left'
            };
            socket.emit('input', message);
            messageHistory.enqueue(message);
            playerSelf.model.rotateLeft(elapsedTime);
        },
            controls['Rotate_Left'], true);

        shootKey = myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: 'fire-laser'
            };
            if (canFire) {
                canFire = false;
                fireTime = 0;
                socket.emit('input', message);
                messageHistory.enqueue(message);
                if(game.gameIsActive){
                    MyGame.assets['laserSound'].volume = .3;
                    MyGame.assets['laserSound'].play();
                }
            }
        },
            controls['Shoot'], true);

        hyperspaceKey = myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: 'hyperspace'
            };
            if (canHyperspace) {
                canHyperspace = false;
                hyperspaceTime = 0;
                socket.emit('input', message);
                messageHistory.enqueue(message);
            }
        },
            controls['Hyperspace'], true);

        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
        if(game.gameIsActive){
            MyGame.assets['backgroundSound'].play();
        }
        else {
            MyGame.assets['backgroundSound'].pause();
        }
    }

    return {
        initialize: initialize,
        run: run,
    };

}(MyGame.game, MyGame.graphics, MyGame.renderer, MyGame.input, MyGame.components, MyGame.systems));

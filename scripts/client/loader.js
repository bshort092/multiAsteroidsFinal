MyGame = {
    input: {},
    components: {},
    renderer: {},
    utilities: {},
    assets: {},
    game: {},
    screens: {},
    systems: {}
};

//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//
//------------------------------------------------------------------

MyGame.loader = (function () {
    'use strict';
    let scriptOrder = [
        {
            scripts: ['input'],
            message: 'Input loaded',
            onComplete: null
        }, {
            scripts: ['screens/game'],
            message: 'Game is loaded'
        }, {
            scripts: ['queue'],
            message: 'Utilities loaded',
            onComplete: null,
        }, {
            scripts: ['laser', 'player', 'player-remote', 'asteroid', 'ufo', 'viewport', 'powerup'],
            message: 'Player and Asteroid models loaded',
            onComplete: null
        }, {
            scripts: ['rendering/graphics'],
            message: 'Graphics loaded',
            onComplete: null
        }, {
            scripts: ['rendering/player', 'rendering/player-remote', 'rendering/asteroid', 'rendering/laser', 'rendering/ufo', 'rendering/tiles', 'rendering/particle_manager', 'rendering/particle_system', 'rendering/powerup'],
            message: 'Renderers loaded',
            onComplete: null
        }, {
            scripts: ['systems/random', 'systems/particle_system', 'systems/particle_manager'],
            message: 'Systems loaded',
            onComplete: null
        }, {
            scripts: ['screens/gameplay', 'screens/about', 'screens/help', 'screens/highscores', 'screens/mainmenu',],
            message: 'Screens loaded',
            onComplete: null,
        },],
        assetOrder = [{
            key: 'player-self',
            source: 'assets/blueShip.png'
        }, {
            key: 'player-other',
            source: 'assets/greenShip.png'
        }, {
            key: 'asteroid',
            source: 'assets/asteroid.png'
        }, {
            key: 'laser',
            source: 'assets/laser.png'
        }, {
            key: 'ufoLaser',
            source: 'assets/ufoLaser.png'
        }, {
            key: 'blue',
            source: 'assets/particles/blueLight.png'
        }, {
            key: 'black',
            source: 'assets/particles/blackLight.png'
        }, {
            key: 'fire',
            source: 'assets/particles/fire.png'
        }, {
            key: 'green',
            source: 'assets/particles/greenLight.png'
        }, {
            key: 'rainbow',
            source: 'assets/particles/rainbowLight.png'
        }, {
            key: 'smoke',
            source: 'assets/particles/smoke-2.png'
        }, {
            key: 'lighter_smoke',
            source: 'assets/particles/smokeLight.png'
        }, {
            key: 'white',
            source: 'assets/particles/whiteLight.png'
        }, {
            key: 'yellow',
            source: 'assets/particles/yellowLight.png'
        },{
            key: 'ufo',
            source: 'assets/ufo.jpg'
        }, {
            key: 'background',
            source: 'assets/outer_space.jpg'
        }, {
            key: 'copperCoin',
            source: 'assets/sprites/coin_copper.png'
        }, {
            key: 'silverCoin',
            source: 'assets/sprites/coin_silver.png'
        }, {
            key: 'goldCoin',
            source: 'assets/sprites/coin_gold.png'
        }, {
            key: 'blueYellowCoin',
            source: 'assets/sprites/coin_blue_yellow.png'
        }, {
            key: 'backgroundSound',
            source: 'assets/sounds/AsteroidsBackground.mp3'
        }, {
            key: 'laserSound',
            source: 'assets/sounds/laserSound.mp3'
        }, {
            key: 'shipBulletHitsAsteroid',
            source: 'assets/sounds/shipBulletHitsAsteroid.mp3'
        }, {
            key: 'shipBulletHitsUfo',
            source: 'assets/sounds/alienShipDeath.mp3'
        }, {
            key: 'shipHitsObject',
            source: 'assets/sounds/shipExplosion.mp3'
        }, {
            key: 'coin',
            source: 'assets/sounds/coin.mp3'
        }, {
            key: 'hyperspace',
            source: 'assets/sounds/hyperspace.mp3'
        }
    ];
    
    function numberPad(n, p, c) {
        var pad_char = typeof c !== 'undefined' ? c : '0',
            pad = new Array(1 + p).join(pad_char);
        return (pad + n).slice(-pad.length);
    }

    function prepareTiledImage(assetArray, rootName, rootKey, sizeX, sizeY, tileSize) {
        let numberX = sizeX / tileSize;
        let numberY = sizeY / tileSize;
        //
        // Create an entry in the assets that holds the properties of the tiled image
        MyGame.assets[rootKey] = {
            width: sizeX,
            height: sizeY,
            tileSize: tileSize
        };
        for (let tileY = 0; tileY < numberY; tileY += 1) {
            for (let tileX = 0; tileX < numberX; tileX += 1) {
                let tileFile = numberPad((tileY * numberX + tileX), 4);
                let tileSource = rootName + tileFile + '.jpg';
                let tileKey = rootKey + tileFile;
                assetArray.push({
                    key: tileKey,
                    source: tileSource
                });
            }
        }
    }
    prepareTiledImage(assetOrder, 'assets/TileImages/tiles', 'background', 1920, 1152, 128);

    //------------------------------------------------------------------
    //
    // Helper function used to load scripts in the order specified by the
    // 'scripts' parameter.  'scripts' expects an array of objects with
    // the following format...
    //    {
    //        scripts: [script1, script2, ...],
    //        message: 'Console message displayed after loading is complete',
    //        onComplete: function to call when loading is complete, may be null
    //    }
    //
    //------------------------------------------------------------------
    function loadScripts(scripts, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (scripts.length > 0) {
            let entry = scripts[0];
            require(entry.scripts, function () {
                console.log(entry.message);
                if (entry.onComplete) {
                    entry.onComplete();
                }
                scripts.splice(0, 1);
                loadScripts(scripts, onComplete);
            });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // Helper function used to load assets in the order specified by the
    // 'assets' parameter.  'assets' expects an array of objects with
    // the following format...
    //    {
    //        key: 'asset-1',
    //        source: 'assets/url/asset.png'
    //    }
    //
    // onSuccess is invoked per asset as: onSuccess(key, asset)
    // onError is invoked per asset as: onError(error)
    // onComplete is invoked once per 'assets' array as: onComplete()
    //
    //------------------------------------------------------------------
    function loadAssets(assets, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (assets.length > 0) {
            let entry = assets[0];
            loadAsset(entry.source,
                function (asset) {
                    onSuccess(entry, asset);
                    assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                },
                function (error) {
                    onError(error);
                    assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest(),
            asset = null,
            fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = 'blob';

            xhr.onload = function () {
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3') {
                        asset = new Audio();
                    } else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    asset.onload = function () {
                        window.URL.revokeObjectURL(asset.src);
                    };
                    asset.src = window.URL.createObjectURL(xhr.response);
                    if (onSuccess) { onSuccess(asset); }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }

        xhr.send();
    }

    //------------------------------------------------------------------
    //
    // Called when all the scripts are loaded, it kicks off the demo app.
    //
    //------------------------------------------------------------------
    function mainComplete() {
        console.log('it is all loaded up');
        // MyGame.main.initialize();
        MyGame.game.initialize();
    }

    //
    // Start with loading the assets, then the scripts.
    console.log('Starting to dynamically load project assets');
    loadAssets(assetOrder,
        function (source, asset) {    // Store it on success
            MyGame.assets[source.key] = asset;
        },
        function (error) {
            console.log(error);
        },
        function () {
            console.log('All assets loaded');
            console.log('Starting to dynamically load project scripts');
            loadScripts(scriptOrder, mainComplete);
        }
    );

}());

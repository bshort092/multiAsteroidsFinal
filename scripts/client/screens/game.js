MyGame.game = (function(screens) {
    'use strict';

    let my_score = 0;
    let pastScreen = 'main-menu';
    let gameIsActive = false;
    let scoreIsUpdated = false;
    let highScores;
    let previousScores;
    let top_five;

    // let sounds = [{id: 0, name: 'backgroundSound', src: ''}]

    // function loadAudio() {
    //     sounds.backgroundSound = loadSound('assets/sounds/AsteroidsBackground.mp3');

    //     // MyGame.assets['backgroundSound'] = loadSound('assets/sounds/AsteroidsBackground.mp3');
    //     // MyGame.assets['shipBullet'] = loadSound('assets/sounds/shipBullet.wav' );
    //     // MyGame.assets['shipBulletHitsAsteroid'] = loadSound('assets/sounds/shipBulletHitsAsteroid.wav' );
    //     // MyGame.assets['shipBulletHitsUfo'] = loadSound('assets/sounds/shipBulletHitsUfo.wav' );
    //     // MyGame.assets['shipHitsObject'] = loadSound('assets/sounds/shipHitsObject.wav' );
    //     // MyGame.assets['ufoBullet'] = loadSound('assets/sounds/ufoBullet.wav' );
    //     // MyGame.assets['ufoBulletHitsShip'] = loadSound('assets/sounds/ufoBulletHitsShip.wav' );
    // }
    // function loadSound(source) {
    //     let sound = new Audio();
    //     sound.addEventListener('play', function() {});
    //     sound.addEventListener('pause', function() {});
    //     sound.addEventListener('ended', function() {
    //         if(source === 'assets/sounds/AsteroidsBackground.mp3') {
    //             MyGame.assets['backgroundSound'].play()
    //         }
    //     });
    //     sound.addEventListener('timeupdate', function() {});
    //     sound.src = source;
    //     return sound;
    // }
    // function playSound(whichSound){
    //     // MyGame.assets[whichSound].pause();
    //     // MyGame.assets[whichSound].currentTime = 0;
    //     // MyGame.assets[whichSound].play();
    // }
    // function playSoundBackground(whichSound){
    //     MyGame.assets[whichSound].play();
    // }
    // function pauseSound(whichSound){
    //     MyGame.assets[whichSound].pause();
    // }
    // function changeVolume(whichSound, value){
    //     MyGame.assets[whichSound].volume = value / 100;
    // }

    function updateHighScores() {
        if(!gameIsActive && !scoreIsUpdated){
            for(let i = 0; i < 5; i++) {
                if(my_score >= top_five[i]){
                    top_five.splice(i, 0, my_score);
                    top_five.pop();
                    break;
                }
            }
            for(let i = 1; i <= 5; i++) {
                highScores[i.toString()] = top_five[i - 1];
            }
            localStorage['MultiAsteroids.HighScores'] = JSON.stringify(highScores);
            scoreIsUpdated = true;
        }
    }

    function initialize() {
        highScores = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0};
        previousScores = localStorage.getItem('MultiAsteroids.HighScores');
        if (previousScores !== null) {
            highScores = JSON.parse(previousScores);
        }
        top_five = [highScores['1'],highScores['2'],highScores['3'],highScores['4'],highScores['5']];

        // loadAudio();

        let screen = null;
        for (screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }
        showScreen('main-menu');
    }
    function showScreen(id) {
        if(id === 'game-play') {
            gameIsActive = true;
        }
        if(id === 'main-menu') {
            gameIsActive = false;
        }

        let active = document.getElementsByClassName('active');
        if(active.item(id) !== null) {
            pastScreen = active.item(id).id;
            if(pastScreen === 'game-play') {
                my_score = screens['game-play'].score;
                scoreIsUpdated = false;
            }
        }

        updateHighScores();

        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }
        screens[id].run();
        document.getElementById(id).classList.add('active');
    }

    return {
        // playSound: playSound,
        // playSoundBackground: playSoundBackground,
        // pauseSound: pauseSound,
        // changeVolume: changeVolume,
        get my_score() { return my_score; },
        get gameIsActive() { return gameIsActive; },
        get pastScreen() { return pastScreen; },
        get highScores() { return highScores; },
        initialize : initialize,
        showScreen : showScreen,
    };
}(MyGame.screens));
MyGame.game = (function(screens) {
    'use strict';

    let my_score = 0;
    let pastScreen = 'main-menu';
    let gameIsActive = false;
    let scoreIsUpdated = false;
    let highScores;
    let top_five;
    let previousScores;

    // function loadAudio() {
    //     MyGame.sounds = {};
    //     MyGame.sounds['background'] = loadSound('assets/AsteroidsBackground.mp3');
    //     MyGame.sounds['shipBullet'] = loadSound('assets/shipBullet.wav' );
    //     MyGame.sounds['shipBulletHitsAsteroid'] = loadSound('assets/shipBulletHitsAsteroid.wav' );
    //     MyGame.sounds['shipBulletHitsUfo'] = loadSound('assets/shipBulletHitsUfo.wav' );
    //     MyGame.sounds['shipHitsObject'] = loadSound('assets/shipHitsObject.wav' );
    //     MyGame.sounds['ufoBullet'] = loadSound('assets/ufoBullet.wav' );
    //     MyGame.sounds['ufoBulletHitsShip'] = loadSound('assets/ufoBulletHitsShip.wav' );
    // }
    // function loadSound(source) {
    //     let sound = new Audio();
    //     sound.addEventListener('play', function() {});
    //     sound.addEventListener('pause', function() {});
    //     sound.addEventListener('ended', function() {
    //         if(source === 'assets/AsteroidsBackground.mp3') {
    //             MyGame.sounds['background'].play()
    //         }
    //     });
    //     sound.addEventListener('timeupdate', function() {});
    //     sound.src = source;
    //     return sound;
    // }
    // function playSound(whichSound){
    //     MyGame.sounds[whichSound].pause();
    //     MyGame.sounds[whichSound].currentTime = 0;
    //     MyGame.sounds[whichSound].play();
    // }
    // function playSoundBackground(whichSound){
    //     MyGame.sounds[whichSound].play();
    // }
    // function pauseSound(whichSound){
    //     MyGame.sounds[whichSound].pause();
    // }
    // function changeVolume(whichSound, value){
    //     MyGame.sounds[whichSound].volume = value / 100;
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
        if(id === 'game-pause' || id === 'game-play') {
            gameIsActive = true;
        }
        if(id === 'main-menu' || id === 'game-over') {
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
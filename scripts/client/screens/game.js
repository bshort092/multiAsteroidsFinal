MyGame.game = (function(screens) {
    'use strict';

    let pastScreen = 'main-menu';
    let gameIsActive = false;
    let highScores = [{name: '', score: 0}, {name: '', score: 0}, {name: '', score: 0}, {name: '', score: 0}, {name: '', score: 0}];
    
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

    function initialize() {
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
        get gameIsActive() { return gameIsActive; },
        get pastScreen() { return pastScreen; },
        get highScores() { return highScores; },
        set highScores(newList) { highScores = newList},
        initialize : initialize,
        showScreen : showScreen,
    };
}(MyGame.screens));
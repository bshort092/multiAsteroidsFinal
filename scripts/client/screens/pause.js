MyGame.screens['game-pause'] = (function(game) {
    'use strict';

    function initialize() {
        document.getElementById('id-resume-game').addEventListener(
            'click',
            function() {game.showScreen('game-play'); });

        document.getElementById('id-game-high-scores').addEventListener(
            'click',
            function() { game.showScreen('high-scores'); });

        document.getElementById('id-game-help').addEventListener(
            'click',
            function() { game.showScreen('help'); });

        document.getElementById('id-game-about').addEventListener(
            'click',
            function() { game.showScreen('about'); });

        document.getElementById('id-main-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });
    }

    function run() {}

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));

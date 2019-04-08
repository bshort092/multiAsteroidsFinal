MyGame.screens['game-over'] = (function(game) {
    'use strict';

    function initialize() {
        document.getElementById('id-game-main-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });
    }

    function run() {
        let endingMessage = document.getElementById('endingMessage');
        let finalScore = document.getElementById('finalScore');
        endingMessage.innerHTML = MyGame.screens['game-play'].endMessage;
        finalScore.innerHTML = 'Final Score: ' + game.my_score;
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
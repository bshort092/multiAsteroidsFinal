MyGame.screens['high-scores'] = (function(game) {
    'use strict';

    function initialize() {
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function() {
                if(game.pastScreen === 'game-pause') {
                    game.showScreen('game-pause');
                }
                else {
                    game.showScreen('main-menu');
                }
            });
    }
    
    function run() {
        let high_scores = document.getElementById('scores');
        high_scores.innerHTML = '';
        for (let key in game.highScores) {
            high_scores.innerHTML += (key + ': ' + game.highScores[key] + '<br/>');
        }
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));

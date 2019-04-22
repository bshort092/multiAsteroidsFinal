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

        let current_scores = game.highScores;
        for (let i = 0; i < current_scores.length; i++) {
            if(current_scores[i].name == ''){current_scores[i].name = i+1}
            high_scores.innerHTML += (current_scores[i].name + ': ' + current_scores[i].score + '<br/>');
        }
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));

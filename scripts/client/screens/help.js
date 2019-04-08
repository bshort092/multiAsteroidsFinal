MyGame.screens['help'] = (function(game) {
    'use strict';
    
    function initialize() {
        document.getElementById('id-help-back').addEventListener(
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
    
    function run() {}
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));

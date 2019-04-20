MyGame.screens['main-menu'] = (function(game) {
    'use strict';
    
    function initialize() {
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() {
                if( document.getElementById("username").value !== ''){
                    document.getElementById("valid_username").innerHTML = '';
                    game.showScreen('game-play'); 
                }
                else {
                    document.getElementById("valid_username").innerHTML = 'You must provide a name.';
                }
            });
        
        document.getElementById('id-high-scores').addEventListener(
            'click',
            function() { game.showScreen('high-scores'); });
        
        document.getElementById('id-help').addEventListener(
            'click',
            function() { game.showScreen('help'); });

        document.getElementById('id-about').addEventListener(
            'click',
            function() { game.showScreen('about'); });
    }
    
    function run() {}
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));

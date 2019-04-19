MyGame.screens['help'] = (function(game) {
    'use strict';
    let controls = null;
    
    function initialize() {
        let current_controls = localStorage.getItem('MultiAsteroids.controls');
        controls = {Thrust: 'ArrowUp', Rotate_Left: 'ArrowLeft', Rotate_Right: 'ArrowRight', Shoot : ' ', Hyperspace: 'z'}
        if(current_controls !== null){
            controls = JSON.parse(current_controls)
        }
        else {
            localStorage['MultiAsteroids.controls'] = JSON.stringify(controls);
        }
        
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
    
    function run() {
        let current_controls = localStorage.getItem('MultiAsteroids.controls');
        controls = JSON.parse(current_controls)
        
        let controlList = document.getElementById("controlList");
        let key = controlList.options[controlList.selectedIndex].value;
        let value = controls[key];
        document.getElementById("controlKeys").value = '';
        let displayValue = document.getElementById("controlValue");

        if(value !== undefined ){
            document.getElementById("controlName").innerHTML = key + ': ';
            if(value == ' '){value = 'space'}
            displayValue.innerHTML = value;
        }
    }
    function changeValue(e) {
        let myKey = e.key
        let controlList = document.getElementById("controlList");
        let key = controlList.options[controlList.selectedIndex].value
        
        document.getElementById("controlKeys").value = '';

        document.getElementById("controlName").innerHTML = key + ': ';
        let displayValue = document.getElementById("controlValue");
        if(myKey !== 'Backspace'){ 
            controls[key] = myKey.toString(); 
            if(myKey == ' '){myKey = 'space'}
            displayValue.innerHTML = myKey.toString();
        }
        else {
            controls[key] = ''; 
            displayValue.innerHTML = '';
        } 
    }
    function changeArrow(arrow) {
        let controlList = document.getElementById("controlList");
        let key = controlList.options[controlList.selectedIndex].value
        document.getElementById("controlKeys").value = '';
        document.getElementById("controlName").innerHTML = key + ': ';
        controls[key] = arrow;
        document.getElementById("controlValue").innerHTML = arrow;
    }
    function save() {
        localStorage['MultiAsteroids.controls'] = JSON.stringify(controls);
    }
    
    return {
        initialize : initialize,
        run : run,
        changeValue: changeValue,
        save: save,
        changeArrow: changeArrow
    };
}(MyGame.game));

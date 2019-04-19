MyGame.screens['help'] = (function(game) {
    'use strict';
    let defaultControls;
    let controls;
    
    function initialize() {
        defaultControls = {Thrust: 'ArrowUp', Rotate_Left: 'ArrowLeft', Rotate_Right: 'ArrowRight', Shoot : ' ', Hyperspace: 'z'}
        controls = {Thrust: ['ArrowUp'], Rotate_Left: ['ArrowLeft'], Rotate_Right: ['ArrowRight'], Shoot : [' '], Hyperspace: ['z']}
        let current_controls = localStorage.getItem('MultiAsteroids.controls');
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
        let valueList = controls[key];
        document.getElementById("controlKeys").value = '';
        let displayValue = document.getElementById("controlValue");

        if(valueList !== undefined && valueList.length > 0 ){
            document.getElementById("controlName").innerHTML = key + ': ';
            displayValue.innerHTML = '';
            for(let i = 0; i < valueList.length -1; i++){
                if(valueList[i] == ' '){valueList[i] = 'space'}
                displayValue.innerHTML += valueList[i] + ' + ';
            }
            if(valueList[valueList.length -1] == ' '){valueList[valueList.length -1] = 'space'}
            displayValue.innerHTML += valueList[valueList.length -1];
        }
    }
    function changeValue(e) {
        let myKey = e.key

        let current_controls = localStorage.getItem('MultiAsteroids.controls');
        let controls = JSON.parse(current_controls)
        let controlList = document.getElementById("controlList");
        let key = controlList.options[controlList.selectedIndex].value
        
        document.getElementById("controlKeys").value = '';

        document.getElementById("controlName").innerHTML = key + ': ';
        let displayValue = document.getElementById("controlValue");
        if (myKey == 'Backspace' && controls[key].length > 0) { 
            controls[key].pop(); 
            if(controls[key][0] == undefined){displayValue.innerHTML = ''}
            else{
                displayValue.innerHTML = controls[key][0];
                for(let i = 1; i < controls[key].length; i++){
                    displayValue.innerHTML += ' + ' + controls[key][i];
                }
            }
        } 
        else if(myKey !== 'Backspace'){ 
            controls[key].push(myKey.toString()); 
            if(myKey == ' '){myKey = 'space'}
            if(controls[key].length > 1){displayValue.innerHTML += ' + ' + myKey.toString();}
            else {displayValue.innerHTML = myKey.toString();}
        }
        localStorage['MultiAsteroids.controls'] = JSON.stringify(controls);
    }
    
    return {
        initialize : initialize,
        run : run,
        changeValue: changeValue,
    };
}(MyGame.game));

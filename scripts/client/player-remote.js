//------------------------------------------------------------------
//
// Model for each remote player in the game.
//
//------------------------------------------------------------------
MyGame.components.PlayerRemote = function () {
    'use strict';
    let that = {};
    let size = {
        width: 35,
        height: 35
    };
    let state = {
        score: 0,
        name: '',
        playerNumber: null,
        direction: 0,
        position: {
            x: 0,
            y: 0
        },
        momentum: {
            x: 0,
            y: 0
        }
    };
    let goal = {
        direction: 0,
        position: {
            x: 0,
            y: 0
        },
        updateWindow: 0      // Server reported time elapsed since last update
    };

    Object.defineProperty(that, 'state', {
        get: () => state
    });

    Object.defineProperty(that, 'goal', {
        get: () => goal
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

 // Update of the remote player depends upon whether or not there is
    // a current goal or if the ship is just floating along.  If a current
    // goal, update is a simpler progression/interpolation from the previous 
    // state to the goal (new) state.  If it is floating along, then use
    // the momentum to update the position.
    that.update = function (elapsedTime) {
        let goalTime = Math.min(elapsedTime, goal.updateWindow);
        if (goalTime > 0) {
            let updateFraction = goalTime / goal.updateWindow;
            //
            // Turn first, then move.
            state.direction -= (state.direction - goal.direction) * updateFraction;

            state.position.x -= ((state.position.x - goal.position.x) * updateFraction);
            state.position.y -= ((state.position.y - goal.position.y) * updateFraction);

            goal.updateWindow -= goalTime;
        } else {
            // Ship is only floating along, only need to update its position
            state.position.x += (state.momentum.x * elapsedTime);
            state.position.y += (state.momentum.y * elapsedTime);
        }
        if (state.position.y - (size.height/2) < 0) {
            state.position.y = (size.height/2);
            state.momentum.y = 0;
        }
        if (state.position.y + (size.height/2) > 1152) {
            state.position.y = 1152 - (size.height/2);
            state.momentum.y = 0;
        }
        if (state.position.x - (size.width/2) < (0)) {
            state.position.x = (size.width/2);
            state.momentum.x = 0;
        }
        if (state.position.x + (size.width/2) > 1920) {
            state.position.x = 1920 - (size.width/2);
            state.momentum.x = 0;
        }
    };

    return that;
};

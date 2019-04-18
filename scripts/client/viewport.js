MyGame.components.Viewport = (function() {
    let view = { x: 0, y: 0 }
    
    function changeView(vector) {
        return { x: vector.x - view.x, y: vector.y - view.y }
    }

    function changeViewX(x) {
        return x - view.x; 
    }

    function changeViewY(y) {
        return y - view.y; 
    }

    function moveX(value) {
        view.x += value; 
    }

    function moveY(value) {
        view.y += value; 
    }

    let api = {
        changeView: changeView,
        changeViewX: changeViewX,
        changeViewY: changeViewY,
        moveX: moveX,
        moveY: moveY,
        get view() { return view; },
    }

    return api; 
})(); 
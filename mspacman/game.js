function init() {
    var canvas = document.getElementById('game_canvas');
    var context = canvas.getContext('2d');
    var image = new Image();
    image.src = "pacman10-hp-sprite.png";

    image.addEventListener("load", function() {
        context.drawImage(image, 322, 0, 465, 140, 0, 0, 465, 140); //draw board
    }, false);
}
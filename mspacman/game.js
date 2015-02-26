/*
 * Naomi Zarrilli
 * Lab 5
 * 2/26/15
 */

function init() {
    var canvas = document.getElementById('game_canvas');
    var context = canvas.getContext('2d');
    var image = new Image();
    image.src = "pacman10-hp-sprite.png";

    image.addEventListener("load", function() {
        context.drawImage(image, 322, 0, 465, 140, 0, 0, 465, 140); //draw board
        context.drawImage(image, 83, 22, 16, 16, 6, 8, 16, 16); //draw ms pacman
    }, false);
}
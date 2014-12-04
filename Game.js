var Play = document.getElementById('play');
var Info = document.getElementById('info');
var Scoreboard = document.getElementById('scoreboard');
var Ammo = document.getElementById('ammo');
var Enemies = document.getElementById('enemies');
var Score = document.getElementById('score');

var player = new Player({size: 30, x: CANVAS_WIDTH * .5, y: CANVAS_HEIGHT * .5, speed: 10});
var enemies = [];

var game = function () {
    Play.style.display = 'none';

    Ammo.innerText = 20;
    player.setWeapon(new Weapon({size: 10, ammo: 20}));
    player.spawn();
    player.addEventListener('destroy', function () {
        Info.innerText = 'You died!'
        Play.style.display = 'block';
    });

    var enemiesCount = 10 - enemies.length;
    Enemies.innerText = 10;
    console.log(enemies.length);
    for (var i = 0; i < enemiesCount; i++) {
        enemies.push(new Enemy({
            size: 20,
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            angle: Math.random() * 360,
            speed: 10
        }));
    }
}

document.getElementById('playButton').addEventListener('click', game);

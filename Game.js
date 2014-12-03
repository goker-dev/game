var Scoreboard = document.getElementById('scoreboard');
var Ammo = document.getElementById('ammo');
var Enemies = document.getElementById('enemies');
var Score = document.getElementById('score');

Ammo.innerText = 20;
var player = new Player(30, 300, 300, 15, 10);
player.setWeapon(new Weapon({size: 10, ammo: 20}));

Enemies.innerText = 10;
var enemies = [];
for (var i = 0; i < 10; i++) {
    enemies.push(new Enemy(20, Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, 15, 10));
}

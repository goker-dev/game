var player = new Player(30, 300, 300, 15, 10);
player.setWeapon(new Weapon(10, 0, 300));

var enemies = [];
for (var i = 0; i < 10; i++) {

    enemies.push(new Enemy(20, Math.random(), 50, 15, 10));
}

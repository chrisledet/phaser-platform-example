var mainState = {
  preload: function() {
    game.stage.backgroundColor = "#3598db";

    game.load.image('player', 'assets/player.png');
    game.load.image('wall', 'assets/wall.png');
    game.load.image('coin', 'assets/coin.png');
    game.load.image('enemy', 'assets/enemy.png');
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCANE);
    game.world.enableBody = true;

    this.player = game.add.sprite(60, 60, 'player');
    this.player.body.gravity.y = 250;
    game.physics.enable(this.player);

    this.cursor = game.input.keyboard.createCursorKeys();

    this.walls = game.add.group();
    this.coins = game.add.group();
    this.enemies = game.add.group();

    // x = wall, o = coin, ! = lava.
    var level = [
      "xxxxxxxxxxxxxxxxxxxxxx",
      "!          !         x",
      "!     o            o x",
      "!          o         x",
      "!     x              x",
      "x       o  !  x      x",
      "xxxxxxxxxxxxxxx!!xx!!x",
    ];

    for (var x = 0; x < level.length; x++) {
      for (var y = 0; y < level[x].length; y++) {
        if (level[x][y] == 'x') {
          var wall = game.add.sprite(30+20*y, 30+20*x, 'wall');
          wall.body.immovable = true;

          this.walls.add(wall);
        }
        else if (level[x][y] == '!') {
          var enemy = game.add.sprite(30+20*y, 30+20*x, 'enemy');
          this.enemies.add(enemy);
        }
        else if (level[x][y] == 'o') {
          var coin = game.add.sprite(30+20*y, 30+20*x, 'coin');
          this.coins.add(coin);
        }
      }
    }
  },

  update: function() {
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x = -200;
    }
    else if (this.cursor.right.isDown) {
      this.player.body.velocity.x = 200;
    }
    else {
      this.player.body.velocity.x = 0;
    }

    if (this.cursor.up.isDown) {
      this.player.body.velocity.y = -250;
    }

    game.physics.arcade.collide(this.player, this.walls);
    game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);
  },

  takeCoin: function(player, coin) {
    coin.kill();
  },

  restart: function() {
    game.state.start('main');
  },
};

var game = new Phaser.Game(500, 200);
game.state.add('main', mainState);
game.state.start('main');

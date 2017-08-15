'use strict';

var COLS = 10,
    ROWS = 10,
    SIZE = 32,
    BOMBS = 5;

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'gamePlace', {
  preload: function() {
    game.load.image('block_off', 'assets/block.png');
    game.load.image('block_on', 'assets/block2.png');
    game.load.image('bomb', 'assets/bomb.png');
  },
  create: function() {
    this.blocks = make2DArray(COLS, ROWS);

    this.activeBlocks = [];

    var positions = [],
        bombs = [];

    var index = 0;

    for (var i = 0; i < COLS ; i++) {
      for (var j = 0; j < ROWS ; j++) {
        positions[index++] = { i: i, j: j };
      }
    }

    for (var i = 0; i < BOMBS; i++) {
      var r = random(positions.length);
      var bomb = positions[r];
      positions.splice(r, 1);
      bombs.push(bomb);
    }

    for (var i = 0; i < COLS ; i++) {
      for (var j = 0; j < ROWS ; j++) {
        this.blocks[i][j] = new Block(game, i, j);
      }
    }

    for (var i in bombs) {
      var bomb = bombs[i];
      this.blocks[bomb.i][bomb.j].isBomb = true;
    }

    for (var i = 0; i < COLS ; i++) {
      for (var j = 0; j < ROWS ; j++) {
        this.blocks[i][j].countBombs(this.blocks);
      }
    }

    console.log(1);
  },
  update: function() {

    for (var i = 0; i < COLS ; i++) {
      for (var j = 0; j < ROWS ; j++) {
        this.blocks[i][j].update()
      }
    }

    if(!this.activeBlock) {
      for (var i = 0; i < COLS ; i++) {
        for (var j = 0; j < ROWS ; j++) {
          if(this.blocks[i][j].isActive && !this.blocks[i][j].isVisible) {
            this.activeBlock = this.blocks[i][j];
            this.activeBlocks.push(this.activeBlock);
            this.findOtherBlocks();
          }
        }
      }
      this.activeBlock = null;
      this.activeBlocks.forEach( b => b.isVisible = true)
    }
  },

  findOtherBlocks: function() {

    this.activeBlock.isActive = true;

    for (var i = 0; i < this.activeBlock.neighbours.length; i++) {
      if(this.activeBlock.neighbours[i].friends > 0 ||
        this.activeBlocks.indexOf(this.activeBlock.neighbours[i]) > -1 ||
        this.activeBlock.neighbours[i].isBomb) {
        continue;
      }

      this.activeBlocks.push(this.activeBlock.neighbours[i]);
      this.activeBlock = this.activeBlock.neighbours[i];
      this.findOtherBlocks();
    }
  }
});

function random(max) {
  return parseInt(Math.random() * max);
}

function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

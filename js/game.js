'use strict';

var COLS = 20,
    ROWS = 15,
    SIZE = 32,
    BOMBS = 30;

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'gamePlace', {

  preload: function() {
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
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
            this.findOtherBlocks(this.activeBlock);
          }
        }
      }
      this.activeBlock = null;
      this.activeBlocks.forEach( b => b.isVisible = true)
    }
  },

  findOtherBlocks: function(block) {
    block.isActive = true;
    let blockChanged = false;
    for (var i = 0; i < block.neighbours.length; i++) {
      if(block.neighbours[i].friends > 0 ||
        this.activeBlocks.indexOf(block.neighbours[i]) > -1 ||
        block.neighbours[i].isBomb) {
        continue;
      }

      this.activeBlocks.push(block.neighbours[i]);
      blockChanged = true;
      this.findOtherBlocks(block.neighbours[i]);
    }

    if (blockChanged) {
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

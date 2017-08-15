
function Block(game, i, j) {

  this.friends = -1;

  this.i = i;
  this.j = j;

  this.neighbours = [];

  this.sprite = game.add.image(i * 32, j * 32, 'block_on');

  this.sprite.inputEnabled = true;

  var style = { font: "14px Arial", fill: "#FFFFFF", align: "center" };

  this.number = game.add.text((i * 32) + 12, (j * 32) + 8, '0', style)

  this.sprite.events.onInputDown.add(function() {
    if(this.isBomb) {
      console.log("Booom!");
    }
    this.revel();
  }, this);
}

Block.prototype.update = function () {

  if(this.isVisible) {
    if(this.isBomb) {
      this.sprite.loadTexture('bomb');
    } else {
      this.sprite.loadTexture('block_on');
    }
  } else {
    this.sprite.loadTexture('block_off');
  }

  this.number.text = this.friends;

  //this.number.visible = false;

  if (this.friends == 0 || this.friends == -1) { this.number.visible = false; }
};

Block.prototype.revel = function () {
  this.isActive = true;
};

Block.prototype.countBombs = function (blocks) {

  var total = 0;

  if(this.isBomb) {
    this.friends = -1;
    return;
  }

  for (var xoff = -1; xoff <= 1; xoff++) {
    var i = this.i + xoff;

    if (i < 0 || i >= COLS) continue;

    for (var yoff = -1; yoff <= 1; yoff++) {
      var j = this.j + yoff;

      if (j < 0 || j >= ROWS) continue;

      var next = blocks[i][j];

      this.neighbours.push(next);

      if (next && next.isBomb) {
        total++;
      }
    }
  }

  this.friends = total;
};

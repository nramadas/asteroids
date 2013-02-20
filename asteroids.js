var Asteroids = (function() {
  function Game(context){
    var that = this;

    this.context = context;
    this.ship = (function() {
      return new Ship((Game.xSize/2),(Game.ySize/2));
    })();

    this.asteroids = (function() {
      var as = [];
      for (var i = 0; i < 10; i++) {
        as.push(Asteroid.randomAsteroid());
      }
      return as;
    })();

    this.start = function() {
      var t = setInterval(function() {
        if(key.isPressed(38)) {
          that.ship.changeSpeed(0.05);
        }
        if(key.isPressed(40)) {
          that.ship.changeSpeed(-0.05);
        }
        if(key.isPressed(37)) {
          that.ship.changeDirection(0);
        }
        if(key.isPressed(39)) {
          that.ship.changeDirection(1);
        }
        for (var i = 0; i < that.asteroids.length; i++) {
          that.asteroids[i].update();
        }

        that.ship.update();
        that.draw();
      }, 10);

    };

    this.draw = function() {
      that.context.clearRect(0,0,Game.xSize,Game.ySize);
      for (var i = 0; i < that.asteroids.length; i++) {
        that.asteroids[i].draw(that.context);
      }
      that.ship.draw(that.context);
    };
  }

  Game.xSize = 600;
  Game.ySize = 600;

  function Ship(xPos, yPos){
    var that = this;

    this.degrees = -90;

    this.calculateCorner = function(type, degrees, tip) {
      if (type=="x") {
        return (Math.cos(((that.degrees + degrees) / 180) * Math.PI) * 30) + tip;
      } else {
        return (Math.sin(((that.degrees + degrees) / 180) * Math.PI) * 30) + tip;
      }
    }

    this.corners = {
      tip: {
        x: xPos,
        y: yPos
      },
      right: {
        x: that.calculateCorner('x', 160, xPos),
        y: that.calculateCorner('y', 160, yPos)
      },
      left: {
        x: that.calculateCorner('x', 200, xPos),
        y: that.calculateCorner('y', 200, yPos)
      }
    };

    this.xDelta = 0;
    this.yDelta = 0;

    this.xAccel = 0;
    this.yAccel = -1;

    this.draw = function(context) {
      context.fillStyle = "rgb(42, 128, 196)";
      context.beginPath();
      context.moveTo(that.corners.tip.x, that.corners.tip.y);
      context.lineTo(that.corners.right.x, that.corners.right.y);
      context.lineTo(that.corners.left.x, that.corners.left.y);
      context.lineTo(that.corners.tip.x, that.corners.tip.y);
      context.fill();

      context.fillStyle = "rgba(255, 0, 255," +
                          ((Math.abs(that.xDelta) +
                            Math.abs(that.yDelta)) / 4)
                          + ")";
      context.beginPath();
      context.arc(that.corners.tip.x, that.corners.tip.y, 30,
                ((that.degrees + 160)/180) * Math.PI,
                ((that.degrees + 200)/180) * Math.PI, false);
      context.fill();

    };

    this.update = function(){
      that.corners.tip.x = (that.corners.tip.x + that.xDelta + Game.xSize) %
                                                               Game.xSize;
      that.corners.tip.y = (that.corners.tip.y + that.yDelta + Game.ySize) %
                                                               Game.ySize;

      that.corners.right.x = that.calculateCorner('x', 160, that.corners.tip.x);
      that.corners.right.y = that.calculateCorner('y', 160, that.corners.tip.y);

      that.corners.left.x = that.calculateCorner('x', 200, that.corners.tip.x);
      that.corners.left.y = that.calculateCorner('y', 200, that.corners.tip.y);
    };

    this.changeSpeed = function(speed) {
      if(((that.xAccel > 0) && (that.xDelta < 4)) ||
         ((that.xAccel < 0) && (that.xDelta > -4))) {
        that.xDelta += (that.xAccel * speed);
      }
      if(((that.yAccel > 0) && (that.yDelta < 4)) ||
         ((that.yAccel < 0) && (that.yDelta > -4))) {
        that.yDelta += (that.yAccel * speed);
      }
    };

    this.changeDirection = function(direc) {
      if(direc) {
        that.degrees = (that.degrees + 3 + 360) % 360;
      } else {
        that.degrees = (that.degrees - 3 + 360) % 360;
      }

      that.xAccel = Math.cos((that.degrees / 180) * Math.PI);
      that.yAccel = Math.sin((that.degrees / 180) * Math.PI);

    };
  }

  function Asteroid(xPos, yPos, xDelta, yDelta){
    var that = this;

    this.xPos = xPos;
    this.yPos = yPos;
    this.xDelta = xDelta;
    this.yDelta = yDelta;
    this.radius = 30;

    this.fillStyle = (function() {
      return "rgba(" + (Math.floor(Math.random() * 150) + 50) + "," +
                       (Math.floor(Math.random() * 150) + 50) + "," +
                       (Math.floor(Math.random() * 150) + 50) + ",0.8)";
    })();

    this.draw = function(context) {
      context.fillStyle = that.fillStyle;
      context.beginPath();
      context.arc(that.xPos, that.yPos, that.radius, 0, 2*Math.PI, true);
      context.fill();
    };

    this.update = function(){
      that.xPos = (that.xPos + that.xDelta + Game.xSize) % Game.xSize;
      that.yPos = (that.yPos + that.yDelta + Game.ySize) % Game.ySize;
    };
  }

  Asteroid.randomAsteroid = function () {
    var xPos = 0;
    var yPos = 0;

    if (Math.floor(Math.random() + 0.5)) {
      xPos = Math.floor(Math.random() * Game.xSize);
      yPos = Game.ySize;
    } else {
      xPos = Game.xSize;
      yPos = Math.floor(Math.random() * Game.ySize);
    }

    var xDelta = (Math.random() * 2) - 1;
    var yDelta = (Math.random() * 2) - 1;

    return (new Asteroid(xPos, yPos, xDelta, yDelta));
  };

  return {
          Game: Game,
          Asteroid: Asteroid
         };
})();

var loader = function() {
  var canvas = document.getElementById('canvas');

  Asteroids.Game.xSize = document.body.clientWidth;
  Asteroids.Game.ySize = document.body.clientHeight;

  canvas.setAttribute('width', Asteroids.Game.xSize);
  canvas.setAttribute('height', Asteroids.Game.ySize);

  window.onresize = function () {
    Asteroids.Game.xSize = document.body.clientWidth;
    Asteroids.Game.ySize = document.body.clientHeight;

    canvas.setAttribute('width', Asteroids.Game.xSize);
    canvas.setAttribute('height', Asteroids.Game.ySize);
  };

  var context = canvas.getContext('2d');
  var game = new Asteroids.Game(context);

  game.start();
};
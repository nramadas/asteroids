var Asteroids = (function() {
  function Game(context){
    var that = this;

    this.context = context;
    this.ship = (function() {
      return new Ship(400,400);
    })();

    this.asteroids = (function() {
      var as = [];
      for (var i = 0; i < 10; i++) {
        as.push(Asteroid.randomAsteroid())
      };
      return as;
    })();

    this.start = function() {
      var t = setInterval(function() {
        if(key.isPressed(38)) {
          that.ship.changeDirection(0, -.25);
        }
        if(key.isPressed(40)) {
          that.ship.changeDirection(0, .25);
        }
        if(key.isPressed(37)) {
          that.ship.changeDirection(-.25, 0);
        }
        if(key.isPressed(39)) {
          that.ship.changeDirection(.25, 0);
        }
        for (var i = 0; i < that.asteroids.length; i++) {
          that.asteroids[i].update();
        };

        that.ship.update();
        that.draw();
      }, 10);

    };

    this.draw = function() {
      that.context.clearRect(0,0,800,800);
      for (var i = 0; i < that.asteroids.length; i++) {
        that.asteroids[i].draw(that.context);
      };
      that.ship.draw(that.context);
    };
  }

  function Ship(xPos, yPos){
    var that = this;

    this.xPos = xPos;
    this.yPos = yPos;
    this.xDelta = 0;
    this.yDelta = 0;

    this.draw = function(context) {
      context.fillStyle = "rgb(42, 128, 196)";
      context.beginPath();
      context.arc(that.xPos, that.yPos, 10, 0, 2*Math.PI, true);
      context.fill();
    };

    this.update = function(){
      that.xPos = (that.xPos + that.xDelta + 800) % 800;
      that.yPos = (that.yPos + that.yDelta + 800) % 800;
    };

    this.changeDirection = function(x, y) {
      if (((that.xDelta > -5) && (x < 0)) || ((that.xDelta < 5) && (x > 0))) {
        that.xDelta += x;
      }
      if (((that.yDelta > -5) && (y < 0)) || ((that.yDelta < 5) && (y > 0))) {
        that.yDelta += y;
      }
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
      return "rgb(" + (Math.floor(Math.random() * 100) + 100) + "," +
                      (Math.floor(Math.random() * 100) + 100) + ",0)";
    })();

    this.draw = function(context) {
      context.fillStyle = that.fillStyle;
      context.beginPath();
      context.arc(that.xPos, that.yPos, that.radius, 0, 2*Math.PI, true);
      context.fill();
    };

    this.update = function(){
      that.xPos = (that.xPos + that.xDelta + 800) % 800;
      that.yPos = (that.yPos + that.yDelta + 800) % 800;
    };
  }

  Asteroid.randomAsteroid = function () {
    var xPos = 0;
    var yPos = 0;

    if (Math.floor(Math.random() + 0.5)) {
      xPos = Math.floor(Math.random() * 800);
      yPos = 800;
    } else {
      xPos = 800;
      yPos = Math.floor(Math.random() * 800);
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
  var context = canvas.getContext('2d');
  var game = new Asteroids.Game(context);

  game.start();
};
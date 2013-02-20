var Asteroids = (function() {
  function Game(context){
    var that = this;

    this.context = context;
    this.bulletSpacer = 0;
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

    this.bullets = [];

    this.start = function() {
      var t = setInterval(function() {
        if(key.isPressed(38)) {
          that.ship.changeSpeed(0.01);
        }
        if(key.isPressed(37)) {
          that.ship.changeDirection(0);
        }
        if(key.isPressed(39)) {
          that.ship.changeDirection(1);
        }
        // Spacebar / Fire
        if(key.isPressed(32)) {
          if(that.bulletSpacer <= 0) {
            if (that.bullets.length >= 10) {
              that.bullets.shift();
            }
            that.bullets.push(new Bullet(that.ship.corners.tip.x,
                                         that.ship.corners.tip.y,
                                         (that.ship.xAccel * 3),
                                         (that.ship.yAccel * 3)));
            that.bulletSpacer = 32;
          } else {
            that.bulletSpacer--;
          }
        }

        for (var i = 0; i < that.asteroids.length; i++) {
          that.asteroids[i].update();
        }

        for (var i = 0; i < that.bullets.length; i++) {
          that.bullets[i].update();
        };

        that.ship.update();
        that.draw();
        if(that.hasCollided()) {
          // LOSE CONDITION
          clearInterval(t);
          document.getElementById("loseSplash").style.display = "block";
        }

        if(that.asteroids.length == 0) {
          // WIN CONDITION
          clearInterval(t);
          document.getElementById("winSplash").style.display = "block";
        }

        for (var i = 0; i < that.bullets.length; i++) {
          for (var j = 0; j < that.asteroids.length; j++) {
            var distance = Game.calculateDistance(that.bullets[i].position,
                                                  that.asteroids[j].position);

            if (distance <= that.asteroids[j].radius) {
              that.bullets.splice(i, 1);
              var papaAsteroid = that.asteroids.splice(j, 1)[0];

              if((papaAsteroid.radius /2) > 5) {
                that.asteroids.push(new Asteroid(papaAsteroid.position.x,
                                                 papaAsteroid.position.y,
                                                 -papaAsteroid.xDelta,
                                                 -papaAsteroid.yDelta,
                                                 papaAsteroid.radius/2))
                that.asteroids.push(new Asteroid(papaAsteroid.position.x,
                                                 papaAsteroid.position.y,
                                                 papaAsteroid.yDelta,
                                                 papaAsteroid.xDelta,
                                                 papaAsteroid.radius/2))
              }
              break;
            }
          };
        };
      }, 3);

    };

    this.draw = function() {
      that.context.clearRect(0,0,Game.xSize,Game.ySize);
      for (var i = 0; i < that.asteroids.length; i++) {
        that.asteroids[i].draw(that.context);
      }
      for (var i = 0; i < that.bullets.length; i++) {
        that.bullets[i].draw(that.context);
      };
      that.ship.draw(that.context);
    };

    this.detectCollision = function(shipCorner) {
      for (var i = 0; i < that.asteroids.length; i++) {
        var distance = Game.calculateDistance(shipCorner,
                       that.asteroids[i].position);

        if (distance <= that.asteroids[i].radius) {
          return true;
        }
      };

      return false;
    };

    this.hasCollided = function() {
      return (that.detectCollision(that.ship.corners.tip) ||
              that.detectCollision(that.ship.corners.right) ||
              that.detectCollision(that.ship.corners.left));
    };

  }

  Game.xSize = 600;
  Game.ySize = 600;
  Game.calculateDistance = function(start, end) {
    var xDiff = Math.pow((start.x - end.x), 2);
    var yDiff = Math.pow((start.y - end.y), 2);

    return Math.sqrt(xDiff + yDiff);
  };

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
                            Math.abs(that.yDelta)) / 2)
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
      if(((that.xAccel > 0) && (that.xDelta < 2)) ||
         ((that.xAccel < 0) && (that.xDelta > -2))) {
        that.xDelta += (that.xAccel * speed);
      }
      if(((that.yAccel > 0) && (that.yDelta < 2)) ||
         ((that.yAccel < 0) && (that.yDelta > -2))) {
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


  function Bullet(xPos, yPos, xDelta, yDelta){
    var that = this;

    this.position = {
      x: xPos,
      y: yPos
    };

    this.xDelta = xDelta;
    this.yDelta = yDelta;
    this.radius = 3;

    this.fillStyle = "rgb(0,0,0)";

    this.draw = function(context) {
      context.fillStyle = that.fillStyle;
      context.beginPath();
      context.arc(that.position.x, that.position.y,
                  that.radius, 0, 2*Math.PI, true);
      context.fill();
    };

    this.update = function(){
      that.position.x = (that.position.x + that.xDelta + Game.xSize) %
                                                         Game.xSize;
      that.position.y = (that.position.y + that.yDelta + Game.ySize) %
                                                         Game.ySize;
    };
  }


  function Asteroid(xPos, yPos, xDelta, yDelta, radius){
    var that = this;

    this.position = {
      x: xPos,
      y: yPos
    };

    this.xDelta = xDelta;
    this.yDelta = yDelta;
    this.radius = (radius) ? radius : 30;

    this.fillStyle = (function() {
      return "rgba(" + (Math.floor(Math.random() * 150) + 50) + "," +
                       (Math.floor(Math.random() * 150) + 50) + "," +
                       (Math.floor(Math.random() * 150) + 50) + ",0.8)";
    })();

    this.draw = function(context) {
      context.fillStyle = that.fillStyle;
      context.beginPath();
      context.arc(that.position.x, that.position.y,
                  that.radius, 0, 2*Math.PI, true);
      context.fill();
    };

    this.update = function(){
      that.position.x = (that.position.x + that.xDelta + Game.xSize) %
                                                         Game.xSize;
      that.position.y = (that.position.y + that.yDelta + Game.ySize) %
                                                         Game.ySize;
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

    var xDelta = (Math.random() * 1) - 0.5;
    var yDelta = (Math.random() * 1) - 0.5;

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

  var s = setTimeout(function() {
    document.getElementById("startSplash").style.display = "none";
    console.log("yo");
    game.start();
  },3000);
};





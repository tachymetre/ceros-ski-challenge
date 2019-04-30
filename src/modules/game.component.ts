import {
  IGameAssets,
  IRect
} from "./game.model";

export class GameComponent {
  private readonly twoSqrt = 1.4142;
  private readonly keyboardDirectionTable = {
    37: (event, direction) => {
      if (direction === 0) {
        this.skierDirection = 2;
      } else if (direction === 1) {
        this.skierPosition.skierMapX -= this.skierSpeed;
        this.placeNewObstacle(this.skierDirection);
        clearTimeout(this.timePlay);
      } else {
        this.skierDirection--;
        if (this.skierDirection === 1) {
          clearTimeout(this.timePlay);
        }
      }
      event.preventDefault();
    },
    38: (event, direction) => {
      if (direction === 1 || direction === 5) {
        this.skierPosition.skierMapY -= this.skierSpeed;
        this.placeNewObstacle(6);
      }
      event.preventDefault();
    },
    39: (event, direction) => {
      if (direction === 5) {
        this.skierPosition.skierMapX += this.skierSpeed;
        this.placeNewObstacle(this.skierDirection);
        clearTimeout(this.timePlay);
      } else {
        this.skierDirection++;
        if (this.skierDirection === 5) {
          clearTimeout(this.timePlay);
        }
      }
      event.preventDefault();
    },
    40: (event, direction) => {
      this.skierDirection = 3;
      event.preventDefault();
    },
    75: () => {
      // "K" keycode
      this.pauseOrResumeGame(75);
    }
  };
  private readonly assetNameTable = {
    0: () => { return 'skierCrash'; },
    1: () => { return 'skierLeft'; },
    2: () => { return 'skierLeftDown'; },
    3: () => { return 'skierDown'; },
    4: () => { return 'skierRightDown'; },
    5: () => { return 'skierRight'; },
    6: () => { return 'skierJump1'; },
    7: () => { return 'skierJump2'; },
    8: () => { return 'skierJump3'; },
    9: () => { return 'skierJump4'; },
    10: () => { return 'skierJump5'; },
  };
  private readonly placeNewItemTable = {
    1: (leftEdge, rightEdge, topEdge, bottomEdge) => {
      this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
    },
    2: (leftEdge, rightEdge, topEdge, bottomEdge) => {
      this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
      this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
    },
    3: (leftEdge, rightEdge, topEdge, bottomEdge) => {
      this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
    },
    4: (leftEdge, rightEdge, topEdge, bottomEdge) => {
      this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
      this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
    },
    5: (leftEdge, rightEdge, topEdge, bottomEdge) => {
      this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
    },
    6: (leftEdge, rightEdge, topEdge, bottomEdge) => {
      this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
    }
  }
  private readonly moveSkierTable = {
    2: () => {
      this.updateScore();
      this.skierPosition.skierMapX -= Math.round(this.skierSpeed / this.twoSqrt);
      this.skierPosition.skierMapY += Math.round(this.skierSpeed / this.twoSqrt);
    },
    3: () => {
      this.updateScore();
      this.skierPosition.skierMapY += this.skierSpeed;
    },
    4: () => {
      this.updateScore();
      this.skierPosition.skierMapX += this.skierSpeed / this.twoSqrt;
      this.skierPosition.skierMapY += this.skierSpeed / this.twoSqrt;
    },
    6: () => {
      this.skierPosition.skierMapY += this.skierSpeed + 1;
      this.skierDirection++;
    },
    7: () => {
      this.skierPosition.skierMapY += this.skierSpeed + 2;
      this.skierDirection++;
    },
    8: () => {
      this.skierPosition.skierMapY += this.skierSpeed + 3;
      this.skierDirection++;
    },
    9: () => {
      this.skierPosition.skierMapY += this.skierSpeed + 4;
      this.skierDirection++;
    },
    10: () => {
      this.skierPosition.skierMapY += this.skierSpeed + 5;
        this.skierDirection = 3;
    }
  };
  private gameAssets: IGameAssets = {
    'skierCrash': 'img/skier_crash.png',
    'skierLeft': 'img/skier_left.png',
    'skierLeftDown': 'img/skier_left_down.png',
    'skierDown': 'img/skier_down.png',
    'skierRightDown': 'img/skier_right_down.png',
    'skierRight': 'img/skier_right.png',
    'tree': 'img/tree_1.png',
    'treeCluster': 'img/tree_cluster.png',
    'rock1': 'img/rock_1.png',
    'rock2': 'img/rock_2.png',
    'jumpRamp': 'img/jump_ramp.png',
    'skierJump1': 'img/skier_jump_1.png',
    'skierJump2': 'img/skier_jump_2.png',
    'skierJump3': 'img/skier_jump_3.png',
    'skierJump4': 'img/skier_jump_4.png',
    'skierJump5': 'img/skier_jump_5.png',
  };
  private skierPosition = {
    'skierMapX': 0,
    'skierMapY': 0
  };
  public gameWidth = window.innerWidth;
  public gameHeight = window.innerHeight;
  public readonly obstacleTypes = [
    'tree',
    'treeCluster',
    'rock1',
    'rock2',
    'jumpRamp'
  ];
  public obstacles = [];
  public loadedAssets = {};
  public shouldCloseModal = true;
  public canvas: any;
  public ctx: any;
  public timeSurvive: any;
  public currentScore = 0;
  public crashCount = 0;
  public requestId;
  public timePlay;

  constructor(
    public skierDirection: number,
    public skierSpeed: number
  ) {
    let self = this;
    self.canvas = $('<canvas></canvas>')
      .attr('width', window.innerWidth * window.devicePixelRatio)
      .attr('height', window.innerHeight * window.devicePixelRatio)
      .css({
        width: window.innerWidth + 'px',
        height: window.innerHeight + 'px'
      });
    $('body').append(self.canvas);
    self.ctx = self.canvas[0].getContext('2d');
    self.initGame();
  }
  initGame() {
    let self = this;
    self.setupKeyHandler();
    self.loadAssets().then(() => {
      self.placeInitialObstacles();
      requestAnimationFrame(self.gameLoop.bind(self));
    });
  }

  generateRandomNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getScore() {
    document.getElementById("scoreDisplay").innerHTML =
      localStorage.getItem("high-score") || "No Score Yet!";
  }

  resetTheGame() {
    let self = this;
    self.currentScore = 0;
    self.skierDirection = 5;
    self.skierPosition = {
      'skierMapX': 0,
      'skierMapY': 0
    }
  }

  private updateScore() {
    let self = this;
    self.timePlay = setTimeout(() => {
      self.currentScore++;
      self.updateScore();
    }, 1000);
  }

  private pauseOrResumeGame(keyCode: number) {
    if (keyCode === 75) {
      let self = this,
        modal = document.getElementById('myModal');
      if (self.shouldCloseModal) {
        self.skierDirection = 5;
        self.shouldCloseModal = !self.shouldCloseModal;
        modal.style.display = "block";
      } else {
        self.shouldCloseModal = !self.shouldCloseModal;
        modal.style.display = "none";
      }
    }
  }

  private setupKeyHandler() {
    let self = this;
    window.addEventListener('keydown', (event) => {
      self.handleEvent(event);
    });
    document.getElementById("scoreBtn").addEventListener('click', (event) => {
      self.getScore();
    });
    document.getElementById("resetBtn").addEventListener('click', (event) => {
      self.resetTheGame();
    });
  }

  private handleEvent(event: KeyboardEvent) {
    let self = this;
    if (event && event.key && event.which &&
      event.which !== 75 && self.shouldCloseModal) {
      event.preventDefault();
      self.checkDirection(event, event.which);
    } else {
      self.pauseOrResumeGame(event.which);
    }
  }

  private checkDirection(event: any, keyCode: number) {
    let self = this;
    if (keyCode && self.skierDirection >= 0) {
      self.handleDirection(event, keyCode, self.skierDirection);
    }
  }

  private handleDirection(event: any, keyCode: number, direction: number) {
    let self = this,
      keyboardDirection = self.keyboardDirectionTable[keyCode];
    if (keyboardDirection) {
      keyboardDirection(event, direction);
    }
  }

  private placeInitialObstacles() {
    let self = this,
        numberObstacles = Math.ceil(self.generateRandomNumberBetween(5, 7) *
        (self.gameWidth / 800) * (self.gameHeight / 500));

    let minX = -50,
        maxX = self.gameWidth + 50,
        minY = self.gameHeight / 2 + 100,
        maxY = self.gameHeight + 50;

    for (let i = 0; i < numberObstacles; i++) {
      self.placeRandomObstacle(minX, maxX, minY, maxY);
    }

    self.obstacles = self.obstacles.sort((obstacle) => {
      let obstacleImage = self.loadedAssets[obstacle.type];
      return obstacle.y + obstacleImage.height;
    });
  }

  private placeNewObstacle(direction: number) {
    let self = this,
        shouldPlaceObstacle = self.generateRandomNumberBetween(1, 8);

    if (shouldPlaceObstacle !== 8) {
      return;
    }

    let leftEdge = self.skierPosition.skierMapX;
    let rightEdge = self.skierPosition.skierMapX + self.gameWidth;
    let topEdge = self.skierPosition.skierMapY;
    let bottomEdge = self.skierPosition.skierMapY + self.gameHeight;

    let whatToPlace = self.placeNewItemTable[direction];
    if (whatToPlace) {
      whatToPlace(leftEdge, rightEdge, topEdge, bottomEdge);
    }
  }

  private placeRandomObstacle(minX: number, maxX: number, minY: number, maxY: number) {
    let self = this,
        obstacleIndex = self.generateRandomNumberBetween(0, self.obstacleTypes.length - 1),
        position = self.calculateOpenPosition(minX, maxX, minY, maxY);
    self.obstacles.push({
      type: self.obstacleTypes[obstacleIndex],
      x: position.x,
      y: position.y
    });
  }

  private calculateOpenPosition(minX: number, maxX: number, minY: number, maxY: number) {
    let self = this,
      x = Math.floor(Math.random() * (maxX - minX + 1) + minX),
      y = Math.floor(Math.random() * (maxY - minY + 1) + minY);

    let foundCollision = self.obstacles.find((obstacle) => {
      return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
    });
    return (foundCollision) ? self.calculateOpenPosition(minX, maxX, minY, maxY) : { x: x, y: y };
  }

  private loadAssets() {
    let self = this,
       assetPromises = [];
    for (let asset in self.gameAssets) {
      let assetImage = new Image(),
        assetDeferred = $.Deferred();

      assetImage.onload = () => {
        assetImage.width /= 2;
        assetImage.height /= 2;

        self.loadedAssets[asset] = assetImage;
        assetDeferred.resolve();
      };
      assetImage.src = self.gameAssets[asset];
      assetPromises.push(assetDeferred.promise());
    }
    return $.when.apply($, assetPromises);
  }

  private gameLoop() {
    let self = this;
    self.ctx.save();
    // Retina support
    self.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    self.clearCanvas();
    self.moveSkier();
    self.checkIfSkierHitSomething();
    self.drawSkier();
    self.drawObstacles();
    self.ctx.restore();
    requestAnimationFrame(self.gameLoop.bind(self));
  }

  private clearCanvas() {
    let self = this;
    self.ctx.clearRect(0, 0, self.gameWidth, self.gameHeight);
  }

  private moveSkier() {
    let self = this,
        moveSkierAction = self.moveSkierTable[self.skierDirection];
    if (moveSkierAction) {
      moveSkierAction();
      self.placeNewObstacle(self.skierDirection);
    }
  }

  private checkIfSkierHitSomething() {
    let self = this,
        skierAssetName: any = self.getSkierAsset(),
        skierImage: any = self.loadedAssets[skierAssetName];

    let skierRect: IRect = {
      left: self.skierPosition.skierMapX + self.gameWidth / 2,
      right: self.skierPosition.skierMapX + skierImage.width + self.gameWidth / 2,
      top: self.skierPosition.skierMapY + skierImage.height - 5 + self.gameHeight / 2,
      bottom: self.skierPosition.skierMapY + skierImage.height + self.gameHeight / 2
    };

    let collision = self.obstacles.find((obstacle) => {
      let obstacleImage = self.loadedAssets[obstacle.type],
          obstacleRect: IRect = {
            left: obstacle.x,
            right: obstacle.x + obstacleImage.width,
            top: obstacle.y + obstacleImage.height - 5,
            bottom: obstacle.y + obstacleImage.height
          };
      return self.intersectRect(skierRect, obstacleRect);
    });

    let jump = self.obstacles.find((ramp) => {
      let rampImage = self.loadedAssets['jumpRamp'],
        rampRect: IRect = {
          left: ramp.x,
          right: ramp.x + rampImage.width,
          top: ramp.y + rampImage.height - 5,
          bottom: ramp.y + rampImage.height
        };
      return self.intersectRect(skierRect, rampRect);
    });

    if (jump && jump.type === "jumpRamp") {
      self.skierDirection = 6;
      self.drawSkier();
      self.currentScore += 5;
    }

    if (collision && collision.type !== "jumpRamp") {
      clearTimeout(self.timePlay);
      if (localStorage.getItem('high-score')) {
        let prevScore = parseInt(localStorage.getItem('high-score'));
        if (prevScore < self.currentScore) {
          localStorage.setItem('high-score', JSON.stringify(self.currentScore));
        }
      } else {
        localStorage.setItem('high-score', JSON.stringify(self.currentScore));
      }
      self.currentScore = 0;
      self.skierDirection = 0;
    }
  }

  private getSkierAsset() {
    let self = this,
        skierAssetName = self.assetNameTable[self.skierDirection];
    if (skierAssetName) {
      return skierAssetName();
    }
    return null;
  }

  private intersectRect(r1: any, r2: any) {
    return !(r2.left > r1.right || r2.right < r1.left ||
      r2.top > r1.bottom || r2.bottom < r1.top);
  }

  private drawSkier() {
    let self = this,
        skierAssetName = self.getSkierAsset(),
        skierImage = self.loadedAssets[skierAssetName],
        x = (self.gameWidth - skierImage.width) / 2,
        y = (self.gameHeight - skierImage.height) / 2;

    self.ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
  }

  private drawObstacles() {
    let self = this,
        newObstacles = [];

    self.obstacles.forEach((obstacle) => {
      let obstacleImage = self.loadedAssets[obstacle.type],
          x = obstacle.x - self.skierPosition.skierMapX - obstacleImage.width / 2,
          y = obstacle.y - self.skierPosition.skierMapY - obstacleImage.height / 2;

      if (x < -100 || x > self.gameWidth + 50 ||
        y < -100 || y > self.gameHeight + 50) {
        return;
      }
      self.ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);
      newObstacles.push(obstacle);
    });
    self.obstacles = newObstacles;
  }
}
// Asking user for valid direction and speed through the help of constructor function
(() => {
  let validDirection: boolean,
    validSpeed: boolean;
  do {
    var userInputDirection =
    prompt('Please provide skier direction: (1 = left, 2 = leftDown, 3 = center, 4 = rightDown, 5 = right)'),
        userInputSpeed =
    prompt('Please provide skier speed: ');

    if ((userInputDirection === undefined) || parseInt(userInputDirection) !== 1 &&
      parseInt(userInputDirection) !== 2 && parseInt(userInputDirection) !== 3 &&
      parseInt(userInputDirection) !== 4 && parseInt(userInputDirection) !== 5) {
        validDirection = false;
    } else {
      validDirection = true;
    }

    if ((userInputSpeed === undefined) || parseInt(userInputSpeed) === 0) {
      validSpeed = false;
    } else {
      validSpeed = true;
    }
  } while (!validDirection || !validSpeed);
  let game = new GameComponent(parseInt(userInputDirection), parseInt(userInputSpeed));
})();
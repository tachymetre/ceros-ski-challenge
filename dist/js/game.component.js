var GameComponent = (function () {
    function GameComponent(skierDirection, skierSpeed) {
        var _this = this;
        this.skierDirection = skierDirection;
        this.skierSpeed = skierSpeed;
        this.twoSqrt = 1.4142;
        this.keyboardDirectionTable = {
            37: function (event, direction) {
                if (direction === 0) {
                    _this.skierDirection = 2;
                }
                else if (direction === 1) {
                    _this.skierPosition.skierMapX -= _this.skierSpeed;
                    _this.placeNewObstacle(_this.skierDirection);
                    clearTimeout(_this.timePlay);
                }
                else {
                    _this.skierDirection--;
                    if (_this.skierDirection === 1) {
                        clearTimeout(_this.timePlay);
                    }
                }
                event.preventDefault();
            },
            38: function (event, direction) {
                if (direction === 1 || direction === 5) {
                    _this.skierPosition.skierMapY -= _this.skierSpeed;
                    _this.placeNewObstacle(6);
                }
                event.preventDefault();
            },
            39: function (event, direction) {
                if (direction === 5) {
                    _this.skierPosition.skierMapX += _this.skierSpeed;
                    _this.placeNewObstacle(_this.skierDirection);
                    clearTimeout(_this.timePlay);
                }
                else {
                    _this.skierDirection++;
                    if (_this.skierDirection === 5) {
                        clearTimeout(_this.timePlay);
                    }
                }
                event.preventDefault();
            },
            40: function (event, direction) {
                _this.skierDirection = 3;
                event.preventDefault();
            },
            75: function () {
                _this.pauseOrResumeGame(75);
            }
        };
        this.assetNameTable = {
            0: function () { return 'skierCrash'; },
            1: function () { return 'skierLeft'; },
            2: function () { return 'skierLeftDown'; },
            3: function () { return 'skierDown'; },
            4: function () { return 'skierRightDown'; },
            5: function () { return 'skierRight'; },
            6: function () { return 'skierJump1'; },
            7: function () { return 'skierJump2'; },
            8: function () { return 'skierJump3'; },
            9: function () { return 'skierJump4'; },
            10: function () { return 'skierJump5'; },
        };
        this.placeNewItemTable = {
            1: function (leftEdge, rightEdge, topEdge, bottomEdge) {
                _this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
            },
            2: function (leftEdge, rightEdge, topEdge, bottomEdge) {
                _this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                _this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
            },
            3: function (leftEdge, rightEdge, topEdge, bottomEdge) {
                _this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
            },
            4: function (leftEdge, rightEdge, topEdge, bottomEdge) {
                _this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                _this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
            },
            5: function (leftEdge, rightEdge, topEdge, bottomEdge) {
                _this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
            },
            6: function (leftEdge, rightEdge, topEdge, bottomEdge) {
                _this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
            }
        };
        this.moveSkierTable = {
            2: function () {
                _this.updateScore();
                _this.skierPosition.skierMapX -= Math.round(_this.skierSpeed / _this.twoSqrt);
                _this.skierPosition.skierMapY += Math.round(_this.skierSpeed / _this.twoSqrt);
            },
            3: function () {
                _this.updateScore();
                _this.skierPosition.skierMapY += _this.skierSpeed;
            },
            4: function () {
                _this.updateScore();
                _this.skierPosition.skierMapX += _this.skierSpeed / _this.twoSqrt;
                _this.skierPosition.skierMapY += _this.skierSpeed / _this.twoSqrt;
            },
            6: function () {
                _this.skierPosition.skierMapY += _this.skierSpeed + 1;
                _this.skierDirection++;
            },
            7: function () {
                _this.skierPosition.skierMapY += _this.skierSpeed + 2;
                _this.skierDirection++;
            },
            8: function () {
                _this.skierPosition.skierMapY += _this.skierSpeed + 3;
                _this.skierDirection++;
            },
            9: function () {
                _this.skierPosition.skierMapY += _this.skierSpeed + 4;
                _this.skierDirection++;
            },
            10: function () {
                _this.skierPosition.skierMapY += _this.skierSpeed + 5;
                _this.skierDirection = 3;
            }
        };
        this.gameAssets = {
            'skierCrash': 'dist/img/skier_crash.png',
            'skierLeft': 'dist/img/skier_left.png',
            'skierLeftDown': 'dist/img/skier_left_down.png',
            'skierDown': 'dist/img/skier_down.png',
            'skierRightDown': 'dist/img/skier_right_down.png',
            'skierRight': 'dist/img/skier_right.png',
            'tree': 'dist/img/tree_1.png',
            'treeCluster': 'dist/img/tree_cluster.png',
            'rock1': 'dist/img/rock_1.png',
            'rock2': 'dist/img/rock_2.png',
            'jumpRamp': 'dist/img/jump_ramp.png',
            'skierJump1': 'dist/img/skier_jump_1.png',
            'skierJump2': 'dist/img/skier_jump_2.png',
            'skierJump3': 'dist/img/skier_jump_3.png',
            'skierJump4': 'dist/img/skier_jump_4.png',
            'skierJump5': 'dist/img/skier_jump_5.png',
        };
        this.skierPosition = {
            'skierMapX': 0,
            'skierMapY': 0
        };
        this.gameWidth = window.innerWidth;
        this.gameHeight = window.innerHeight;
        this.obstacleTypes = [
            'tree',
            'treeCluster',
            'rock1',
            'rock2',
            'jumpRamp'
        ];
        this.obstacles = [];
        this.loadedAssets = {};
        this.shouldCloseModal = true;
        this.currentScore = 0;
        this.crashCount = 0;
        var self = this;
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
    GameComponent.prototype.initGame = function () {
        var self = this;
        self.setupKeyHandler();
        self.loadAssets().then(function () {
            self.placeInitialObstacles();
            requestAnimationFrame(self.gameLoop.bind(self));
        });
    };
    GameComponent.prototype.generateRandomNumberBetween = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    GameComponent.prototype.getScore = function () {
        document.getElementById("scoreDisplay").innerHTML =
            localStorage.getItem("high-score") || "No Score Yet!";
    };
    GameComponent.prototype.resetTheGame = function () {
        var self = this;
        self.currentScore = 0;
        self.skierDirection = 5;
        self.skierPosition = {
            'skierMapX': 0,
            'skierMapY': 0
        };
    };
    GameComponent.prototype.updateScore = function () {
        var self = this;
        self.timePlay = setTimeout(function () {
            self.currentScore++;
            self.updateScore();
        }, 1000);
    };
    GameComponent.prototype.pauseOrResumeGame = function (keyCode) {
        if (keyCode === 75) {
            var self_1 = this, modal = document.getElementById('myModal');
            if (self_1.shouldCloseModal) {
                self_1.skierDirection = 5;
                self_1.shouldCloseModal = !self_1.shouldCloseModal;
                modal.style.display = "block";
            }
            else {
                self_1.shouldCloseModal = !self_1.shouldCloseModal;
                modal.style.display = "none";
            }
        }
    };
    GameComponent.prototype.setupKeyHandler = function () {
        var self = this;
        window.addEventListener('keydown', function (event) {
            self.handleEvent(event);
        });
        document.getElementById("scoreBtn").addEventListener('click', function (event) {
            self.getScore();
        });
        document.getElementById("resetBtn").addEventListener('click', function (event) {
            self.resetTheGame();
        });
    };
    GameComponent.prototype.handleEvent = function (event) {
        var self = this;
        if (event && event.key && event.which &&
            event.which !== 75 && self.shouldCloseModal) {
            event.preventDefault();
            self.checkDirection(event, event.which);
        }
        else {
            self.pauseOrResumeGame(event.which);
        }
    };
    GameComponent.prototype.checkDirection = function (event, keyCode) {
        var self = this;
        if (keyCode && self.skierDirection >= 0) {
            self.handleDirection(event, keyCode, self.skierDirection);
        }
    };
    GameComponent.prototype.handleDirection = function (event, keyCode, direction) {
        var self = this, keyboardDirection = self.keyboardDirectionTable[keyCode];
        if (keyboardDirection) {
            keyboardDirection(event, direction);
        }
    };
    GameComponent.prototype.placeInitialObstacles = function () {
        var self = this, numberObstacles = Math.ceil(self.generateRandomNumberBetween(5, 7) *
            (self.gameWidth / 800) * (self.gameHeight / 500));
        var minX = -50, maxX = self.gameWidth + 50, minY = self.gameHeight / 2 + 100, maxY = self.gameHeight + 50;
        for (var i = 0; i < numberObstacles; i++) {
            self.placeRandomObstacle(minX, maxX, minY, maxY);
        }
        self.obstacles = self.obstacles.sort(function (obstacle) {
            var obstacleImage = self.loadedAssets[obstacle.type];
            return obstacle.y + obstacleImage.height;
        });
    };
    GameComponent.prototype.placeNewObstacle = function (direction) {
        var self = this, shouldPlaceObstacle = self.generateRandomNumberBetween(1, 8);
        if (shouldPlaceObstacle !== 8) {
            return;
        }
        var leftEdge = self.skierPosition.skierMapX;
        var rightEdge = self.skierPosition.skierMapX + self.gameWidth;
        var topEdge = self.skierPosition.skierMapY;
        var bottomEdge = self.skierPosition.skierMapY + self.gameHeight;
        var whatToPlace = self.placeNewItemTable[direction];
        if (whatToPlace) {
            whatToPlace(leftEdge, rightEdge, topEdge, bottomEdge);
        }
    };
    GameComponent.prototype.placeRandomObstacle = function (minX, maxX, minY, maxY) {
        var self = this, obstacleIndex = self.generateRandomNumberBetween(0, self.obstacleTypes.length - 1), position = self.calculateOpenPosition(minX, maxX, minY, maxY);
        self.obstacles.push({
            type: self.obstacleTypes[obstacleIndex],
            x: position.x,
            y: position.y
        });
    };
    GameComponent.prototype.calculateOpenPosition = function (minX, maxX, minY, maxY) {
        var self = this, x = Math.floor(Math.random() * (maxX - minX + 1) + minX), y = Math.floor(Math.random() * (maxY - minY + 1) + minY);
        var foundCollision = self.obstacles.find(function (obstacle) {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });
        return (foundCollision) ? self.calculateOpenPosition(minX, maxX, minY, maxY) : { x: x, y: y };
    };
    GameComponent.prototype.loadAssets = function () {
        var self = this, assetPromises = [];
        var _loop_1 = function (asset) {
            var assetImage = new Image(), assetDeferred = $.Deferred();
            assetImage.onload = function () {
                assetImage.width /= 2;
                assetImage.height /= 2;
                self.loadedAssets[asset] = assetImage;
                assetDeferred.resolve();
            };
            assetImage.src = self.gameAssets[asset];
            assetPromises.push(assetDeferred.promise());
        };
        for (var asset in self.gameAssets) {
            _loop_1(asset);
        }
        return $.when.apply($, assetPromises);
    };
    GameComponent.prototype.gameLoop = function () {
        var self = this;
        self.ctx.save();
        self.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        self.clearCanvas();
        self.moveSkier();
        self.checkIfSkierHitSomething();
        self.drawSkier();
        self.drawObstacles();
        self.ctx.restore();
        requestAnimationFrame(self.gameLoop.bind(self));
    };
    GameComponent.prototype.clearCanvas = function () {
        var self = this;
        self.ctx.clearRect(0, 0, self.gameWidth, self.gameHeight);
    };
    GameComponent.prototype.moveSkier = function () {
        var self = this, moveSkierAction = self.moveSkierTable[self.skierDirection];
        if (moveSkierAction) {
            moveSkierAction();
            self.placeNewObstacle(self.skierDirection);
        }
    };
    GameComponent.prototype.checkIfSkierHitSomething = function () {
        var self = this, skierAssetName = self.getSkierAsset(), skierImage = self.loadedAssets[skierAssetName];
        var skierRect = {
            left: self.skierPosition.skierMapX + self.gameWidth / 2,
            right: self.skierPosition.skierMapX + skierImage.width + self.gameWidth / 2,
            top: self.skierPosition.skierMapY + skierImage.height - 5 + self.gameHeight / 2,
            bottom: self.skierPosition.skierMapY + skierImage.height + self.gameHeight / 2
        };
        var collision = self.obstacles.find(function (obstacle) {
            var obstacleImage = self.loadedAssets[obstacle.type], obstacleRect = {
                left: obstacle.x,
                right: obstacle.x + obstacleImage.width,
                top: obstacle.y + obstacleImage.height - 5,
                bottom: obstacle.y + obstacleImage.height
            };
            return self.intersectRect(skierRect, obstacleRect);
        });
        var jump = self.obstacles.find(function (ramp) {
            var rampImage = self.loadedAssets['jumpRamp'], rampRect = {
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
                var prevScore = parseInt(localStorage.getItem('high-score'));
                if (prevScore < self.currentScore) {
                    localStorage.setItem('high-score', JSON.stringify(self.currentScore));
                }
            }
            else {
                localStorage.setItem('high-score', JSON.stringify(self.currentScore));
            }
            self.currentScore = 0;
            self.skierDirection = 0;
        }
    };
    GameComponent.prototype.getSkierAsset = function () {
        var self = this, skierAssetName = self.assetNameTable[self.skierDirection];
        if (skierAssetName) {
            return skierAssetName();
        }
        return null;
    };
    GameComponent.prototype.intersectRect = function (r1, r2) {
        return !(r2.left > r1.right || r2.right < r1.left ||
            r2.top > r1.bottom || r2.bottom < r1.top);
    };
    GameComponent.prototype.drawSkier = function () {
        var self = this, skierAssetName = self.getSkierAsset(), skierImage = self.loadedAssets[skierAssetName], x = (self.gameWidth - skierImage.width) / 2, y = (self.gameHeight - skierImage.height) / 2;
        self.ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
    };
    GameComponent.prototype.drawObstacles = function () {
        var self = this, newObstacles = [];
        self.obstacles.forEach(function (obstacle) {
            var obstacleImage = self.loadedAssets[obstacle.type], x = obstacle.x - self.skierPosition.skierMapX - obstacleImage.width / 2, y = obstacle.y - self.skierPosition.skierMapY - obstacleImage.height / 2;
            if (x < -100 || x > self.gameWidth + 50 ||
                y < -100 || y > self.gameHeight + 50) {
                return;
            }
            self.ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);
            newObstacles.push(obstacle);
        });
        self.obstacles = newObstacles;
    };
    return GameComponent;
}());
export { GameComponent };
(function () {
    var validDirection, validSpeed;
    do {
        var userInputDirection = prompt("Please provide skier's initial direction: (1 = left, 2 = leftDown, 3 = center, 4 = rightDown, 5 = right)"), userInputSpeed = prompt("Please provide skier's speed: (4-12) with 4 = slow, 8 = medium, 12 = fast");
        if ((userInputDirection === undefined) || parseInt(userInputDirection) !== 1 &&
            parseInt(userInputDirection) !== 2 && parseInt(userInputDirection) !== 3 &&
            parseInt(userInputDirection) !== 4 && parseInt(userInputDirection) !== 5) {
            validDirection = false;
        }
        else {
            validDirection = true;
        }
        if ((userInputSpeed === undefined) || parseInt(userInputSpeed) === 0) {
            validSpeed = false;
        }
        else {
            validSpeed = (parseInt(userInputSpeed) >= 4 && parseInt(userInputSpeed) <= 12) ? true : false;
        }
    } while (!validDirection || !validSpeed);
    var game = new GameComponent(parseInt(userInputDirection), parseInt(userInputSpeed));
})();

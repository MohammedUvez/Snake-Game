angular.module('snakeGame', [])
.controller('GameController', ['$scope', '$document', '$interval', function($scope, $document, $interval) {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    const gridSize = 20;
    const canvasSize = 400;
    const initialSnakeLength = 5;
    let snake = [];
    let direction = 'right';
    let food = {};
    let intervalPromise;

    $scope.score = 0;
    $scope.gameOver = false;

    $scope.startGame = function() {
        snake = [];
        for (let i = initialSnakeLength - 1; i >= 0; i--) {
            snake.push({ x: i, y: 0 });
        }
        placeFood();
        direction = 'right';
        $scope.score = 0;
        $scope.gameOver = false;
        if (intervalPromise) {
            $interval.cancel(intervalPromise);
        }
        intervalPromise = $interval(gameLoop, 100);
    };

    function gameLoop() {
        update();
        draw();
    }

    function update() {
        let head = { ...snake[0] };
        switch (direction) {
            case 'right':
                head.x += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
        }

        // Check for collision with walls
        if (head.x >= canvasSize / gridSize || head.x < 0 || head.y >= canvasSize / gridSize || head.y < 0) {
            gameOver();
            return;
        }

        // Check for collision with itself
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        // Check for collision with food
        if (head.x === food.x && head.y === food.y) {
            $scope.score += 10;
            placeFood();
        } else {
            snake.pop();
        }
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'green';
        snake.forEach(segment => {
            context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });

        context.fillStyle = 'red';
        context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function placeFood() {
        food.x = Math.floor(Math.random() * (canvasSize / gridSize));
        food.y = Math.floor(Math.random() * (canvasSize / gridSize));
    }

    function gameOver() {
        $scope.gameOver = true;
        $interval.cancel(intervalPromise);
    }

    // Handle keyboard input
    $document.on('keydown', function(event) {
        if ($scope.gameOver) return;
        switch (event.keyCode) {
            case 37: // Left arrow
                if (direction !== 'right') direction = 'left';
                break;
            case 38: // Up arrow
                if (direction !== 'down') direction = 'up';
                break;
            case 39: // Right arrow
                if (direction !== 'left') direction = 'right';
                break;
            case 40: // Down arrow
                if (direction !== 'up') direction = 'down';
                break;
        }
    });

    // Start the game initially
    $scope.startGame();
}]);

$(document).ready(function(){
    const codeUp = 38;
    const codeDown = 40;
    const codeLeft = 37;
    const codeRight = 39;

    const Directions = {
        down : moveSnakeDown,
        up : moveSnakeUp,
        left : moveSnakeLeft,
        right : moveSnakeRight
    }

    let direction = Directions.down;
    let movingTime = 4000;

    let snakePosition = [];
    let gameConfiguration = {
        level : 1,
        boardSize : 15
    }

    let results = [{
        username : "-",
        gameResults : "-"
    }];

    let lastResult = [{
        username : "-",
        gameResult : "-"
    }]

    let foodPosition = null;
    let superFoodPosition = null;

    let isPressed = false;
    let result = 0;

    let superFoodTimer = null;
    loadGame();
    addEvents();

    function loadGame(){
        loadConfig();
        loadBoard();
        loadResults();
        loadBestResult();

        setSnakePosition();
        setFoodPosition();

        drawSnake();
        setDiffTime();
        addSuperFood();
    }

    function setDiffTime(){
        switch (gameConfiguration.level) {
            case 1:
                movingTime = 1000;
                break;
            case 2:
                movingTime = 800;
                break;
            case 3:
                movingTime = 500;
            default:
                break;
        }
    }

    function loadConfig(){
        let config = localStorage.getItem("game-config");
        if(config != null){
            gameConfiguration = JSON.parse(config);
        }
    }

    function loadBoard(){
        for(let i = 0; i < gameConfiguration.boardSize;i++){
            let tr = $("<tr></tr>");
            for(let j = 0; j < gameConfiguration.boardSize;j++){
                let td = $("<td></td>");
                td.addClass("border");
                if(gameConfiguration.boardSize == 15){
                    td.css("height", "50");
                    td.css("width", "50");
                }

                td.attr("id", i*gameConfiguration.boardSize + j);
                tr.append(td);
            }
            $("#board").append(tr);
        }
    }
    
    function setSnakePosition(){
        snakePosition.push(parseInt(Math.random() * gameConfiguration.boardSize*gameConfiguration.boardSize));
    }

    function setFoodPosition(){
        if(isPressed == true){
            setTimeout(setFoodPosition, 10);
        }else{
            isPressed = true;
            foodPosition = parseInt(Math.random() * gameConfiguration.boardSize*gameConfiguration.boardSize);
            while(foodPosition in snakePosition ||(superFoodPosition != null && superFoodPosition == foodPosition)){
                foodPosition = parseInt(Math.random() * gameConfiguration.boardSize*gameConfiguration.boardSize);
            }
            isPressed = false;
            drawFood();
        }

    }


    function isFoodEaten(){
        return foodPosition != null && snakePosition[0] == foodPosition;
    }

    function isSuperFoodEaten(){
        return superFoodPosition != null && snakePosition[0] == superFoodPosition;
    }

    function drawFood(){
        $("#" + foodPosition).css("background-color", "red");
    }

    function drawSnake(){
        $("#"+ snakePosition[0]).css("background-color", "purple");
        for(let i = 1;i < snakePosition.length;i++){
            $("#"+ snakePosition[i]).css("background-color", "green");
        }
    }

    function addEvents(){
        
        $(document).keydown(function(e){
            if(isPressed)
                return;
            isPressed = true;
            switch (e.which) {
                case codeUp:
                    moveSnake(moveSnakeUp);
                    direction = Directions.up;
                    break;
                case codeDown:       
                    direction = Directions.down;             
                    moveSnake(moveSnakeDown);                   
                    break;
                case codeLeft:
                    moveSnake(moveSnakeLeft);
                    direction = Directions.left;
                    break;
                case codeRight:                    
                    moveSnake(moveSnakeRight);
                    direction = Directions.right;
                    break;
                default:
                    break;
            }
            isPressed = false;
        });

        setInterval(function(){
            if(isPressed)
                return;
            isPressed = true;
            moveSnake(direction);
            isPressed = false;
        }, movingTime);
    }

    function moveSnake(moveFunction){
        removeSnake();
        let crash = moveFunction();
        if(crash == false){
            endGame();
        }
        drawSnake();
    }

    function moveSnakeUp(){
        let position = snakePosition[0] - gameConfiguration.boardSize;
        snakePosition.unshift(position);
        if(checkCrash(null)){
            return false;
        }
        if(isSuperFoodEaten()){
            updateResult(10);
            removeSuperFood();
        }else if(isFoodEaten()){
            setFoodPosition();
            updateResult(1);
        }else{
            snakePosition.pop();
        }
    }
    
    function moveSnakeLeft(){
        let position = snakePosition[0] - 1;
        snakePosition.unshift(position);
        if(checkCrash(snakePosition[1])){
            return false;
        }
        if(isSuperFoodEaten()){
            updateResult(10);
            removeSuperFood();
        }else if(isFoodEaten()){
            setFoodPosition();
            updateResult(1);
        }else{
            snakePosition.pop();
        }
    }

    function moveSnakeRight(){
        let position = snakePosition[0] + 1;
        
        snakePosition.unshift(position);
        if(checkCrash(snakePosition[1])){
            return false;
        }
        if(isSuperFoodEaten()){
            updateResult(10);
            removeSuperFood();
        }else if(isFoodEaten()){
            setFoodPosition();
            updateResult(1);
        }else{
            snakePosition.pop();
        }
            
    }

    function moveSnakeDown(){
        let position = snakePosition[0] + gameConfiguration.boardSize;
        snakePosition.unshift(position);
        if(checkCrash(null)){
            return false;
        }
        if(isSuperFoodEaten()){
            updateResult(10);
            removeSuperFood();
        }else if(isFoodEaten()){
            setFoodPosition();
            updateResult(1);
        }else{
            snakePosition.pop();
        }
    }

    function removeSnake(){
        for(let i = 0; i < snakePosition.length;i++){
            $("#" +snakePosition[i]).css("background-color", "");
        }
    }



    function updateResult(score){
        result += score;
        $("#resultNow").text(result);
    }

    function checkCrash(oldHead){
        if(snakePosition[0] < 0 || snakePosition[0] >= gameConfiguration.boardSize*gameConfiguration.boardSize){
            return true;
        }
        // oldhead == null for Up and Down moving
        // oldHead != null for Left and Right
        if(oldHead && parseInt(oldHead / gameConfiguration.boardSize) != parseInt(snakePosition[0] / gameConfiguration.boardSize)){
            return true;
        }

        for(let i = 2;i < snakePosition.length;i++){
            if(snakePosition[i] == snakePosition[0])
                return true;
        }
        return false;
    }

    function endGame(){
        let user = null;
        user = prompt("Enter your name");
   
        while(user == null || user.length == 0){
            user = prompt("Enter your name");
           
        }
        saveResult(user);
        clearInterval(superFoodTimer);
        window.location.href = "zmijica-rezultati.html";
        exit();
    }

    function addSuperFood(){
        const mseconds = 1000 * 10;
        const msecondsToLive = 1000 * 1;
        superFoodPosition = null;
        
        superFoodTimer = setInterval(function(){
            superFoodPosition = parseInt(Math.random() * gameConfiguration.boardSize*gameConfiguration.boardSize);
            //superFoodPosition = 0;
            while(isPressed == true){}
            isPressed = true;
            while(superFoodPosition == foodPosition || superFoodPosition in snakePosition){
                foodPosition = parseInt(Math.random() * gameConfiguration.boardSize*gameConfiguration.boardSize);
            }
            isPressed = false;
            $("#"+superFoodPosition).css("background-color", "yellow");
            setTimeout(removeSuperFood, msecondsToLive);
        }, mseconds);
    }

    function removeSuperFood(){
        if(superFoodPosition != null){
            $("#"+superFoodPosition).css("background-color", "");
            superFoodPosition = null;
        }
    }


    function loadResults(){
        let arr = localStorage.getItem("results");
        if(arr == null){
            localStorage.setItem("results", JSON.stringify(results));
        }else{
            results = JSON.parse(arr);
        }
    }

    function saveResult(user){
        // find user and user's results
        let index = -1;
        for(let i = 0; i < results.length;i++){
            if(results[i].username == user){
                index = i;
                break;
            }
        }

        if(index != -1){
            results[index].gameResults.push(result);
            results[index].gameResults.sort((a, b) => b - a);
            
            if(results[index].gameResults.length > 5){
                results[index].gameResults.length = 5;
            }
        }else{ // if user doesnt exists make new user in array
            results.push({
                username : user,
                gameResults : [result]
            });
        }

        localStorage.setItem("lastResult", JSON.stringify({
            username : user,
            gameResult : result
        }));

        localStorage.setItem("results", JSON.stringify(results));
    }

    function loadBestResult(){
        let bestRes = 0;
        for(let i = 0; i < results.length;i++){
            if(bestRes < results[i].gameResults[0])
                bestRes = results[i].gameResults[0];
        }

        $("#resultBest").text(bestRes);
    }
})
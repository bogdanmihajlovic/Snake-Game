$(document).ready(function(){


    let gameConfiguration = {
        level : 1,
        boardSize : 15
    }

    $("#start-game-link").click(function(){
        let level = parseInt($("input[name='level']:checked").val());
        let size = parseInt($("input[name='board-size']:checked").val());
        let boardSize = 15;
        switch (size) {
            case 1:
                boardSize = 15;
                break;
            case 2:
                boardSize = 25;
                break;
            case 3:
                boardSize = 35;
                break;
            default:
                break;
        }
        gameConfiguration.boardSize = boardSize;
        gameConfiguration.level = level;
        setConfiguration();
        window.location.href = "zmijica-igra.html";         
    });
    
    function setConfiguration(){
        localStorage.setItem("game-config", JSON.stringify(gameConfiguration));
    }

})
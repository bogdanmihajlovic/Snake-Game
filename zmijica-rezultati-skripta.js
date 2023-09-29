$(document).ready(function(){
    let results = [{
        username : "-",
        gameResults : "-"
    }];

    let lastResult = [{
        username : "-",
        gameResult : "-"
    }];

    loadResults();
    showResults();

    function loadResults(){
        let arrRes = localStorage.getItem("results");
        if(arrRes == null){
            localStorage.setItem("results", JSON.stringify(results));
        }else{
            results = JSON.parse(arrRes);
        }
        arrRes = null;
        arrRes = localStorage.getItem("lastResult");

        if(arrRes != null){
            lastResult = JSON.parse(arrRes);
        }else{
            localStorage.setItem("lastResult", JSON.stringify(lastResult));
        }
    }

    function showResults(){
        $("#last-result").text(lastResult.username + " " + lastResult.gameResult);
        for(let i = 1; i < results.length;i++){
            
            let user = results[i].username;
            for(let j = 0; j < results[i].gameResults.length;j++){
                let tr = $("<tr></tr>");
                let td1 = $("<td></td>");
                let td2 = $("<td></td>");
                td1.text(user);
                td2.text(results[i].gameResults[j]);
                tr.append(td1).append(td2);
                $("#table-results").append(tr);
            }
            
        }
    }
})
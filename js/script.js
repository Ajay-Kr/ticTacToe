// HTML ELEMENTS
const playBtn = document.querySelector("#play-btn");
const menuSection = document.querySelector("#set-player-section");
const gameSection = document.querySelector("#game-section");
const nextMatchBtn = document.querySelector("#next-match");
const mainMenuBtn = document.querySelector("#to-main");
const player1Div = document.querySelector("#player1");
const player2Div = document.querySelector("#player2");
const gameLevelDiv = document.querySelector(".game-level");
const diffLevelSpan = document.querySelector(".diff-level");
const matchTimeSpan = document.querySelector(".match-time");
const matchCountSpan = document.querySelector(".match-count");
const drawCountSpan = document.querySelector(".match-draw-score");
const player1MarkSpan = document.querySelector(".player1-mark");
const player1ScoreSpan = document.querySelector(".player1-score");
const player2MarkSpan = document.querySelector(".player2-mark");
const player2ScoreSpan = document.querySelector(".player2-score"); 
const gameCells = document.querySelectorAll(".game-cell");
const msgDiv = document.querySelector(".game-msg");
const player1NameDiv = document.querySelector(".player1-name");
const player2NameDiv = document.querySelector(".player2-name");


// VARIABLES
var playerMark;
var opponentMark;

var currentTurn;
var aiLevel; //E, M, I OR -1

var redX = "rgb(255, 67, 67)";
var greenO = "rgb(92, 223, 120)";
var colorBlack = "rgba(34, 34, 34, 1)";
var colorBlackDark = "rgba(0, 0, 0, .8)";
var colorBlackLight = "#ffffff0c";
var colorTextLight = "rgba(0, 0, 0, .4)";
var colorGameCell = "#11a193";
var colorWinCell = "#1fc580d0";
var colorDrawCell = "#ec9512bd";

var winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];
var origBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var seconds = 0;
var timerIsOn = false;
var t;

var player1Name = "Player 1";
var player2Name = "Player 2";

var opponentList = document.getElementsByName("opponent-select");
var opponent;

// FUNCTIONS
function showGame() {
    menuSection.style.animationName = "slide-menu-up";
    gameSection.style.animationName = "slide-game-up";
    
    matchCountSpan.innerText = "0";
    seconds = 0;
    matchTimeSpan.innerText = "00:00";

    player1ScoreSpan.innerText = "0";
    player2ScoreSpan.innerText = "0";
    drawCountSpan.innerText = "0";
}

function play(opponent) {
    // console.log("test play()");
    // console.log(opponent);
    nextMatchBtn.disabled = true;
    reset();
    getData(opponent);

    currentTurn = toss();
    // console.log(currentTurn);
    startMsg(currentTurn);
    activePlayer();
}

function reset() {
    // console.log("test reset()");
    origBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    gameCells.forEach((cell) => {
        cell.innerText = "";
        cell.style.backgroundColor = "";
    });
    removeEvent();
}

function removeEvent() {
    gameCells.forEach((cell) => {
         cell.removeEventListener("mouseover", turnMouse);
         cell.removeEventListener("mouseleave", turnMouse);
         cell.removeEventListener("click", turnMouse);
         cell.style.cursor = "default";
    });
}

function getData(opponent) {
    // console.log("inside getData()");
    // console.log(opponent);
    if(document.querySelector("#mark-x").checked) {
        playerMark = "X";
        player1Div.classList.add("mark-inactive");
        player1Div.style.border = "2px solid "+redX;
        player1NameDiv.style.backgroundColor = redX;
        player1MarkSpan.innerText = playerMark;
        player1MarkSpan.style.color = redX;

        opponentMark = "O";
        player2Div.classList.add("mark-inactive");
        player2Div.style.border = "2px solid "+greenO;
        player2NameDiv.style.backgroundColor = greenO;
        player2MarkSpan.innerText = opponentMark;
        player2MarkSpan.style.color = greenO;
    } else {
        playerMark = "O";
        player1Div.classList.add("mark-inactive");
        player1Div.style.border = "2px solid "+greenO;
        player1NameDiv.style.backgroundColor = greenO;
        player1MarkSpan.innerText = playerMark;
        player1MarkSpan.style.color = greenO;

        opponentMark = "X";
        player2Div.classList.add("mark-inactive");
        player2Div.style.border = "2px solid "+redX;
        player2NameDiv.style.backgroundColor = redX;
        player2MarkSpan.innerText = opponentMark;
        player2MarkSpan.style.color = redX;
    }

    // console.log(opponent);
    player1Name = document.querySelector("#name1").value;
    player1NameDiv.innerText = (player1Name == "") ? "Player 1" : player1Name;

    if(opponent == "ai") {
        // console.log("testing ai");
        var diffList = document.getElementsByName("level");
        diffList.forEach((tag) => {
            if(tag.checked)
                aiLevel = tag.id
        });
        gameLevelDiv.style.display = "block";
        diffLevelSpan.innerText = aiLevel;
        diffLevelSpan.style.color = (aiLevel == "easy") ? greenO : ((aiLevel == "medium") ? "rgb(255, 163, 76)" : redX);
        player2NameDiv.innerText = "Computer";
        player2NameDiv.style.letterSpacing = "1px";
    } else if (opponent == "frnd") {
        // console.log("testing frnd");
        gameLevelDiv.style.display = "none";
        player2Name = document.querySelector("#name2").value;
        player2NameDiv.innerText = (player2Name == "") ? "Player 2" : player2Name;
    }
}

function toss() {
    if(Math.round(Math.random()) == 0)
        return playerMark;
    else
        return opponentMark;
}

function startMsg(currentTurn) {
    // console.log("testing startMsg()");
    var name = (currentTurn == playerMark) ? player1NameDiv.innerText+" ( <b>"+currentTurn+"<b> ) " : player2NameDiv.innerText+" ( <b>"+currentTurn+"<b> ) ";
    msgDiv.innerHTML = name + "Starts";

    msgDiv.style.animationDelay = ".5s";
    msgDiv.style.animationName = "slide-in";

    setTimeout(() => {
        msgDiv.style.animationName = "slide-out";
        addEvent();
        msgDiv.onanimationend = startCount();
    }, 2000);
}

function winMsg(winner) {
    var name = (winner == playerMark) ? player1NameDiv.innerText : player2NameDiv.innerText ;
    msgDiv.innerHTML = name + " Won!";

    stopCount();
    msgDiv.style.animationDelay = "0s";
    msgDiv.style.animationName = "slide-in";
}

function drawMsg() {
    msgDiv.innerText = "Draw!";
    stopCount();
    msgDiv.style.animationDelay = "0s";
    msgDiv.style.animationName = "slide-in";
}

function startCount() {
    if(!timerIsOn) {
        timerIsOn = true;
        timeCount();
    }
}

function stopCount() {
    clearTimeout(t);
    timerIsOn = false;
}

function timeCount() {
    var mins = padnum(parseInt(seconds/60));
    var secs = padnum(seconds - 60*mins);
    matchTimeSpan.innerText = mins + " : " + secs;
    seconds = seconds + 1;
    t = setTimeout(timeCount, 1000);
}

function padnum(num) {
    if(num <=9)
        num = "0"+num;
    return num;
}

function activePlayer() {
    player1Div.className = "mark-inactive";
    player2Div.className = "mark-inactive";

    if(playerMark == currentTurn) {
        player1Div.className = "mark-"+currentTurn+"-active";
        // player1MarkSpan.style.color = colorBlack;
        player1MarkSpan.style.fontWeight = "600";
    } else {
        player2Div.className = "mark-"+currentTurn+"-active";
        // player2MarkSpan.style.color = colorBlack;
        player2MarkSpan.style.fontWeight = "600";
    }
}

function addEvent() {
    if(opponent == "ai" && currentTurn == opponentMark) {
        setTimeout(checkAiTurn(), 2000);
    } else {
        gameCells.forEach((gameCell) => {
            gameCell.addEventListener("mouseover", turnMouse);
            gameCell.addEventListener("mouseleave", turnMouse);
            gameCell.addEventListener("click", turnMouse);
        });
    }

}

function turn(gameCellIndex, mark, mouseEvent) {
    var gameCell = document.getElementById(gameCellIndex);

    if(origBoard[gameCellIndex] == 0) {
        if(mouseEvent == "mouseover") {
            gameCell.style.background = colorBlackLight;
            gameCell.style.opacity = ".7";
            gameCell.style.color = colorTextLight;
            gameCell.style.cursor = "pointer";
            gameCell.innerText = mark;
        } else if(mouseEvent == "mouseleave") {
            gameCell.style.background = colorGameCell;
            gameCell.style.opacity = "1";
            gameCell.style.pointer = "default";
            gameCell.innerText = "";
        }

        if(mouseEvent == "click") {
                origBoard[gameCellIndex] = mark;
                gameCell.style.background = colorGameCell;
                gameCell.style.opacity = "1";
                gameCell.style.color = (mark == "X") ? redX : greenO;
                gameCell.innerText = mark;

            var gameWon = checkWin(origBoard, mark);
            if(gameWon) {
                gameOver(gameWon);
            } else if(!checkTie()) {
                currentTurn = (currentTurn == "X") ? "O" : "X";
                activePlayer();
                checkAiTurn();
            }
        }
    } 
}

function checkWin(board, player) {
    var gameWon = null;
    var score = 0;

    for(var i = 0; i < winningCombos.length; i++) {
        score = 0;
        for(var j = 0; j < 3; j++) {
            if(board[winningCombos[i][j]] == player)
                score++;
            else 
                break;
        }
        if(score == 3) {
            gameWon = {
                index: i,
                player: player
            };
            break;
        }
    }
    return gameWon;
}

function checkTie() {
    for(var i = 0; i < origBoard.length; i++) {
        if(origBoard[i] == 0)
            return false;
    }
    removeEvent();
    nextMatchBtn.disabled = false;
    for(var i = 0; i < 9; i++) {
        document.getElementById(i).style.backgroundColor = colorDrawCell;
    }
    drawMsg();
    matchCountSpan.innerText = parseInt(matchCountSpan.innerText) + 1;
    drawCountSpan.innerText = parseInt(drawCountSpan.innerText) + 1;
    return true;
}

function gameOver(gameWon) {
    for(var i = 0; i < 3; i++) 
        document.getElementById(winningCombos[gameWon.index][i]).style.backgroundColor = colorWinCell;
    
    removeEvent();
    nextMatchBtn.disabled = false;
    winMsg(gameWon.player);
    matchCountSpan.innerText = parseInt(matchCountSpan.innerText) + 1;
    if(gameWon.player == playerMark) 
        player1ScoreSpan.innerText = parseInt(player1ScoreSpan.innerText) + 1;
    else 
        player2ScoreSpan.innerText = parseInt(player2ScoreSpan.innerText) + 1;
}

function checkAiTurn() {
    if(opponent != "frnd" && currentTurn == opponentMark) {
        // console.log(aiLevel);
        removeEvent();
        setTimeout(() => {
            turn(aiMove(), currentTurn, "click");
        }, Math.floor(Math.random()*2000 + 1));
    } else {
        addEvent();
    }
}

function aiMove() {
    if(aiLevel == "easy")
        return easyLevel();
    else if(aiLevel == "medium")
        return mediumLevel(origBoard, opponentMark).index;
    else if(aiLevel == "impossible")
        return minimax(origBoard, 0, -10000, 10000, opponentMark).index;

}

function easyLevel()
{
    var unplayedIndeces = [];
    for(var i=0; i<origBoard.length; i++)
    {
        if(origBoard[i] == 0)
            unplayedIndeces.push(i);
    }
    return unplayedIndeces[Math.floor( Math.random()*unplayedIndeces.length )];
}

//dumb minimax with some randomness
function mediumLevel(newBoard, player)
{
    var availSpots = [];
    for(var i=0; i<newBoard.length; i++)
    {
        if(newBoard[i] == 0)
            availSpots.push(i);
    }

    // if terminal state reaches, return with the score
    if(checkWin(newBoard, opponentMark)) //let opponent(ai) be the minimizer
        return {score: -10};
    else if(checkWin(newBoard, playerMark)) // let player1(human) be the maximiser
        return {score: 10};
    else if(availSpots.length == 0) // tie 
        return {score: 0};

    //storing score and index for each move possible from the given board state
    var moves = [];

     // loop through all available spots
    for (var i = 0; i < availSpots.length; i++)
    {
        //create an object for each and store the index of that spot 
        var move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player; // set the empty spot to the current player

        //collect the score resulted from calling minimax on the opponent of the current player
        if (player == opponentMark){
            var result = mediumLevel(newBoard, playerMark);
            move.score = result.score;
        }
        else{
            var result = mediumLevel(newBoard, opponentMark);
            move.score = result.score;
        }     
        // reset the spot to empty for the next loop itereration   
        newBoard[availSpots[i]] = 0;
        // push the object to the array
        moves.push(move);
    }

    // evaluating the best move in the moves array (i.e. all the possible moves)
    var bestMove;

    if(  Math.random() > 0.8 ) //randomness
    {
        bestMove = Math.floor( Math.random() * moves.length );
    }
    else
    {
        //if it is the ai's turn loop over the moves and choose the move with the lowest score 
        //as we have taken ai as the minimiser
        if(player === opponentMark)
        {
            var bestScore = 10000;
            for(var i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore)
                {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        else // else loop over the moves and choose the move with the highest score (as human player is the maximiser)
        {
            var bestScore = -10000;
            for(var i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore)
                {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
    }
    // return the chosen move (object) from the moves array
    return moves[bestMove];
}

//minimax algorithm with alpha-beta pruning optimization
//Alpha is the best value that the maximizer (human) currently can guarantee at that level or below.
//Beta is the best value that the minimizer (ai) currently can guarantee at that level or below.
function minimax(newBoard, depth, alpha, beta, player)
{
    // calculating the playable spots in a board state
    var availSpots = [];
    for(var i=0; i<newBoard.length; i++)
    {
        if(newBoard[i] == 0)
            availSpots.push(i);
    }

    // if terminal state reaches, return with the score
    if(checkWin(newBoard, opponentMark)) //let opponent(ai) be the minimizer
        return {score: -20+depth};
    else if(checkWin(newBoard, playerMark)) // let player1(human) be the maximiser
        return {score: 20-depth};
    else if(availSpots.length == 0) // tie 
        return {score: 0};


    //if it is the ai's turn, lowest score (as we have taken ai as the minimiser)
    if(player === opponentMark)
    {
        var bestScore = 10000;
        var bestMove = {};
        for(var i = 0; i < availSpots.length; i++)
        {
            newBoard[availSpots[i]] = player; // set the empty spot to the current player
            
            var value = minimax(newBoard, depth+1, alpha, beta, playerMark);
            if(value.score < bestScore)
            {
                bestScore = value.score;
                bestMove.index = availSpots[i];
                bestMove.score = bestScore;
            }

            // reset the spot to empty for the next loop itereration
            newBoard[availSpots[i]] = 0;

            beta = Math.min(beta,bestScore);
            if(beta <= alpha)
                break;
        }
        return bestMove;
    }
    else // else highest score (as human player is the maximiser)
    {
        var bestScore = -10000;
        var bestMove = {};
        for(var i = 0; i < availSpots.length; i++)
        {
            newBoard[availSpots[i]] = player; // set the empty spot to the current player

            var value = minimax(newBoard, depth+1, alpha, beta, opponentMark);
            if(value.score > bestScore)
            {
                bestScore = value.score;
                bestMove.index = availSpots[i];
                bestMove.score = bestScore;
            }

            // reset the spot to empty for the next loop itereration
            newBoard[availSpots[i]] = 0;

            alpha = Math.max(alpha,bestScore);
            if(beta <= alpha)
                break;    
        }
        return bestMove;
    }
}

function nameFunction() {
    var name1 = document.querySelector("#name1");
    var name2 = document.querySelector("#name2");
    var label1 = document.querySelector(".name1-label");
    var label2 = document.querySelector(".name2-label");
    
    if(name1.value != "") {
        label1.innerText = name1.value;
    }
    if (name2.value != "")
        label2.innerText = name2.value;
}


// EVENT HANDLERS
const handleOpponentClick = (e) => {
    opponentList.forEach((tag) => {
        if(tag.checked == true)
            opponent = tag.id; 
    });

    if(opponent != "ai") {
        // console.log("if "+opponent);
        document.querySelector(".ai-level").style.animationDuration = "1s";
        document.querySelector(".ai-level").style.animationName = "fadeout";
        document.querySelector(".for-name2").style.animationDuration = "1s";
        document.querySelector(".for-name2").style.animationName = "fadein";
        document.querySelector(".for-name2").style.display = "inline-block";
    } else {
        // console.log("else "+opponent);
        document.querySelector(".ai-level").style.animationDuration = "1s";
        document.querySelector(".ai-level").style.animationName = "fadein";
        document.querySelector(".for-name2").style.animationDuration = "1s";
        document.querySelector(".for-name2").style.animationName = "fadeout";
        document.querySelector(".for-name2").style.display = "none";
    }
}

const handlePlayClick = (e) => {
    opponentList.forEach((tag) => {
        if(tag.checked == true)
            opponent = tag.id; 
    });
    // console.log("opponent is = "+opponent);
    play(opponent);
    showGame();
}

const handleMainMenuClick = (e) => {
    reset();
    stopCount();
    menuSection.style.animationName = "slide-menu-down";
    gameSection.style.animationName = "slide-game-down";
}

const handleNextMatchClick = (e) => {
    nextMatchBtn.disabled = true;
    msgDiv.style.animationName = "slide-out";
    setTimeout(() => {
        if(opponent == "frnd")
            play("frnd");
        else   
            play("ai");
    }, 500);
}

const turnMouse = (e) => {
    turn(e.target.id, currentTurn, e.type);
}


// EVENT LISTNERS
opponentList.forEach((tag) => {
    tag.addEventListener("click", handleOpponentClick);
});
playBtn.addEventListener("click", handlePlayClick);
mainMenuBtn.addEventListener("click", handleMainMenuClick);
nextMatchBtn.addEventListener("click", handleNextMatchClick);
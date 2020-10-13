const winningCombosIndex = [[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]]
const gameCommentary = ["So close","Late drama","This is why we love this game","Make them pay","All in a day's work","Keep going","Absolutely omnipotent","No stopping now","Hanging on by a thread","Onto something here","A game-changing move","The momentum has shifted","Absolutely fantastic","We are off and running","A wonderful move","A crazy moment","I didn't see that coming","Cunning move!","This is an epic battle","That was unfortunate","Brilliant","Pure tactical brilliance","A counterattack","Put on the defensive","It all comes down to this","Here’s the chance!","The fox is in the box","Superbly done!","Great opportunity","Well Done","An audacious attempt.","What a build-up","Could this be it?","What anticipation!","There it is","Oh!","Here it comes"]
const matchCommentary = {notClose: ["What can losing do from this position","winning has been much the better side!","winning’s definitely superb.","This match is being controlled by winning","losing DO BETTER!","winning is sending a message to losing today","losing’s not waving the white flag just yet, but they are unfurling it.","winning is humiliating losing","Looks like losing forgot to show up today","winning’s every move is a winner","losing can’t catch a break today"], close: ["Plenty of energy in this matchup.","Who will seize the momentum?","This is one of the best matches I have ever seen.","Neither player has a clear advantage.","The victor is still in question.","Do not scratch your eyes! You are really seeing the most extraordinary matchup.","This is a close one","This is a tightly contested battle","This is an evenly matched competition","This could go either way"]}
const valArr = document.querySelectorAll('.column')
const newGameButton = document.querySelector('#newGameButton')
let whosTurnButton = document.querySelector("#whosTurn")
let pickButtons = document.querySelectorAll("#pick")
let scoreCard = {X:0,O:0,draw:0}
let whosTurn = undefined
let isDraw = false
let winner = false

function changeTurn() {
    if (whosTurn != undefined) {
        if (whosTurn === 'X'){
            whosTurn = 'O'
        } else if (whosTurn === 'O'){
            whosTurn = 'X'
        }
        whosTurnButton.textContent = `${whosTurn}'s Turn`
    } else {
        whosTurnButton.style.display = "none";
        pickButtons.forEach(button => {
            button.style.display = "block";
        })
        
    }
}


// get value of each square and convert to a string
// 1 if it matches the player whose turn it was
// 0 if it belongs to the non-turn player or is null
function getBoardValues(player) {
    let tempStr = ""
    valArr.forEach(char => {
        console.log('char.textContent',char.textContent)
        if (char.textContent === whosTurn){
            tempStr = tempStr+"1"
        } else {
            tempStr = tempStr+'0'
        }
    })
    
    // determine the index of all the players squares and put into an array
    let indexMatchArr = []
    let regexp = /1/g;
    let matches = [...tempStr.matchAll(regexp)];//todo; understand the ellipsis in this statement
    matches.forEach((match) => {
        indexMatchArr.push(match.index)
    });
    return indexMatchArr
}

function hasWon(boardVals){
    // if the index array has one of the winning combinations, declare the winner
    console.log("boardVals",boardVals)
    winningCombosIndex.some(combo => {
        let intersecton = combo.filter(x => boardVals.includes(x))
        if(intersecton.length === 3){
            console.log("We have a winner")
            winner = true
        }
    })
}

function randomComment() {
    comment = gameCommentary[Math.floor(Math.random() * gameCommentary.length)];
    return comment;
}

function randomMatchCommentary () {
    
    if (scoreCard.X - scoreCard.O > 2) {
        matchComment = matchCommentary.notClose[Math.floor(Math.random() * matchCommentary.notClose.length)];
        matchComment = matchComment.replace('winning','X')
        matchComment = matchComment.replace('losing','O')
    } else if (scoreCard.O - scoreCard.X > 2) {
        matchComment = matchCommentary.notClose[Math.floor(Math.random() * matchCommentary.notClose.length)];
        matchComment = matchComment.replace('winning','O')
        matchComment = matchComment.replace('losing','X')
    } else {
        matchComment = matchCommentary.close[Math.floor(Math.random() * matchCommentary.close.length)];
    }
    return matchComment
}

function addMessage(message) {
    const template = document.querySelector('#message-template');
    const messageUL = document.querySelector('#message-ul');
    let messageBlock = document.importNode(template.content, true);
    //end game messaging if someone has won or it we have a draw
    // else add new message to the message window
    if (winner || isDraw){  
        while (messageUL.childElementCount > 0) {
            document.querySelector('#message-ul').lastElementChild.remove()
        }
        if (isDraw) {
            messageBlock.querySelector('h1').textContent = " You have battled to a draw"
        } else {
            messageBlock.querySelector('h1').textContent = " "+whosTurn+ " is the winner!"
        }
        messageBlock.querySelector('p').textContent = ""
        // hide turn button and display new game button
        whosTurnButton.style.display = "none";
        newGameButton.style.display = "block";
    } else { 
        messageBlock.querySelector('p').textContent = "- "+message
    }
    messageUL.insertBefore(messageBlock, messageUL.children[0])
    // trim old messages so it doesn't overflow the message div
    if (messageUL.childElementCount > 3){
        document.querySelector('#message-ul').lastElementChild.remove()
    }
}

newGameButton.addEventListener('click', (e) => {
    // update stats when a new game is started
    // remove the old stats element completely and recreate it with updated information
    const statsTemplate = document.querySelector('#stat-template');
    const statsUL = document.querySelector('#stat-ul');
    let statsBlock = document.importNode(statsTemplate.content, true);
    statsBlock.querySelector('h2').textContent = "ScoreCard"
    statsBlock.querySelector('#stat1').textContent = `X wins: ${scoreCard.X}`
    statsBlock.querySelector('#stat2').textContent = `O wins: ${scoreCard.O}`
    statsBlock.querySelector('#stat3').textContent = `Draws : ${scoreCard.draw}`
    statsBlock.querySelector('h4').textContent = randomMatchCommentary()
    while (statsUL.childElementCount > 0) {
        document.querySelector('#stat-ul').lastElementChild.remove()
    }
    statsUL.appendChild(statsBlock)
    console.log(randomMatchCommentary())
    winner = false
    whosTurn = undefined
    isDraw = false
    valArr.forEach(char => {
        char.textContent = ""
    })
    while (document.querySelector('#message-ul').childElementCount > 0) {
        document.querySelector('#message-ul').lastElementChild.remove()
    }
    addMessage("Starting new game")
    changeTurn()
    newGameButton.style.display = "none";

})

const buttonsAll = document.querySelector('.buttonContainer')
buttonsAll.addEventListener('click', (e) => {
    if (whosTurn == undefined && e.target.id == 'pick') {
        whosTurn = e.target.textContent[0]
        whosTurnButton.style.display = "block";
        pickButtons.forEach(button => {
            button.style.display = "none";
        })
        // addMessage(`Player ${whosTurn}'s Turn`)
        whosTurnButton.textContent = `${whosTurn}'s Turn`
    }
})



const squaresContainer = document.querySelector('.container')
squaresContainer.addEventListener('click', (e) => {
    if (!winner && whosTurn != undefined){
        if (e.target.classList.contains('gameSquare') && e.target.textContent === "") {
            e.target.textContent = whosTurn
            console.log("whosTurn", whosTurn)
            let icon = document.createElement('span')
            if (whosTurn == 'O') {
                icon.className = "fa fa-circle-o"
                icon.id = "o"
            } else {
                icon.className = "fa fa-times"
                icon.id = "x"
            }
            e.target.appendChild(icon)
            // addMessage(`${whosTurn} turn is over`)
            addMessage(randomComment())
            let boardVals = getBoardValues(whosTurn)
            hasWon(boardVals)
            if (winner) {
                addMessage(`${whosTurn} is the winner!`)
                if (whosTurn == "X"){
                    scoreCard.X +=1
                } else {
                    scoreCard.O +=1
                }
                // console.log(matchCommentary())
            } else if (boardVals.length == 5 && !winner){
                isDraw = true
                scoreCard.draw +=1
                addMessage("we have a draw")
                // console.log(matchCommentary())
            } else {
                changeTurn()
            }
        }
    }
})

addMessage("Please select starting player")
whosTurnButton.addEventListener('click', changeTurn())
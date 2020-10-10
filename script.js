const winningCombosIndex = [[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]]
const valArr = document.querySelectorAll('.column')
const newGameButton = document.querySelector('#newGameButton')
let scoreCard = {X:0,O:0,draw:0}
let whosTurn = undefined
let isDraw = false
let winner = false
let whosTurnButton = document.querySelector("#whosTurn")
let pickButtons = document.querySelectorAll("#pick")


function changeTurn() {
    if (whosTurn != undefined) {
        if (whosTurn === 'X'){
            whosTurn = 'O'
        } else if (whosTurn === 'O'){
            whosTurn = 'X'
        }
        whosTurnButton.textContent = `Player ${whosTurn}'s Turn`
        addMessage(`Player ${whosTurn}'s Turn`)
    } else {
        whosTurnButton.style.display = "none";
        pickButtons.forEach(button => {
            button.style.display = "inline";
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
            messageBlock.querySelector('h1').textContent = "You have battled to a draw"
        } else {
            messageBlock.querySelector('h1').textContent = whosTurn+ " is the winner!"
        }
        messageBlock.querySelector('blockquote').textContent = ""
        // hide turn button and display new game button
        whosTurnButton.style.display = "none";
        newGameButton.style.display = "inline";
    } else { 
        messageBlock.querySelector('blockquote').textContent = "> "+message
    }
    messageBlock.querySelector('p').textContent = ""
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
    // console.log("statsBlock", statsBlock)
    statsBlock.querySelector('h2').textContent = "ScoreCard"
    statsBlock.querySelector('#stat1').textContent = `X wins: ${scoreCard.X}`
    statsBlock.querySelector('#stat2').textContent = `O wins: ${scoreCard.O}`
    statsBlock.querySelector('#stat3').textContent = `Draws : ${scoreCard.draw}`
    while (statsUL.childElementCount > 0) {
        document.querySelector('#stat-ul').lastElementChild.remove()
    }
    statsUL.appendChild(statsBlock)
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

const squaresContainer = document.querySelector('.container')
squaresContainer.addEventListener('click', (e) => {
    if (whosTurn == undefined && e.target.id == 'pick') {
        // console.log(e.target.textContent[0])
        
        whosTurn = e.target.textContent[0]
        whosTurnButton.style.display = "inline";
        pickButtons.forEach(button => {
            button.style.display = "none";
        })
        addMessage(`Player ${whosTurn}'s Turn`)
        whosTurnButton.textContent = `Player ${whosTurn}'s Turn`
    }

    if (!winner && whosTurn != undefined){
        if (e.target.classList.contains('gameSquare') && e.target.textContent === "") {
            e.target.textContent = whosTurn
            console.log("whosTurn", whosTurn)
            // e.target.classList = 'column gameSquare i'
            //////
            let icon = document.createElement('span')
            // icon.className = "fa fa-circle-o"
            if (whosTurn == 'O') {
                icon.className = "fa fa-circle-o"
                icon.id = "o"
            } else {
                icon.className = "fa fa-times"
                icon.id = "x"
            }
            e.target.appendChild(icon)
            // e.target.className = "fa fa-car"
            // console.log('e.target.classList',e.target.classList )
            // e.target.classList = `gameSquare ${whosTurn}`

            addMessage(`${whosTurn} turn is over`)
            let boardVals = getBoardValues(whosTurn)
            hasWon(boardVals)
            if (winner) {
                addMessage(`${whosTurn} is the winner!`)
                if (whosTurn == "X"){
                    scoreCard.X +=1
                } else {
                    scoreCard.O +=1
                }
        } else if (boardVals.length == 5 && !winner){
                isDraw = true
                scoreCard.draw +=1
                addMessage("we have a draw")
            } else {
                changeTurn()
            }
        }
    }
})

addMessage("Please select starting player")
addMessage("Welcome to tic-tac-toe")
whosTurnButton.addEventListener('click', changeTurn())
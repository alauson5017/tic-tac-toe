const winningCombosIndex = [[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]]
const valArr = document.querySelectorAll('.column')
const newGameButton = document.querySelector('#newGameButton')

let whosTurn = undefined
let isDraw = false
let winner = false
let whosTurnButton = document.querySelector("#whosTurn")
let pickButtons = document.querySelectorAll("#pick")


// get value of each square and convert to a string
// 1 if it matches the player whose turn it was
// 0 if it belongs to the non-turn player or is null
function changeTurn() {
    if (whosTurn != undefined) {
        if (whosTurn === 'X'){
            whosTurn = 'O'
        } else if (whosTurn === 'O'){
            whosTurn = 'X'
        }
        whosTurnButton.textContent = `Player ${whosTurn}'s Turn`
    } else {
        whosTurnButton.style.display = "none";
        pickButtons.forEach(button => {
            button.style.display = "inline";
        })
            
    }
}
function getBoardValues(player) {
    let tempStr = ""

    valArr.forEach(char => {
        console.log(char.textContent)
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
    console.log('indexMatchArr', indexMatchArr)

    return indexMatchArr
}

function hasWon(boardVals){
    // if the index array has one of the winning combinations, declare the winner
    winningCombosIndex.some(combo => {
        let intersecton = combo.filter(x => boardVals.includes(x))
        if(intersecton.length === 3){
            console.log("We have a winner")
            console.log(combo)
            winner = true
            return winner
        }
    })
}

function addMessage(message) {
    const template = document.querySelector('#message-template');
    const messageUL = document.querySelector('#message-ul');
    let messageBlock = document.importNode(template.content, true);
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
    } else {
        messageBlock.querySelector('blockquote').textContent = "> "+message
    }
    messageBlock.querySelector('p').textContent = ""
    messageUL.insertBefore(messageBlock, messageUL.children[0])
    // console.log('messageUL.childElementCount', messageUL.childElementCount)
    if (messageUL.childElementCount > 3){
        document.querySelector('#message-ul').lastElementChild.remove()
    }
}

newGameButton.addEventListener('click', (e) => {
    winner = false
    whosTurn = undefined
    valArr.forEach(char => {
        char.textContent = ""
    })
    addMessage("Starting new game")
    changeTurn()
})

const squaresContainer = document.querySelector('.container')
squaresContainer.addEventListener('click', (e) => {
    console.log(e.target.id)
    console.log('whosTurn', whosTurn)
    if (whosTurn == undefined && e.target.id == 'pick') {
        console.log(e.target.textContent[0])
        whosTurn = e.target.textContent[0]
        whosTurnButton.style.display = "inline";
        pickButtons.forEach(button => {
            button.style.display = "none";

    })
    whosTurnButton.textContent = `Player ${whosTurn}'s Turn`

}
    if (!winner){
        if (e.target.classList.contains('gameSquare') && e.target.textContent === "") {
            e.target.textContent = whosTurn
            addMessage(`${whosTurn} turn is over`)
            let boardVals = getBoardValues(whosTurn)
            console.log('boardVals',boardVals)
            if (boardVals.length < 5) {
                hasWon(boardVals)
                console.log('hasWon(boardVals)', winner)
                if (winner) {
                    addMessage(`${whosTurn} is the winner!`)
                } else {
                    changeTurn()
                    console.log('whosTurn', whosTurn)
                }
            } else {
                isDraw = true
                addMessage("match is ended in a draw")
                
            }
        }

    }

})
addMessage("welcome to game")
whosTurnButton.addEventListener('click', changeTurn())
const winningCombosIndex = [[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]]
const valArr = document.querySelectorAll('.column')
const newGameButton = document.querySelector('#newGameButton')

let whosTurn = ''
let whosTurnButton = document.querySelector("#whosTurn")//.textContent
let winner = false
console.log('whosTurnButton.textContent', whosTurnButton.textContent)






// get value of each square and convert to a string
// 1 if it matches the player whose turn it was
// 0 if it belongs to the non-turn player or is null
function changeTurn() {
    if (whosTurn != '') {
        if (whosTurn === 'X'){
            whosTurn = 'O'
        } else if (whosTurn === 'O'){
            whosTurn = 'X'
        } else {
            addMessage(`X will start by default`)
            whosTurn = 'X'
        }
        whosTurnButton.textContent = `Player ${whosTurn}'s Turn`
    } else {
        console.log('unknown turn')
        whosTurn = 'O'
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
    if (winner){
        messageBlock.querySelector('h1').textContent = whosTurn+ " is the winner!"
        messageBlock.querySelector('blockquote').textContent = ""
    } else {
        messageBlock.querySelector('blockquote').textContent = "> "+message
    }
    messageBlock.querySelector('p').textContent = ""
    messageUL.insertBefore(messageBlock, messageUL.children[0])
    console.log('messageUL.childElementCount', messageUL.childElementCount)
    if (messageUL.childElementCount > 3){
        console.log('time to remove a child')
        document.querySelector('#message-ul').lastElementChild.remove()
    }
}

newGameButton.addEventListener('click', (e) => {
    winner = false
    whosTurn = ''
    valArr.forEach(char => {
        char.textContent = ""
    })
    addMessage("Starting new game")
})

const squaresContainer = document.querySelector('.container')
squaresContainer.addEventListener('click', (e) => {
    if (whosTurn === '') {
        changeTurn()
    }
    if (!winner){
        if (e.target.classList.contains('gameSquare') && e.target.textContent === "") {
            e.target.textContent = whosTurn
            addMessage(`${whosTurn} turn is over`)
            let boardVals = getBoardValues(whosTurn)
            console.log('boardVals',boardVals)
            hasWon(boardVals)
            console.log('hasWon(boardVals)', winner)
            if (winner) {
                addMessage(`${whosTurn} is the winner!`)
            } else {
                changeTurn()
                console.log('whosTurn', whosTurn)
            }
        }

    } else {

    }

})

whosTurnButton.addEventListener('click', changeTurn())
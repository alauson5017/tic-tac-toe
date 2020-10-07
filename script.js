const winningCombosIndex = [[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]]
const valArr = document.querySelectorAll('.column')
const newGameButton = document.querySelector('#newGameButton')

let whosTurn = 'O'
let tempStr = ""

// get value of each square and convert to a string
// 1 if it matches the player whose turn it was
// 0 if it belongs to the non-turn player or is null
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

// if the index array has one of the winning combinations, declare the winner
winningCombosIndex.forEach(combo => {
    let intersecton = combo.filter(x => indexMatchArr.includes(x))
    if(intersecton.length === 3){
        console.log("We have a winner")
        console.log(combo)
    }
})

function addMessage(message) {
    const template = document.querySelector('#message-template');
    const messageUL = document.querySelector('#message-ul');
    let messageBlock = document.importNode(template.content, true);
    messageBlock.querySelector('blockquote').textContent = "> "+message
    messageBlock.querySelector('p').textContent = ""
    messageUL.insertBefore(messageBlock, messageUL.children[0])
}

newGameButton

addMessage('test message')
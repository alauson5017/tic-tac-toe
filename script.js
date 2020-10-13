const valArr = document.querySelectorAll('.column')
const newGameButton = document.querySelector('#newGameButton')
let whosTurnButton = document.querySelector("#whosTurn")
let pickButtons = document.querySelectorAll("#pick")
let scoreCard = {X:0,O:0,draw:0}
let whosTurn = undefined
let isDraw = false
let winner = false

// change turn or display the buttons to determine who goes first
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
    const winningCombosIndex = [[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]]
    // if the index array has one of the winning combinations, determine if there is a winner
    winningCombosIndex.some(combo => {
        let intersecton = combo.filter(x => boardVals.includes(x))
        if(intersecton.length === 3){
            winner = true
        }
    })
    if (winner) {
        addMessage(`${whosTurn} is the winner!`)
        if (whosTurn == "X"){
            scoreCard.X +=1
        } else {
            scoreCard.O +=1
        }
    } else if (boardVals.length == 5 && !winner){//determine if it is a draw
        isDraw = true
        scoreCard.draw +=1
        addMessage("we have a draw")
    }
}

function randomComment(type) {
    const gameCommentary = ["So close","Late drama","This is why we love this game","Make them pay","All in a day's work","Keep going","Absolutely omnipotent","No stopping now","Hanging on by a thread","Onto something here","A game-changing move","The momentum has shifted","Absolutely fantastic","We are off and running","A wonderful move","A crazy moment","I didn't see that coming","Cunning move!","This is an epic battle","That was unfortunate","Brilliant","Pure tactical brilliance","A counterattack","Put on the defensive","It all comes down to this","Here’s the chance!","The fox is in the box","Superbly done!","Great opportunity","Well Done","An audacious attempt.","What a build-up","Could this be it?","What anticipation!","Hot Diggity!","There it is","Oh!","Here it comes","Is this the knockout blow?","A back-and-forth affair","I am not sure about that one.","A superior play!","A bit of menace to that play.","Let’s get it going!","Could this be it?","Ay yi yi!","Abracadabra!","Oooof","Smokin!","Uff Da.","Truly opportunistic"]
    const matchCommentary = {notClose: ["This is a day losing would love to forget.","losing knew about winning but couldn’t stop them","winning is playing with confidence and swagger.","winning is putting on a clinic","losing has been outclassed in all phases of the game","What can losing do from this position","winning has been much the better side!","winning’s definitely superb.","This match is being controlled by winning","losing DO BETTER!","winning is sending a message to losing today","losing’s not waving the white flag just yet, but they are unfurling it.","winning is humiliating losing","Looks like losing forgot to show up today","winning’s every move is a winner","losing can’t catch a break today"], close: ["Definitely a “game-of-the-year” candidate","Neither team can seize control of this matchup","Neither competitor has claimed a clear advantage","Plenty of energy in this matchup.","Who will seize the momentum?","This is one of the best matches I have ever seen.","Neither player has a clear advantage.","The victor is still in question.","You are really seeing the most extraordinary matchup.","This is a close one","This is a tightly contested battle","This is an evenly matched competition","This could go either way"]}
    let comment = ''
    let winning = ''
    let losing = ''
    if (type == 'game') {
        comment = gameCommentary[Math.floor(Math.random() * gameCommentary.length)];
    } else if (type == 'match') {
        if ((scoreCard.X - scoreCard.O) > (scoreCard.O - scoreCard.X)) { // determine who is winning
            winning = 'X'
            losing = 'O'
        } else {
            winning = 'O'
            losing = 'X'
        }
        if (Math.abs(scoreCard.X - scoreCard.O)<=1 ) { // determine if it is close or not
            comment = matchCommentary.close[Math.floor(Math.random() * matchCommentary.close.length)];
        } else {
            comment = matchCommentary.notClose[Math.floor(Math.random() * matchCommentary.notClose.length)];
            comment = comment.replace('winning',winning)
            comment = comment.replace('losing',losing)
        }
    }
    return comment;
}

function addMessage(message) {
    const template = document.querySelector('#message-template');
    const messageUL = document.querySelector('#message-ul');
    let messageBlock = document.importNode(template.content, true);
    //end game messaging if someone has won or it we have a draw
    // else add new message to the message window
    if (winner || isDraw){  // hasWon calls this to end the game
        while (messageUL.childElementCount > 0) {
            document.querySelector('#message-ul').lastElementChild.remove()
        }
        if (isDraw) {
            messageBlock.querySelector('h1').textContent = " You have battled to a draw"
        } else {
            messageBlock.querySelector('h1').textContent = " "+whosTurn+ " is the winner!"
        }
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
function updateStatistics() {
    const statsTemplate = document.querySelector('#stat-template');
    const statsUL = document.querySelector('#stat-ul');
    let statsBlock = document.importNode(statsTemplate.content, true);
    statsBlock.querySelector('h2').textContent = "ScoreCard"
    statsBlock.querySelector('#stat1').textContent = `X wins: ${scoreCard.X}`
    statsBlock.querySelector('#stat2').textContent = `O wins: ${scoreCard.O}`
    statsBlock.querySelector('#stat3').textContent = `Draws : ${scoreCard.draw}`
    statsBlock.querySelector('em').textContent = randomComment('match')
    while (statsUL.childElementCount > 0) {
        document.querySelector('#stat-ul').lastElementChild.remove()
    }
    statsUL.appendChild(statsBlock)
}

const buttonsAll = document.querySelector('.buttonContainer')
buttonsAll.addEventListener('click', (e) => {
    if (whosTurn == undefined && e.target.id == 'pick') {  // determine who goes first
        whosTurn = e.target.textContent[0]
        whosTurnButton.style.display = "block";
        pickButtons.forEach(button => { //hide the "X/O goes first" buttons
            button.style.display = "none";
        })
        whosTurnButton.textContent = `${whosTurn}'s Turn`  // update the "Who's turn" button
    } else if (e.target.id == 'newGameButton') { // start a new game button is the last option
        updateStatistics()
        winner = false
        whosTurn = undefined
        isDraw = false
        valArr.forEach(char => {
            char.textContent = ""
        })
        while (document.querySelector('#message-ul').childElementCount > 0) {
            document.querySelector('#message-ul').lastElementChild.remove()
        }
        addMessage("Starting new game.")
        addMessage("Please select the starting player")
        changeTurn()
        newGameButton.style.display = "none";
    }
})

const squaresContainer = document.querySelector('.container')
squaresContainer.addEventListener('click', (e) => {
    if (!winner && whosTurn != undefined){ // if we do not have a winner and we know whose turn it is
        if (e.target.classList.contains('gameSquare') && e.target.textContent === "") {
            e.target.textContent = whosTurn
            let icon = document.createElement('span')
            if (whosTurn == 'O') {
                icon.className = "fa fa-circle-o"
                icon.id = "o"
            } else {
                icon.className = "fa fa-times"
                icon.id = "x"
            }
            e.target.appendChild(icon)
            addMessage(randomComment('game'))
            let boardVals = getBoardValues(whosTurn)
            hasWon(boardVals)
           
            // if (winner) {
            //     addMessage(`${whosTurn} is the winner!`)
            //     if (whosTurn == "X"){
            //         scoreCard.X +=1
            //     } else {
            //         scoreCard.O +=1
            //     }
            //     // console.log(matchCommentary())
            // } else if (boardVals.length == 5 && !winner){
            //     isDraw = true
            //     scoreCard.draw +=1
            //     addMessage("we have a draw")
            //     // console.log(matchCommentary())
            // } else {

                if (!winner){
                    changeTurn()
                }
            // }
        }
    }
})

addMessage("Please select starting player")
whosTurnButton.addEventListener('click', changeTurn())
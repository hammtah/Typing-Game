import Game from './game.js';

const timeleftDom=document.querySelector("[data-timeLeft]");
const scoreDom=document.querySelector("[data-score]");
const inpt=document.getElementById("text-inpt");

const newGame=new Game();
// get the words from the wiki (to add: add other sources of words)
let words = await newGame.getWords("wiki");
// iniate the game with the given words
newGame.init(words);
// focus the input when the document is ready (i did it because the input dosen't get focuesed when i did it in the init() function)
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("text-inpt").focus();
})

// update the timer every second
setInterval(handleTimer, 1000);

// pause the game if input is blur(not focused)
document.getElementById("text-inpt").addEventListener("blur",()=>{
    newGame.isPaused = true;
})

// input handling
inpt.addEventListener("input", handleInput);
inpt.addEventListener("keyup", handleKeyUp)

// control btns
document.querySelector("#retry").addEventListener("click", retry);
document.querySelector("#next").addEventListener("click", next)

// handleClicks(for now it is used to handle time options)
document.addEventListener("click", handleClicks)

// tooltip
// hide the tooltip when start typing
document.getElementById("text-inpt").addEventListener("input", hideTooltip);
//show the tooltip when the input is not focused
document.getElementById("text-inpt").addEventListener("blur", showTooltip);



// functions definitions


function handleTimer(){
    const {isGameStarted, isPaused, gameEnded, timeEnd}=newGame;
    // i did not do let {timer} = newGame because i have to change the value of the timer that is inside the newGame object, so i have to access it and modify it like this: newGame.timer, so now the real timer will be changed everysecond;
    // if the game is paused, the timer will not change
    //if the game is ended then do not procede to function
    //check if the game has started, if it is, then update the timer, otherwise don't update it
    if( !isPaused && !gameEnded && isGameStarted){
                // check if the timer has riched 0second, if not then update the timer (decrement it) and show it with the progress bar
                if(newGame.timer > 0){
                    newGame.timer --;
                    timeleftDom.dataset.timeleft = newGame.timer + " s";
                    //timebar  progress
                    let progressBarWidthPassed = Math.floor( (timeEnd - newGame.timer) * 100 / timeEnd );//the width representing the time passed 
                    let barDomWidth = 100 - progressBarWidthPassed;//the new width of the progress bar ( 100% - progressBarWidthPassed)
                    document.querySelector(".time-bar").style.width = `${barDomWidth}%`;

                }
                // if the timer has riched the 0second then end the game
                else newGame.endGame();
    }
}


// start the timer on input, check if the word being intered is correct (at the same time before pressing space) 
function handleInput(){
    newGame.isGameStarted = true;
    if( newGame.isPaused )  newGame.isPaused = false;//if the game was paused and then you focused the input to start typing, then the game is no longer paused 
    // if the word you entered is correct then a certain style will be applied (the borderBottom will be white), if it's not the borderBottom color will be in red
    // if(words[newGame.wordIndex].startsWith(inpt.value.trim())) inpt.classList.add("correct-word-input-styling");
    // else inpt.classList.add("wrong-word-input-styling");
    if( !words[newGame.wordIndex].startsWith(inpt.value.trim()) ) inpt.classList.add("wrong-word-input-styling");
    else inpt.classList.remove("wrong-word-input-styling");
}

function handleKeyUp(e){
    // the delimiter between words in this game is the spacebar, so whenever spacebar is typed the score will be computed and shown and the input will be cleared and style will be applied depending if the word is correct or wrong
    if( e.key == " " && inpt.value.trim().length > 0 ) {
        e.preventDefault();
        // compare the word entered with the original one
        let result = newGame.compareWords( inpt.value.trim(), words[newGame.wordIndex] );
        // clear the input field
        inpt.value="";
        // change the style depending on result (correct, or wrong)
        newGame.handleView( result, words.length );
        //increment and show the score if the word is correct     
        result === true ?  newGame.score++ : newGame.errors++ ;
        newGame.updateAccuracy();
        const timePassedInSeconds = newGame.timeEnd - newGame.timer;
        // to calculate the wpm we should : score * 60seconds / timePassedInSeconds
        scoreDom.dataset.score=Math.floor( (newGame.score * 60) / timePassedInSeconds ) +" WPM";
        // move to the next word and check if it reached the max length
        if(++newGame.wordIndex>=words.length)  newGame.endGame();
    } 

}

// retry the game
function retry(){
    newGame.init(words);
}

async function next(){
    // show the loading animation when the game start
    document.querySelector(".content").innerHTML = `
        <svg viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
        </svg>`;
    // get The words
    words = await newGame.getWords("wiki");
    // iniate the game
    newGame.init(words);
}

// when clicking on a time option, it will be the selected one (by adding the "selected-time" class to it, and removing this class from the other time options) and also the game will be initiated
function handleTimeOption(e){
    // remove class from all time options
    document.querySelectorAll(".selected-time").forEach((elm)=>{
        elm.classList.remove("selected-time");
    })
    // add the selected-time class to the selected one
    e.target.classList.add("selected-time");
    // initiate the game
    newGame.init(words)
}
function handleClicks(e){
    // if the clicked element is time options then call the handleTimeOption() function
    if(e.target.dataset.time){
        handleTimeOption(e);
    }
}


// hide the tooltip (the tooltip is the one saying: Start Typing, she is related to the input field)
function hideTooltip(){
    document.querySelector(".tooltip").classList.add("hidden");
}
// show tooltip if the game is not ended (when the game ends there is no need to say to the user: Start typing)
function showTooltip(){
    if( !newGame.gameEnded ) document.querySelector(".tooltip").classList.remove("hidden");
}
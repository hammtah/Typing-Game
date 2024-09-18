import Game from './game.js';

const timeleftDom=document.querySelector("[data-timeLeft]");
const scoreDom=document.querySelector("[data-score]");
const inpt=document.getElementById("text-inpt");

const newGame=new Game();

let words = await newGame.getWords("wiki");
newGame.init(words);
// focus the input when the document is ready
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("text-inpt").focus();
})


const handleTimer=()=>{
    const {gameEnded,startTime,timeEnd}=newGame;
    // i did not do let {timer} = newGame because i have to change the value of the timer that is inside the newGame object, so i have to access it and modify it like this: newGame.timer, so now the real timer will be changed everysecond;
    // if the game is paused, the timer will not change
    if( !newGame.isPaused ){
        if(!gameEnded){
            if(startTime!==null){
                // check if the timer has riched 0second, if not then update the timer (decrement it) and show it with the progress bar
                if(newGame.timer > 0){
                    newGame.timer --;
                    timeleftDom.dataset.timeleft=newGame.timer + " s";
                    //timebar  progress
                    let progressBarWidthPassed = Math.floor( (timeEnd - newGame.timer) * 100 / timeEnd );//the width representing the time passed 
                    let barDomWidth = 100 - progressBarWidthPassed;//the new width of the progress bar ( 100% - progressBarWidthPassed)
                    document.querySelector(".time-bar").style.width = `${barDomWidth}%`;

                }
                // if the timer has riched the 0second then end the game
                else newGame.endGame();
    
            }
        }
    }

}
// check if the game is paused , if it's paused then do not update the timer
    setInterval(handleTimer, 1000);
// pause the game if input is blur(not focused)
document.getElementById("text-inpt").addEventListener("blur",()=>{
    // newGame.startTime = new Date();
    newGame.isPaused = true;
    console.log(newGame.isPaused)
})
// run the game if input is focused
// document.getElementById("text-inpt").addEventListener("input",()=>{
//     newGame.isPaused = false;
//     console.log(newGame.isPaused)
// })

// start the timer on input, check if the word being intered is correct (at the same time before pressing space) 
const handleInput=()=>{
    if(newGame.startTime==null) newGame.startTime=new Date();
    if( newGame.isPaused ){
        newGame.isPaused = false;
        // newGame.startTime = new Date();
    }
    if(words[newGame.wordIndex].startsWith(inpt.value.trim())) inpt.style.borderBottomColor="white";
    else inpt.style.borderBottomColor="var(--wrong-key-clr)";
}
inpt.oninput= handleInput;

const handleKeyUp=(e)=>{
    if(e.key==" " && inpt.value.trim().length>0) {
        e.preventDefault();
        let result=newGame.compareWords(inpt.value.trim(),words[newGame.wordIndex]);
        inpt.value="";
        newGame.handleView(result,words.length);
        //increment and show the score if the word is correct     
        result===true ?  newGame.score++ : newGame.errors++ ;
        newGame.updateAccuracy();
        //show the score(wpm) after 4 words entring (so that it will be a logical value)
        if(newGame.wordIndex>3) scoreDom.dataset.score=Math.floor( (newGame.score * 60000) / ((new Date())-(newGame.startTime)) ) +" WPM";
        // move to the next word and check if it reached the max length
        if(++newGame.wordIndex>=words.length)  newGame.endGame();
    } 

}
inpt.addEventListener("keyup",handleKeyUp)


const retry=()=>{
    newGame.init(words);
}
document.querySelector("#retry").addEventListener("click",retry);

const next= async ()=>{
    // words=newGame.getWords();
    // show the loading animation when the game start
    document.querySelector(".content").innerHTML = `
        <svg viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
        </svg>`;
    // get The words
    words = await newGame.getWords("wiki");
    newGame.init(words);
}
document.querySelector("#next").addEventListener("click",next)

const handleTimeOption=(e)=>{
    document.querySelectorAll(".selected-time").forEach((elm)=>{
        elm.classList.remove("selected-time");
    })
    e.target.classList.add("selected-time");
    newGame.init(words)
}
const handleClicks=(e)=>{
    if(e.target.dataset.time){
        handleTimeOption(e);
    }
}
document.addEventListener("click",handleClicks)

// game pause 

    // hide the tooltip when start typing
    document.getElementById("text-inpt").addEventListener("input",()=>{
        document.querySelector(".tooltip").classList.add("hidden");
    })
    //show the tooltip when the input is not focused
    document.getElementById("text-inpt").addEventListener("blur",()=>{
        if( !newGame.gameEnded ) document.querySelector(".tooltip").classList.remove("hidden");
        // here i should add a function to pause the game when the input is blur
    })

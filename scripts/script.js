import Game from './game.js';

const timeleftDom=document.querySelector("[data-timeLeft]");
const scoreDom=document.querySelector("[data-score]");
const inpt=document.getElementById("text-inpt");

const newGame=new Game();

let words = await newGame.getWords("wiki");
newGame.init(words);


const handleTimer=()=>{
    const {gameEnded,startTime,timeEnd}=newGame;
    if(!gameEnded){
        if(startTime!==null){
            //show time left in seconds
            const timePassed=Math.floor((new Date()-startTime)/1000);
            if(timeEnd>=timePassed) {
                timeleftDom.dataset.timeleft=timeEnd-timePassed+" s";
                
                //timebar  progress
                let progressBarWidthPassed = Math.floor( timePassed * 100 / timeEnd );//the width representing the time passed 
                let barDomWidth = 100 - progressBarWidthPassed;//the new width of the progress bar ( 100% - progressBarWidthPassed)
                document.querySelector(".time-bar").style.width = `${barDomWidth}%`;
            }
            else newGame.endGame();

        }
    }
}
setInterval(handleTimer, 1000);


// start the timer on input, check if the word being intered is correct (at the same time before pressing space) 
const handleInput=()=>{
    if(newGame.startTime==null) newGame.startTime=new Date();
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
//     inputField.addEventListener('blur', function() {
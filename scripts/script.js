import  { Game,accuracyDom,timeleftDom,scoreDom,inpt,selectedTime }  from './game.js';


// let {wordIndex,score,errors,gameEnded,startTime,timeEnd}=newGame;
// creating the words array by spliting the paragraph giving by the randomParagraph() , and then making them to lowercase
// creating the words
const newGame=new Game();
// let maxWords=Math.floor(Math.random()*30 +20);
// const choices=["article","random","par"]
// let randomChoice=Math.floor(Math.random()*choices.length);
let words=newGame.getWords(1)
// let words="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem minus beatae asperiores quia excepturi necessitatibus fugiat suscipit qui in odio eveniet ullam aperiam, nihil ex obcaecati at eum harum non?".toLowerCase().split(" ");
// let words=newGame.getWords("",40)
newGame.init(words);


const handleTimer=()=>{
    const {gameEnded,startTime,timeEnd}=newGame;
    if(!gameEnded){
        if(startTime!==null){
            //show time left in seconds
            const timePassed=Math.floor((new Date()-startTime)/1000);
            if(timeEnd>=timePassed) timeleftDom.dataset.timeleft=timeEnd-timePassed+" s";
            else newGame.endGame();
        }
    }
}
setInterval(handleTimer, 1000);


// start the timer on input, check if the word being intered is correct (at the same time before pressing space) 
const handleInput=()=>{
    if(newGame.startTime==null) newGame.startTime=new Date();
    if(words[newGame.wordIndex].startsWith(inpt.value.trim())) inpt.style.background="white";
    else inpt.style.background="var(--wrong-key-clr)";
}
inpt.oninput= handleInput;

const handleKeyUp=(e)=>{
    if(e.key==" " && inpt.value.trim().length>0) {
        e.preventDefault();
        //compare the words
        let result=newGame.compareWords(inpt.value.trim(),words[newGame.wordIndex]);
        inpt.value="";
        newGame.handleView(result,words.length);
        //increment and show the score if the word is correct     
        result===true ?  newGame.score++ : newGame.errors++ ;
        //the accuracy is the score /number of words intered
        newGame.accuracy=Math.floor(newGame.score / (newGame.wordIndex+1) *100);
        accuracyDom.dataset.accuracy=newGame.accuracy+" %";
        //show the score(wpm) after 4 words entring (so that it will be a logical value)
        if(newGame.wordIndex>3) {
            scoreDom.dataset.score=Math.floor( (newGame.score * 60000) / ((new Date())-(newGame.startTime)) ) +" WPM";
        }
        //move to the next word  
        newGame.wordIndex++;
        // check if it reached the max length
        if(newGame.wordIndex>=words.length)  newGame.endGame();
    } 

}
inpt.addEventListener("keyup",handleKeyUp)


const retry=()=>{
    newGame.init(words);
}
document.querySelector("#retry").addEventListener("click",retry);

const next=()=>{
    words=newGame.getWords();
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


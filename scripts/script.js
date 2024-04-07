import  { Game,accuracyDom,timeleftDom,scoreDom,inpt,selectedTime }  from './game.js';


// let {wordIndex,score,errors,gameEnded,startTime,timeEnd}=newGame;
// creating the words array by spliting the paragraph giving by the randomParagraph() , and then making them to lowercase
// creating the words
const newGame=new Game();
// let maxWords=Math.floor(Math.random()*30 +20);
// const choices=["article","random","par"]
// let randomChoice=Math.floor(Math.random()*choices.length);
// let words=newGame.getWords(choices[randomChoice],maxWords)
let words="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem minus beatae asperiores quia excepturi necessitatibus fugiat suscipit qui in odio eveniet ullam aperiam, nihil ex obcaecati at eum harum non?".toLowerCase().split(" ");
console.log(words)
// let words=newGame.getWords("",40)
newGame.init(words);

setInterval(() => {
    if(!newGame.gameEnded){
        //show time left in seconds
        if(newGame.startTime!==null){
            let timePassed=Math.floor((new Date()-newGame.startTime)/1000);
            if(newGame.timeEnd>=timePassed) timeleftDom.dataset.timeleft=newGame.timeEnd-timePassed+" s";
            else newGame.endGame(newGame.score);
        } 
    }

}, 1000);

//starting the chrno when the user type something
inpt.oninput= ()=>{
    if(newGame.startTime==null) newGame.startTime=new Date();
    if(words[newGame.wordIndex].startsWith(inpt.value.trim())) inpt.style.background="white";
    else inpt.style.background="var(--wrong-key-clr)";
}

inpt.addEventListener("keyup",(e)=>{
        if(e.key==" " && inpt.value.trim().length>0) {
            e.preventDefault();
            //compare the words
            let res=newGame.compareWords(inpt.value.trim(),words[newGame.wordIndex]);
            //clear input
            inpt.value="";
            //show result 
            newGame.showResult(res,words.length);
            //increment and show the score if the word is correct     
            res===true ?  newGame.score++ : newGame.errors++ ;
            //the accuracy is the score /number of words intered
            newGame.accuracy=Math.floor(newGame.score / (newGame.wordIndex+1) *100);
            accuracyDom.dataset.accuracy=newGame.accuracy+" %";
            //show the score(wpm) after 4 words entring (so that it will be a logical value)
            if(newGame.wordIndex>3) {
                scoreDom.dataset.score=Math.floor( (newGame.score * 60000) / ((new Date())-(newGame.startTime)) ) +" WPM";
            }
            //move to the next word and check if it reached the max length
            newGame.wordIndex++;
            if(newGame.wordIndex>=words.length)  newGame.endGame(newGame.score);
        } 
    
})


document.querySelector("#retry").addEventListener("click",()=>{
    // retry
    newGame.init(words);

})
document.querySelector("#next").addEventListener("click",()=>{
    words=newGame.getWords("",40);
    newGame.init(words);
})

document.addEventListener("click",(e)=>{
    if(e.target.dataset.time){
        document.querySelectorAll(".selected-time").forEach((elm)=>{
            elm.classList.remove("selected-time");
        })
        e.target.classList.add("selected-time");
        newGame.init(words)
    }
})


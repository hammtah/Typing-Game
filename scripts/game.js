// import randomParagraph from 'https://cdn.skypack.dev/random-paragraph';
// import { article ,paragraph } from 'https://unpkg.com/txtgen/dist/txtgen.esm.js'

const accuracyDom=document.querySelector("[data-accuracy]");
const timeleftDom=document.querySelector("[data-timeLeft]");
const scoreDom=document.querySelector("[data-score]");
const inpt=document.getElementById("text-inpt");
const selectedTime=document.querySelector(".selected-time");

class Game{
    constructor(){
        this.wordIndex=0;
        this.score=0;
        this.errors=0;
        this.accuracy=0;
        this.gameEnded=false;
        this.startTime=null;
        this.timeEnd=selectedTime.dataset.time;
    }
    init(words){
        // break it
        this.wordIndex=0;
        this.score=0;
        this.errors=0;
        this.accuracy=0;
        this.gameEnded=false;
        this.startTime=null;
        this.timeEnd=document.querySelector(".selected-time").dataset.time;
        inpt.focus();
        inpt.value="";
        accuracyDom.dataset.accuracy='0 %'
        scoreDom.dataset.score=this.score+" WPM"
        document.querySelector("[data-timeLeft]").dataset.timeleft=this.timeEnd+" s"
        inpt.disabled=false;
        // rendering the words in span format
        const wordsSpans=words.map( (word,index)=> {
            return `<span class="word ${index===0? 'current-word':''}" id="word-${index}">${word}</span>`;
        }).join(' ');
        
        document.getElementById("content").innerHTML=wordsSpans;
    }
    getWords(textType,maxWords){
        let wordsTemp="";
        switch (textType) {
            case "article":
                wordsTemp=article(1);
                break;
            case "random":
                wordsTemp=randomParagraph({sentences:3});
                break;
            default:
                wordsTemp=paragraph(3);
                break;
        }
        return wordsTemp.split(" ").slice(0,maxWords).map((word)=>{
            return word.toLowerCase();
        });
    }
    compareWords(word1,word2){
        return word1.toLowerCase()==word2.toLowerCase();
    }
    showResult(res,wordsLength){
        //adding the style for the correct or wrong word and adding the current-word style(class ) to the current word
        document.getElementById(`word-${this.wordIndex}`).classList.add(`${res? "correct-word":"wrong-word"}`);
        document.querySelector(".current-word").classList.remove("current-word");
        if (this.wordIndex+1<wordsLength) document.getElementById(`word-${this.wordIndex+1}`).classList.add("current-word");
    }
    endGame(score){
        inpt.disabled=true;
        inpt.value="GAME OVER";
        this.gameEnded=true;
    
    }

}



export {Game,accuracyDom,timeleftDom,scoreDom,inpt,selectedTime};
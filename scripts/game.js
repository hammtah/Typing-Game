import randomParagraph from 'https://cdn.skypack.dev/random-paragraph';
import { article ,paragraph } from 'https://unpkg.com/txtgen/dist/txtgen.esm.js'

const accuracyDom=document.querySelector("[data-accuracy]");
const timeleftDom=document.querySelector("[data-timeLeft]");
const scoreDom=document.querySelector("[data-score]");
const inpt=document.getElementById("text-inpt");
const selectedTime=document.querySelector(".selected-time");
const content=document.querySelector(".content");


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
        inpt.value="";
        inpt.focus();
        accuracyDom.dataset.accuracy='0 %'
        scoreDom.dataset.score=this.score+" WPM"
        document.querySelector("[data-timeLeft]").dataset.timeleft=this.timeEnd+" s"
        inpt.disabled=false;
        content.scrollBy(0,-1)
        // rendering the words in span format
        const wordsSpans=words.map( (word,index)=> {
            return `<span class="word ${index===0? 'current-word':''}" id="word-${index}">${word}</span>`;
        }).join(' ');
        
        document.getElementById("content").innerHTML=wordsSpans;
    }
    getWords(textType="par",sentences){
        let wordsTemp="";
        switch (textType) {
            case "article":
                wordsTemp=article(sentences);
                break;
            case "random":
                wordsTemp=randomParagraph({sentences:sentences});
                break;
            default:
                wordsTemp=paragraph(sentences);
                break;
        }
        return wordsTemp.split(" ").map((word)=>{
            return word.toLowerCase();
        });
    }
    compareWords(word1,word2){
        return word1.toLowerCase()==word2.toLowerCase();
    }
    handleView(res,wordsLength){
        //adding the style for the correct or wrong word and adding the current-word style(class ) to the current word
        document.getElementById(`word-${this.wordIndex}`).classList.add(`${res? "correct-word":"wrong-word"}`);
        if(document.querySelector(".current-word")) document.querySelector(".current-word").classList.remove("current-word");
        if (this.wordIndex+1<wordsLength) document.getElementById(`word-${this.wordIndex+1}`).classList.add("current-word");
        // scroll down  when the current-word is close the end of the content section
        const lastLine=content.offsetTop+content.clientHeight+content.scrollTop
        let currentPosition=0;
        if(document.querySelector(".current-word")) currentPosition=document.querySelector(".current-word").offsetTop;
        if(lastLine-currentPosition<60) {
            content.scrollBy(0,90)
        }
    }
    endGame(){
        inpt.disabled=true;
        this.gameEnded=true;
        let msg="";
        let emoji="";
        if(document.querySelector("[data-timeLeft]").dataset.timeleft.startsWith(0)){
            msg="Time Over"
            emoji=`<img src="imgs/hourglass-low.svg" alt="time-over">`
        }
        else{
            msg="Congratulations"
            emoji=`<img src="imgs/confetti.svg" alt="confetti">`
        }
        document.querySelector(".inpt-sec").innerHTML=`<span>${msg}</span>${emoji}`;
    }

    updateAccuracy(){
        //the accuracy is the score /number of words intered
        this.accuracy=Math.floor(this.score / (this.wordIndex+1) *100);
        accuracyDom.dataset.accuracy=this.accuracy+" %";
}

}



export {Game,accuracyDom,timeleftDom,scoreDom,inpt,selectedTime};
import randomParagraph from 'https://cdn.skypack.dev/random-paragraph';
import { article ,paragraph } from 'https://unpkg.com/txtgen/dist/txtgen.esm.js'
//faker (under test)
// import { faker } from 'https://esm.sh/@faker-js/faker';
// const randomText = faker.lorem.paragraphs();
// console.log(randomText);
// wikipedia API



const accuracyDom=document.querySelector("[data-accuracy]");
const scoreDom=document.querySelector("[data-score]");
const inpt=document.getElementById("text-inpt");
const selectedTime=document.querySelector(".selected-time");
const content=document.querySelector(".content");

export default class Game{
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

        // when refreshing or moving to the next text, the congratulation message must be removed and the input must be shown
        if( document.querySelector("#congrats") != null )  document.querySelector("#congrats").remove();
        document.getElementById("text-inpt").style.display = "block";
        //
        inpt.value="";
        document.getElementById("text-inpt").focus();
        inpt.disabled=false;
        inpt.style.background="white";
        document.addEventListener("DOMContentLoaded", () => {
            document.getElementById("text-inpt").focus();
        })
        accuracyDom.dataset.accuracy='0 %'
        scoreDom.dataset.score=this.score+" WPM"
        document.querySelector("[data-timeLeft]").dataset.timeleft=this.timeEnd+" s"
        content.scrollTop = 0;
        // rendering the words in span format
        const wordsSpans=words.map( (word,index)=> {
            return `<span class="word ${index===0? 'current-word':''}" id="word-${index}">${word}</span>`;
        }).join(' ');
        
        document.getElementById("content").innerHTML=wordsSpans;
    }
    async getWords(textType, sentences = 1){
        let wordsTemp="";
        switch (textType) {
            case "article":
                wordsTemp=article(sentences);
                break;
            case "random":
                wordsTemp=randomParagraph({sentences:sentences});
                break;
            case "wiki":
                wordsTemp = await this.getWikiSummary();
                break;
            default:
                wordsTemp=paragraph(sentences);
                break;
        }
        // return wordsTemp.split(" ").map((word)=>{
        //     return word.toLowerCase();
        // });
        return wordsTemp.split(" ");
    }
    async getWikiSummary() {
        const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary');
        return response.data.extract;
    }
    compareWords(word1,word2){
        // you can adjust it depending on difficulty (easy = compare words after transforming them to lowercase)
        return word1 === word2;

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
            content.scrollBy({
                top: 90,
                behavior: "smooth",
            });
        }
    }
    endGame(){
        inpt.disabled=true;
        this.gameEnded=true;
        let msg="";
        let emoji="";
        if(document.querySelector("[data-timeLeft]").dataset.timeleft.startsWith(0)){
            msg="Time Over"
            emoji="⌛️"
        }
        else{
            msg="Congratulations"
            emoji="🎉"
        }
        //hide the input field
        inpt.style.display = "none";
        //show the congratulation msg
        const congratsElement = document.createElement("span");
        congratsElement.id = "congrats";
        congratsElement.textContent = msg + emoji;
        document.querySelector(".inpt-sec").append(congratsElement);
    }

    updateAccuracy(){
        //the accuracy is the score /number of words intered
        this.accuracy=Math.floor(this.score / (this.wordIndex+1) *100);
        accuracyDom.dataset.accuracy=this.accuracy+" %";
}

}




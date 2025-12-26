const TOTAL_LEVELS=100;
const icons=["🍎","🍌","🍒","🍇","🍉","🥝","🍓","🍍","🍋","🥥"];
const settings={beginner:{basePairs:3,time:60},expert:{basePairs:4,time:40}};

let mode=localStorage.getItem("mode")||"";
let level=Number(localStorage.getItem("level"))||1;
let unlocked=Number(localStorage.getItem(mode+"_unlocked"))||1;
let score=Number(localStorage.getItem(mode+"_score"))||0;
let highScore=Number(localStorage.getItem(mode+"_highScore"))||0;

let timer,timeLeft,moves,first,lock,paused,matched;

function hideAll(){
["homeScreen","mapScreen","gameUI","winScreen","loseScreen"]
.forEach(id=>document.getElementById(id).style.display="none");
}

function goHome(){
clearInterval(timer);
hideAll();
homeScreen.style.display="flex";
updateProgress();
}

function setMode(m){
mode=m;
document.body.className=m==="expert"?"expert":"";
localStorage.setItem("mode",mode);
unlocked=Number(localStorage.getItem(mode+"_unlocked"))||1;
score=Number(localStorage.getItem(mode+"_score"))||0;
highScore=Number(localStorage.getItem(mode+"_highScore"))||0;
navMode.innerText=mode;
navHighScore.innerText=highScore;
updateProgress();
showMap();
}

function updateProgress(){
const percent=Math.floor((unlocked/TOTAL_LEVELS)*100);
progressFill.style.width=percent+"%";
progressPercent.innerText=percent+"%";
}

function showMap(){
hideAll();
mapScreen.style.display="flex";
buildMap();
}

function buildMap(){
levelMap.innerHTML="";
for(let i=1;i<=TOTAL_LEVELS;i++){
let n=document.createElement("div");
n.className="level";
n.innerText=i;
if(i>unlocked)n.classList.add("locked");
else if(i<level)n.classList.add("completed");
else if(i===level)n.classList.add("active");
if(i<=unlocked)n.onclick=()=>{level=i;startGame();};
levelMap.appendChild(n);
}
}

function startGame(){
hideAll();
gameUI.style.display="block";
navLevel.innerText=level;
localStorage.setItem("level",level);
moves=0;matched=0;paused=false;lock=false;first=null;
timeLeft=settings[mode].time;
movesText.innerText=moves;
timeText.innerText=timeLeft;
scoreText.innerText=score;
clearInterval(timer);
timer=setInterval(()=>{
if(!paused){
timeLeft--;timeText.innerText=timeLeft;
if(timeLeft<=0)lose();
}},1000);
createGrid();
}

function createGrid(){
gameGrid.innerHTML="";
let pairs=settings[mode].basePairs+Math.floor((level-1)/5);
let cards=[...icons.slice(0,pairs),...icons.slice(0,pairs)].sort(()=>0.5-Math.random());
gameGrid.style.gridTemplateColumns=`repeat(${Math.ceil(Math.sqrt(cards.length))},100px)`;
cards.forEach(icon=>{
let c=document.createElement("div");
c.className="card";
c.dataset.icon=icon;
c.innerHTML=`<div class="card-face card-front">?</div><div class="card-face card-back">${icon}</div>`;
c.onclick=()=>flip(c);
gameGrid.appendChild(c);
});
}

function flip(card){
if(paused||lock||card.classList.contains("open"))return;
card.classList.add("open");
if(!first){first=card;return;}
moves++;movesText.innerText=moves;
if(first.dataset.icon===card.dataset.icon){
score+=10;
scoreText.innerText=score;
first=null;
matched++;
if(matched===document.querySelectorAll(".card").length/2)win();
}else{
lock=true;
setTimeout(()=>{
card.classList.remove("open");
first.classList.remove("open");
first=null;lock=false;
},850);
}
}

function pauseGame(){paused=!paused;}
function restartLevel(){startGame();}

function win(){
clearInterval(timer);
score+=50;
localStorage.setItem(mode+"_score",score);
if(level===unlocked&&unlocked<TOTAL_LEVELS){
unlocked++;
localStorage.setItem(mode+"_unlocked",unlocked);
}
if(score>highScore){
highScore=score;
localStorage.setItem(mode+"_highScore",highScore);
navHighScore.innerText=highScore;
}
updateProgress();
hideAll();
winScreen.style.display="flex";
}

function nextLevel(){
level++;
if(level>TOTAL_LEVELS)level=TOTAL_LEVELS;
showMap();
}

function lose(){
clearInterval(timer);
score=0;
loc
}
const width=window.innerWidth;
const height=window.innerHeight;
var lives=10;
var currentWord="";
var guessed="";
var words=[];
var falseGuessDisplay=document.getElementById("falseLetter");
var indexDisplay=document.getElementById("id");
var input=document.getElementsByName("guess")[0];
const alphabet="abcdefghijklmnopqrstuvwxyz".split("");
var falseLetters=[];
var trueLetters=[];
var guessType="letter";
var hangman=[...document.getElementsByClassName("hangman")];
let request = new XMLHttpRequest();
var display=document.getElementById("current-guess");
request.open('GET', 'misc/words_alpha.txt');
request.onreadystatechange = function() {
    if (request.readyState === 4) {
        let words_unseperated = request.responseText;
        words=words_unseperated.split("\n");
		newWord();
    }
}
request.send();

function newWord(id=-1){
	document.getElementById("guess").hidden=true;
	lives=10;
	falseLetters=[];
	trueLetters=[];
	falseGuessDisplay.innerText="Wrong Letters: \n";
	hangman.forEach(e => e.hidden=true);
	
	if(id<0){
		do {
			id=Math.floor(Math.random()*(words.length+1));
			currentWord=words[id];
		} while(currentWord.length<7||currentWord.length>12)
		console.log(id);
	} else {
		console.log(id);
		currentWord=words[id];
	}
	
	let array=currentWord.split("");
	array.length=currentWord.length-1;
	currentWord=array.join("");
	
	guessed=[];
	for(let i=1; i<currentWord.length; i++) guessed+="_ ";
	guessed+="_";
	
	console.log(guessed,"-",currentWord.length);
	console.log("lives: ",lives);
	console.log("true: ",trueLetters);
	console.log("false: ",falseLetters);
	
	indexDisplay.innerText="#"+id;
	display.innerText=guessed;
	display.style.top=(height/100*40-display.style.height)+"px";
	display.style.left=(width/100*25-display.style.width)+"px";
	document.getElementById("guess").hidden=false;
}

function switchType(){
	if(guessType==="letter"){
		guessType="word";
		document.getElementById("toggleBtn").innerText="Word";
	} else {
		guessType="letter";
		document.getElementById("toggleBtn").innerText="Letter";
	}
}

function guess(guess){
	let response=undefined;
	if(lives>0){
		if(guessType==="letter"){
			if(alphabet.includes(guess)){
				if(!((trueLetters+falseLetters).includes(guess))){
					if(currentWord.includes(guess)){
						let guessed_array=guessed.split(" ");
						let tempvar=0;
						for(let letter of currentWord){
							if(letter===guess){
								guessed_array[currentWord.indexOf(letter,tempvar)]=guess;
								tempvar=currentWord.indexOf(letter,tempvar)+1;
							}
						}
						guessed=guessed_array.join(" ");
						response=true;
						if(!trueLetters.includes(guess)) trueLetters.push(guess);
					} else {
						lives--;
						hangman[lives].hidden=false;
						response=false;
						if(!falseLetters.includes(guess)) falseLetters.push(guess);
						falseGuessDisplay.innerText="Wrong Letters: \n"+falseLetters.join(", ");
					}
				} else {
					response="You tried this letter before.";
				}
			} else {
				response="Invalid character.";
			}
		} else if(guessType==="word"){
			let valid=true;
			for(let i of guess) if(!alphabet.includes(i)) valid=false;
			if(valid){
				if(!((trueLetters+falseLetters).includes(guess))){
					if(currentWord===guess){
						guessed=guess.split("").join(" ");
						response=true;
					} else {
						lives=0;
						hangman.forEach(e => e.hidden=false);
						response=false;
					}
				} else {
					response="You tried this letter before.";
				}
			} else {
				response="Invalid character.";
			}
		} else {
			response="Invalid guess type.";
		}
		if(guessed===currentWord.split("").join(" ")){
			response="You WON!";
		}
		if(lives===0){
			response="You lost! The answer was "+currentWord;
		}
	} else {
		response="You are out of lives!";
	}
	
	
	display.innerText=guessed;
	console.log(guessed,"-",currentWord.length);
	console.log("lives: ",lives);
	console.log("true: ",trueLetters);
	console.log("false: ",falseLetters);
	input.value="";
	console.log(response);
}
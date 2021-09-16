const cardsSelector = document.querySelectorAll('#main-game-board span');
const cardsArray = [...cardsSelector];
const attemptsCounter = document.querySelector('#attempts-paragraph');
const loadingScreen = document.querySelector('#loading-screen');
const loadingScreenLeft = document.querySelector('#loading-screen-left');
const loadingScreenRight = document.querySelector('#loading-screen-right');
const loadingScreenLogo = document.querySelector('#loading-screen-logo')
const loadingScreenSpinner = document.querySelector('#loading-screen-spinner');
const timerSelector = document.querySelector('#timer-numbers');
const boardContainer = document.querySelector('#main-game-board');
const arrHits = [];
let count = 0;
let toogleCount = 0;
let selectedCard1 ;
let selectedCard2 ;
let imgLoaded = 0;
let secondsTimer = `00`;
let minutesTimer = `00`;
let hoursTimer = `00`
attemptsCounter.textContent = count;

const numberGenerator = function(elements){

    let array = [];

    for(let i=0 ; i<elements ; i++){
        array.push(i+1);
        array.push(i+1);

    }

    return array;
}


// Algoritmo de fisher Yates

function shuffle(array ) {
    let j , temp;
    for (let i = array.length-1; i>0 ;i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;    
};

const newArray = shuffle(numberGenerator(6));


function assignNumber (array) {

    for(let i=0; i<array.length ; i++){
        cardsArray[i].id = array[i];
    }
    
}

function assignClassNumber(array) {
    
    array.forEach((element , index ) => {
        element.classList.add(index);
    });
    
}

assignClassNumber(cardsArray);


assignNumber(newArray);


cardsArray.forEach(element =>{

    element.addEventListener('click' , checkCards);


});


function checkCards(e) {   
    

    if(toogleCount === 0){
            selectedCard1 = e.target;
            selectedCard1.classList.add('game-board__item--flip');
            toogleCount ++;
            return;
        }
        
    if(toogleCount === 1){
        
        selectedCard2 = e.target;
        selectedCard2.classList.add('game-board__item--flip');

        if(selectedCard1.classList[1] !== selectedCard2.classList[1]){

            if(selectedCard1.id === selectedCard2.id){
                selectedCard1.classList.add('disabled');
                selectedCard2.classList.add('disabled');
                boardContainer.classList.add('disabled');
                setTimeout(() => {
                    boardContainer.classList.remove('disabled');
                    if(arrHits.length === cardsArray.length){
                        alert('Congratulations you won');
                    }
                    
                }, 1000);
                arrHits.push('HOLA');
                arrHits.push('hOLA');
                
            }
            if(selectedCard1.id !== selectedCard2.id){
                
                boardContainer.classList.add('disabled')

                setTimeout(() => {
                    selectedCard1.classList.remove('game-board__item--flip');
                    selectedCard2.classList.remove('game-board__item--flip');
                    boardContainer.classList.remove('disabled');
                    
                }, 1000);

            }
            count++;
            toogleCount =0;
            attemptsCounter.textContent = count;
            return;
        }
    }
    
}


fetchCharacters();

async function fetchCharacters(){
 
   
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=500');
        
        if(response.status === 200){

            const data = await response.json();
            const arrayId = idGenerator(data.results.length , 6);

            const infoObtained = await getInfo(arrayId);
            console.log(infoObtained[0]);
            const cardsOrderArray = cardsArray.sort((a,b)=> Number(a.id) - Number(b.id) );
            
            cardsOrderArray.forEach((element , index) => {
                const cardFaceB = document.createElement('div');
                const cardFaceF = document.createElement('div');
                const paragraph = document.createElement('p');
                const image = document.createElement('img');
                image.src = infoObtained[index].sprites.other.dream_world.front_default;
                image.alt = infoObtained[index].name;
                paragraph.textContent = infoObtained[index].name;
                element.id = infoObtained[index].id;
                cardFaceF.classList.add('face' , 'face--front');
                cardFaceB.classList.add('face' , 'face--back');
                cardFaceB.appendChild(paragraph);
                cardFaceB.appendChild(image);
                element.appendChild(cardFaceF);
                element.appendChild(cardFaceB);
                
            });

            if(document.readyState === 'complete'){
                
                checkImagesLoaded();
            
                
            }
            
            
                
            

        }
        
        
        
        


        
    } catch (error) {
        console.log();
    }

    
}

function idGenerator(range, outputCount) {

    let arr = []
    for (let i = 1; i <= range; i++) {
      arr.push(i)
    }
  
    let result = [];
  
    for (let i = 1; i <= outputCount; i++) {
      const random = Math.floor(Math.random() * (range - i));
      result.push(arr[random]);
      result.push(arr[random]);
      arr[random] = arr[range - i];
    }
  

    return result;
}

async function getInfo(arrayId){
    
    const arrayInfo = [];
    
    for(const element of arrayId){
        const character = await fetch(`https://pokeapi.co/api/v2/pokemon/${element}/`);
        const characterData = await character.json();
        arrayInfo.push(characterData);
        
        
    };

    return arrayInfo;
   
}

function checkImagesLoaded(){
    const totalImages =  [...document.querySelectorAll('span img')];
    for (const element of totalImages) {
        element.addEventListener('load' , ()=>{
            imgLoaded ++;

            if(imgLoaded === totalImages.length){
             
                setTimeout(() => {
                    
                    loadingScreenLeft.classList.add('loading-screen__left--move');
                    loadingScreenRight.classList.add('loading-screen__right--move');
                    loadingScreenLogo.classList.add('loading-screen__logo--disappear');
                    loadingScreenSpinner.classList.add('loading-screen__spinner--off');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 1000);
                    setInterval(() => {
                        timer();    
                    }, 1000);
                
                }, 1000);
            }
        })
    }

}


function timer(){
    secondsTimer++;
    if(secondsTimer<10 ){
        secondsTimer = `0` + secondsTimer;
    }

    if(secondsTimer > 59) {
        secondsTimer = `00`;
        minutesTimer ++;

        if(minutesTimer<10){
            minutesTimer = `0` + minutesTimer;
        }

    }

    if(minutesTimer > 59) {
        minutesTimer = `00`;
        hoursTimer ++;

        if(hoursTimer < 10){
            hoursTimer = `0` + hoursTimer;
        }
    }

    
    timerSelector.textContent = `${hoursTimer}:${minutesTimer}:${secondsTimer}`;
    
    
}
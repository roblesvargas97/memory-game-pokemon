const cardsArray = [...document.querySelectorAll('#main-game-board span')];
const loadingScreenLeft = document.querySelector('#loading-screen-left');
const loadingScreenRight = document.querySelector('#loading-screen-right');
const loadingScreenLogo = document.querySelector('#loading-screen-logo')
const loadingScreenSpinner = document.querySelector('#loading-screen-spinner');
const attemptsCounter = document.querySelector('#attempts-paragraph');
const loadingScreen = document.querySelector('#loading-screen');
const timerSelector = document.querySelector('#timer-numbers');
const boardContainer = document.querySelector('#main-game-board');
const resultScreen = document.querySelector('#result-screen');
const congratulationsAttempts = document.querySelector('#a-attempts');
const congratulationsTime = document.querySelector('#a-time');
const congratulationsButton = document.querySelector('#button-congratulations');
const arrHits = [];
let count = 0;
let toogleCount = 0;

class Aplication{
    constructor({
        elements=0,
        cards = [],
        array = [],
        url = '',
        imgLoaded = 0,
        secondsTimer = `00`,
        minutesTimer = `00`,
        hoursTimer = `00` ,
        toogleCount = 'Hola',
        
    }){
        this.elements = elements;
        this.cards = cards;
        this.array = array;
        this.url = url;
        this.imgLoaded = imgLoaded;
        this.secondsTimer = secondsTimer;
        this.minutesTimer = minutesTimer;
        this.hoursTimer = hoursTimer;
        this.toogleCount = toogleCount;
        
    }

    numberGenerator() {

        for(let i=0 ; i<this.elements ; i++){
            this.array.push(i+1);
            this.array.push(i+1);

        }
        return this.array;
    }
 
    shuffle() {
        let j , temp;

        for (let i = this.array.length-1; i>0 ;i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this.array[i];
            this.array[i] = this.array[j];
            this.array[j] = temp;
        }
        return this.array;    
    }

    assignIdNumber() {
        for(let i=0; i<this.array.length ; i++){
            this.cards[i].id = this.array[i];
        }

    }

    assignClassNumber() {
    
        this.cards.forEach((element , index ) => {
            element.classList.add(index);
        });
        
    }

    async fetchCharacters(){
 
        try {
            const response = await fetch(this.url);
            
            if(response.status === 200){
    
                const data = await response.json();
                const arrayIdsCharacters = this.idGenerator(data.results.length , 6);
    
                const infoObtained = await this.getInfo(arrayIdsCharacters);
                const cardsOrderArray = this.cards.sort((a,b)=> Number(a.id) - Number(b.id) );
                
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
                    
                    this.checkImagesLoaded();
                
                    
                }
                
            }
        
        } catch (error) {
            console.log(error);
        }
    
        
    }

    idGenerator(range, outputCount) {

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

    async getInfo(arrayId){
    
        const arrayInfo = [];
        
        for(const element of arrayId){
            const character = await fetch(`https://pokeapi.co/api/v2/pokemon/${element}/`);
            const characterData = await character.json();
            arrayInfo.push(characterData);
            
            
        };
    
        return arrayInfo;
       
    }

    checkImagesLoaded(){
        const totalImages =  [...document.querySelectorAll('span img')];
        for (const element of totalImages) {
            element.addEventListener('load' , ()=>{
                this.imgLoaded ++;
    
                if(this.imgLoaded === totalImages.length){
                 
                    setTimeout(() => {
                        
                        loadingScreenLeft.classList.add('loading-screen__left--move');
                        loadingScreenRight.classList.add('loading-screen__right--move');
                        loadingScreenLogo.classList.add('loading-screen__logo--disappear');
                        loadingScreenSpinner.classList.add('loading-screen__spinner--off');
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                        }, 1000);
                        
                        
                        const interval = setInterval(() => {
                                this.timer();    
                                
                                if(arrHits.length === this.cards.length){
                                    clearInterval(interval);
                                }

                            }, 1000);
                        
                        
                    
                    }, 1000);
                }
            })
        }
    
    }

    timer(){
        this.secondsTimer++;
        if(this.secondsTimer<10 ){
            this.secondsTimer = `0` + this.secondsTimer;
        }
    
        if(this.secondsTimer > 59) {
            this.secondsTimer = `00`;
            this.minutesTimer ++;
    
            if(this.minutesTimer<10){
                this.minutesTimer = `0` + this.minutesTimer;
            }
    
        }
    
        if(this.minutesTimer > 59) {
            this.minutesTimer = `00`;
            this.hoursTimer ++;
    
            if(this.hoursTimer < 10){
                this.hoursTimer = `0` + this.hoursTimer;
            }
        }
        
        timerSelector.textContent = `${this.hoursTimer}:${this.minutesTimer}:${this.secondsTimer}`;
        
    }

    
    
}

const launchApp = new Aplication({
    elements:6 , 
    cards:cardsArray , 
    url: 'https://pokeapi.co/api/v2/pokemon?limit=500',
    

});

// Launch App
launchApp.numberGenerator();
launchApp.shuffle();
launchApp.assignIdNumber();
launchApp.assignClassNumber();
launchApp.fetchCharacters();

// Event Listener

cardsArray.forEach(element =>{
    element.addEventListener('click' , checkCards);
});

congratulationsButton.addEventListener('click' , ()=>{
    location.reload();
})


// Function evente listener
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
                        resultScreen.classList.add('result-screen--block');
                        congratulationsAttempts.textContent = attemptsCounter.textContent;
                        congratulationsTime.textContent = timerSelector.textContent;
                    }
                    
                }, 1000);
                arrHits.push('any');
                arrHits.push('any');
                
            }
            if(selectedCard1.id !== selectedCard2.id){
                
                boardContainer.classList.add('disabled')

                setTimeout(() => {
                    selectedCard1.classList.remove('game-board__item--flip');
                    selectedCard2.classList.remove('game-board__item--flip');
                    boardContainer.classList.remove('disabled');
                    
                }, 500);

            }
            count++;
            toogleCount =0;
            attemptsCounter.textContent = count;
            return;
        }
    }
    
}


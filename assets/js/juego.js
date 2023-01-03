/**
 * Blackjack
 * 2C Two of clubs (tréboles)
 * 2D Two of diamonds
 * 2H Two of Heards
 * 2S Two of Spades
*/


//import _ from './underscore-esm-min.js';//Versión de módulos underscore-esm-min.js
let pointsPlayer =      0,
pointsComputer =    0;

let deck =              []; //deck => "Cartas"; //let para poder sobreescrir el array
const types =           ['C', 'D', 'H', 'S'];//clubs,diamonds,heards,spades
const specialTypes =    ['A', 'J', 'Q', 'K'];//as,jack,queen,king
//Referencias HTML
const pointsEl =        document.querySelectorAll('small');
const playerCardEl =    document.querySelector('#jugador-cartas');
const computerCardEl =  document.querySelector('#computadora-cartas');
const btnAskForEl =     document.querySelector('#btn-ask-for');
const btnStopEl =       document.querySelector('#btn-stop-game');
const btnNewGameEl =    document.querySelector('#btn-new-game');

const newArray = tam => [...new Array(tam)];//Función con qué generamos un nuevo array

/**
 * Función para repartir las cartas barajadas (deal cards)
 * @returns {Array} - Un array con las cartas repartidas desordenadas
 */
const dealCards = () => {
    let deckTemporal = [];//Array temporal

    types.forEach(type => {
        const normal = newArray(9).map((el, i) => `${i + 2}${type}`)
        deckTemporal = [...deckTemporal, ...normal]
    });

    specialTypes.forEach(specialType => {
        const specials = Array.from(
            types,
            (type) => `${specialType}${type}`);
        deckTemporal = [...deckTemporal, ...specials];
    });

    //Cada vez que creemos desordenamos
    //return deckTemporal.sort((a,b)=>Math.random()-0.5);

    return _.shuffle(deckTemporal);
}

deck = dealCards();

/**
 * Creación de una carta (nodo)
 * @param {HTMLElement} rootEl - Elemento de que colgar la imagen creada
 * @param {String} cardValue - Valor de la carta para generar la src de la imagen 
 */
const createCards = (rootEl,cardValue = '10C') => {
    const imgEl = document.createElement('img');
    imgEl.classList.add('carta');
    imgEl.src = `assets/cartas/${cardValue}.png`;
    rootEl.append(imgEl);
}

/**
 * Función que pide una carta de la baraja
 * @returns {String} - Retorna la carta eliminada de la baraja
 */
const askForACardDeck = () => {
    if(!Boolean(deck.length))
        throw new Error('No hay cartas en la baraja');
    return {card: deck.pop()}; //Retornamos el elemento eliminado
}

/**
 * Función para obtener los puntos de una carta
 * @param {String} valueCard Valor de una carta
 * @returns {Number} Retorna el valor numérico de una carta
 */
const getValueCard = valueCard => {
    valueCard = valueCard.substring(0,valueCard.length-1);//Descartamos el último dígito
    
    const numberValue = !isNaN(valueCard) ? Number.parseInt(valueCard)
                                          : valueCard==='A' ? 11 : 10;
    return numberValue;
    
}

/**
 * Turno automatizado de la computadora
 * @param {Number} pointsMinValue Puntos mínimos que tiene que superar la compuradora
 */
const gameComputer = (pointsMinValue = 12) => {
    do {
        const {card} = askForACardDeck();
        createCards(computerCardEl,card);    
        pointsComputer += getValueCard(card);
        if(pointsMinValue > 21 )
            break;
    } while(pointsComputer < pointsMinValue && pointsMinValue < 21);

    pointsEl[1].textContent = pointsComputer;
}





// Enventos 
btnAskForEl.addEventListener(
'click',
()=>{
        const {card} = askForACardDeck();
        createCards(playerCardEl,card);
        
        pointsPlayer += getValueCard(card);
        
        if(pointsPlayer > 21){
            console.log('Perdiste');
            gameComputer(pointsPlayer);
            btnAskForEl.disabled = true;
            btnStopEl.disabled = true;
        } else if(pointsPlayer === 21){
            console.warn('Ganaste Genial');
            btnAskForEl.disabled = true;
            btnStopEl.disabled = true;
        }        
        pointsEl[0].textContent = pointsPlayer;    
    }
);


btnStopEl.addEventListener(
    'click',
    () => {
        btnAskForEl.disabled = true;
        btnStopEl.disabled = true;
        gameComputer(pointsPlayer);
        if(pointsComputer < 22 && pointsComputer >= pointsPlayer)
            console.log('Perdiste');
        else
            console.warn('Ganaste Genial');

    }
);

btnNewGameEl.onclick = () => {
    console.clear();//limpiamos consola    
    btnAskForEl.disabled = false;
    btnStopEl.disabled = false;
    pointsComputer = 0;
    pointsPlayer = 0;
    playerCardEl.innerHTML = '';
    computerCardEl.innerHTML = '';
    pointsEl[0].textContent = pointsEl[1].textContent = 0;

    deck = dealCards();
}
    
    
    
    
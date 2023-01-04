//Patrón módulo

const blackJack = (()=>{ //Función anónimo autollada. Creo mi scope. Como no tienen nombre no pueden ser llamadas
    'use strict';


    /**
     * Blackjack
     * 2C Two of clubs (tréboles)
     * 2D Two of diamonds
     * 2H Two of Heards
     * 2S Two of Spades
    */


    //import _ from './underscore-esm-min.js';//Versión de módulos underscore-esm-min.js
    let points =            []; //Puntos de los jugadores. El último elemento del Array es el de la computadora

    let deck =              []; //deck => "Cartas"; //let para poder sobreescrir el array
    const types =           ['C', 'D', 'H', 'S'],//clubs,diamonds,heards,spades
          specialTypes =    ['A', 'J', 'Q', 'K'];//as,jack,queen,king
    //Referencias HTML
    const pointsEl =       document.querySelectorAll('small'),
          cardsEl =        document.querySelectorAll('.cartas');
    const btnAskForEl =    document.querySelector('#btn-ask-for'),
          btnStopEl =      document.querySelector('#btn-stop-game'),
          btnNewGameEl =   document.querySelector('#btn-new-game');

    
    const initGame = (playersNumber = 1) => {
        console.clear();//limpiamos consola    
        deck = dealCards(); 
        points = Array.from([...Array(playersNumber + 1)],()=>0);
        btnAskForEl.disabled = false;
        btnStopEl.disabled = false;
        points[points.length - 1] = 0;
        points[0] = 0;
        cardsEl[0].innerHTML = '';
        cardsEl[points.length - 1].innerHTML = '';
        pointsEl[0].textContent = pointsEl[1].textContent = 0;
    }

    
    /**
     * Función para repartir las cartas barajadas (deal cards)
     * @returns {Array} - Un array con las cartas repartidas desordenadas
    */
   const dealCards = () => {
       let deckTemporal = [];//Array temporal
       
       types.forEach(type => {
           const normal = [...Array(9)].map((el, i) => `${i + 2}${type}`)
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
       
       return  !isNaN(valueCard) ? Number.parseInt(valueCard)
       : valueCard==='A' ? 11 : 10;        
    }

    /**
     * Función para llevar el registro de puntos de un usuario
     * @param {number} indexPlayer - Índice del jugador para llevar el contador de puntos
     * @param {number} pointsValue - Valor numérico de la carta para llevar los puntos
     */
    const countPoints = (indexPlayer, pointsValue) => {
        points[indexPlayer] += pointsValue;
    }
    
    /**
     * Turno automatizado de la computadora
     * @param {Number} pointsMinValue Puntos mínimos que tiene que superar la compuradora
    */
   const gameComputer = (pointsMinValue = 12) => {
       const computerIndex = points.length - 1;
       do {
           const {card} = askForACardDeck();
           createCards(cardsEl[computerIndex],card);   
           countPoints(computerIndex,getValueCard(card));
        } while(points[computerIndex] < pointsMinValue && pointsMinValue < 21);
        
        pointsEl[1].textContent = points[computerIndex];
    }
    
    
    
    
    
    // Enventos 
    btnAskForEl.addEventListener(
        'click',
        ()=>{
            const {card} = askForACardDeck();
            createCards(cardsEl[0],card);
            countPoints(0,getValueCard(card));
            
            if(points[0] > 21){
                console.log('Perdiste');
                gameComputer(points[0]);
                btnAskForEl.disabled = true;
                btnStopEl.disabled = true;
            } else if(points[0] === 21){
                console.warn('Ganaste Genial');
                btnAskForEl.disabled = true;
                btnStopEl.disabled = true;
            }        
            pointsEl[0].textContent = points[0];    
        }
        );
        
        
        btnStopEl.addEventListener(
            'click',
            () => {
                btnAskForEl.disabled = true;
                btnStopEl.disabled = true;
                gameComputer(points[0]);
                if(points[points.length-1] < 22 && points[points.length-1] >= points[0])
                console.log('Perdiste');
                else
                console.warn('Ganaste Genial');
                
            }
            );
            
            btnNewGameEl.onclick = () => {
               initGame();
            }
            
            
            return {
                init: initGame
            }
            
        })()
        
        
        
        
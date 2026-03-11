// importamos la variable con todas las combinaciones ganadoras posibles
import {winner_combos} from '../constants'

// función para comprobar si hya ganador, recibe el tablero a comprobar
export const checkWinnerFrom = (boardToCheck) => {
    // se recorre el array de combinaciones
    for(const combo of winner_combos){
      // se extraen las posiciones de la combinación
      const [a,b,c] = combo
      if(
        // se comprueba que en la posicion 'a' haya algo
        boardToCheck[a] &&
        // luego se comprueba si en la posicion 'a' y 'b' hay lo mismo
        boardToCheck[a] === boardToCheck[b] &&
        // por último se comprueba si en la posicion 'a' y 'c' hay lo mismo
        boardToCheck[a] === boardToCheck[c]
      ){
        // si se cumplen las 3, se devuelve el valor de 'a' (X u O)
        return boardToCheck[a]
      }
    } 
    // si no hay ganador, devuelve null
    return null
  }

// función para comprobar el final del juego (tablero lleno sin ganador)
export const checkEndGame = (newBoard) => {
    // every devuelve true si todos los elementos cumplen la condición
    // en este caso se comprueba que las casillas del tablero tengan contenido (square != null)
    return newBoard.every(square => square != null)
  }
// constantes del juego, se exportan para usarlas en otros archivos
export const turns = {
  x: '❌',
  o: '⚪'
}

// combinaciones ganadoras posibles, cada número representa la posición en el tablero
export const winner_combos = [
  [0,1,2], // primera fila
  [3,4,5], // segunda fila
  [6,7,8], // tercera fila
  [0,3,6], // primera columna
  [1,4,7], // segunda columna
  [2,5,8], // tercera columna
  [0,4,8], // diagonal hacia abajo
  [2,4,6]  // diagonal hacia arriba
]
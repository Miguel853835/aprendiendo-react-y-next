// función para guardar el juego en localStorage, se recibe el estado del tablero y el turno
export const saveGameToStorage = ({board, turn}) => {
    // se guarda el tablero como un string (JSON)
    window.localStorage.setItem('board', JSON.stringify(board))
    // al ser un string ya, el turno se guarda directamente
    window.localStorage.setItem('turn', turn)
}

// función para reiniciar el juego
export const resetGameToStorage = () => {
    // se eliminan los datos del tablero de localStorage
    window.localStorage.removeItem('board')
    // se eliminan los datos del turno de localStorage
    window.localStorage.removeItem('turn')
}

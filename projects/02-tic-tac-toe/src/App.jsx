import { useState, useEffect} from 'react'
import confetti from 'canvas-confetti'
import { Square } from './components/Square'
import { turns} from './constants'
import { checkWinnerFrom, checkEndGame } from './logic/board'
import { WinnerModal } from './components/WinnerModal'
import { saveGameToStorage, resetGameToStorage } from './logic/storage'

function App() {
  const [board, setBoard] = useState(() =>{
    // Se mira si hay una partida guardada
    const boardFromStorage = window.localStorage.getItem('board')
    //Si hay, se pasa de texto a Array usable. 
    // Si no, se crea tablero de 9 casillas vacías.
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  // Se define turno incial
  const [turn, setTurn] = useState(() =>{
    // Se mira si hay turno guardado
    const turnFromStorage = window.localStorage.getItem("turn")
    // Si lo hay se usa, si no turno 'X' por defecto
    return turnFromStorage ? turnFromStorage : turns.x
  })

  // null porque no hay ganador
  const [winner, setWinner] = useState(null)

  
  const updateBoard = (index) =>{
    // Si la casilla tiene algo o hay ganador, no se puede jugar
    if(board[index] || winner) return
    // copia del tablero (NO SE MODIFICA EL ORIGINAL)
    const newBoard = [...board]
    // marcar casilla del turno que toque
    newBoard[index]= turn 
    setBoard(newBoard) //pintar tablero

    // cambiar turno
    const newTurn = turn == turns.x ? turns.o : turns.x
    setTurn(newTurn)

    // guardar en localStorage para que no se borre al refrescar
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    // comprobar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    // si lo hay
    if(newWinner){
      // lanza confetti
      confetti()
      // guarda el ganador
      setWinner(newWinner)
    }
    // si no hay ganador
    else if(checkEndGame(newBoard)){
      // sin ganador y tablero lleno da empate(false)
      setWinner(false)
    }
  }

  // reiniciar juego
  const resetGame = () => {
    // se limpia el tablero
    setBoard(Array(9).fill(null))
    // turno inicial es de X
    setTurn(turns.x)
    // no hay ganador
    setWinner(null)
    //no hay datos en local
    resetGameToStorage()
  }

  
  return (
    <main className="board">
        <h1>Tic Tac Toe</h1>
        {/* boton para resetear */}
        <button onClick={resetGame}>Empezar de nuevo</button>
        {/* tablero del juego */}
        <section className="game">
          {
            // se recorre el array (9 posiciones)
            board.map((square, index) => {
              return (
                <Square
                  key={index} /*  react necesita una key */
                  index={index} /* posicion de la casilla */
                  updateBoard={updateBoard} /* funcion para actualizar el tablero */
                >
                {square}  {/* relleno de la casilla */}
                </Square>
              )
            })
          }
          
        </section>
        {/* indicador del turno (marca en azul a quien le toca) */}
        <section className="turn">
          <Square isSelected={turn == turns.x}>
            {turns.x}
          </Square>
          <Square isSelected={turn == turns.o}>
            {turns.o}</Square>
        </section>
        {/* modal que muestra el resultado */}
        <WinnerModal resetGame = {resetGame} winner = {winner}/>
    </main>
  )
}

export default App

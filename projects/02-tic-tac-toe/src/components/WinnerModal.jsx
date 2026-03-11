import { Square } from './Square'

export function WinnerModal ({ winner, resetGame }) {
  // Si no hay ganador, no devuelve nada (ni el modal ni el fondo)
  if (winner === null) return null
  // si winner es false, es empate, si no, se muestra el ganador
  const winnerText = winner === false ? 'Empate' : 'El ganador es:'
  return (
    <section className='winner'>
      <div className='text'>
          <h2>{winnerText}</h2>
          <header className='win'>
          {/* este && es como un IF, si winner es true, muestra el cuadro del ganador (el simbolo), si es false no muestra nada */}
          {winner && <Square>{winner}</Square>}
        </header>
          <footer>
          {/* botón para jugar de nuevo, hace el reset para limpiar los datos */}
          <button onClick={resetGame}>Empezar de nuevo</button>
        </footer>
        </div>
    </section> 
  )
}

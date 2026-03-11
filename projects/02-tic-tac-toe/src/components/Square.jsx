// definimos el componente Square y recibimos las "props" (sus piezas de datos)
export const Square = ({ children, isSelected, updateBoard, index}) => {
  // clases para el css, siempre tiene square y si la casilla está seleccionada se le añade is-selected
  const className = `square ${isSelected ? 'is-selected' : ''}`

  // función que se ejecuta al hacer click en la casilla
  const handleClick = () => {
    // se actualiza tablero con la función de las props, con el index de la casilla
    updateBoard(index)
  }
  return (
    // dibujamos el cuadrado. Al hacer click, dispara nuestra función handleClick
    <div onClick={handleClick}className={className}>
      {/* children es el contenido de la casilla */}
      {children}
    </div>
  )
}
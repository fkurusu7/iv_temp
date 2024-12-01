import useTicTacToe from "../hooks/useTicTacToe";

function TicTacToe() {
  const { board, resetGame, getStatusMessage, handleClick } = useTicTacToe();

  return (
    <div className="game">
      <div className="status">
        <p>{getStatusMessage()}</p>
        <button className="reset-btn" type="button" onClick={resetGame}>
          Reset Game
        </button>
      </div>
      <div className="board">
        {board.map((b, index) => (
          <button
            key={index}
            className="cell"
            onClick={() => handleClick(index)}
            disabled={b !== null}
          >
            {board[index]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TicTacToe;

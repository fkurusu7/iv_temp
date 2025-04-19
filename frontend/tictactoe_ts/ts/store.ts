import type { GameState, Player, GameStatus, Game } from "./types";

const initialValue: GameState = {
  // [{ player: this.game.currentPlayer, squareId: 0 }]
  currentGameMoves: [],
  history: {
    currentRoundGames: [],
    allGames: [],
  },
};

export default class Store extends EventTarget {
  constructor(
    private readonly storageKey: string,
    private readonly players: Player[]
  ) {
    super();
  }

  get game() {
    const state = this.#getState();
    const currentPlayer = this.players[state.currentGameMoves.length % 2];
    const nextPlayer =
      currentPlayer.id === 1 ? this.players[1] : this.players[0];

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];
    let winner = null;

    for (const player of this.players) {
      const selectedSquareIds = state.currentGameMoves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.squareId);

      for (const pattern of winningPatterns) {
        if (pattern.every((p) => selectedSquareIds.includes(p))) {
          winner = player;
        }
      }
    }

    return {
      currentPlayer,
      nextPlayer,
      moves: state.currentGameMoves,
      status: {
        isComplete: winner != null || state.currentGameMoves.length === 9,
        winner,
      },
    };
  }

  get stats() {
    const gameHistory = this.#getState().history;

    const playerWithStats = this.players.map((player) => {
      const wins = gameHistory.currentRoundGames.filter(
        (game) => game.status.winner?.id === player.id
      ).length;
      return { ...player, wins };
    });

    const ties = gameHistory.currentRoundGames.filter(
      (game) => !game.status.winner
    ).length;

    return { playerWithStats, ties };
  }

  playerMove(squareId: number) {
    const stateClone = structuredClone(this.#getState());
    stateClone.currentGameMoves.push({
      player: this.game.currentPlayer,
      squareId,
    });

    this.#setState(stateClone);
  }

  reset() {
    const stateClone = structuredClone(this.#getState()) as GameState;
    const { status, moves } = this.game;

    // if the status is complete save the current game to history
    if (status.isComplete) {
      stateClone.history.currentRoundGames.push({
        moves,
        status,
      });
    }

    stateClone.currentGameMoves = [];

    this.#setState(stateClone);
  }

  newRound() {
    this.reset();

    const stateClone = structuredClone(this.#getState()) as GameState;
    stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
    stateClone.history.currentRoundGames = [];

    this.#setState(stateClone);
  }

  #getState(): GameState {
    const item = window.localStorage.getItem(this.storageKey);
    if (!item) return initialValue as GameState;
    return JSON.parse(item) as GameState;
  }

  #setState(
    stateOrFunction: GameState | ((prevState: GameState) => GameState)
  ) {
    const prevState = this.#getState();

    let newState;
    switch (typeof stateOrFunction) {
      case "function":
        newState = stateOrFunction(prevState);
        break;
      case "object":
        newState = stateOrFunction;
        break;
      default:
        throw new Error("Invalid argument passed to #setState()");
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event("statechange"));
  }
}

import Store from "./store.js";
import View from "./view.js";

const players = [
  { id: 1, name: "Player 1", iconClass: "fa-x", colorClass: "yellow" },
  { id: 2, name: "Player 2", iconClass: "fa-o", colorClass: "turquoise" },
];

const LS_T3_KEY = "t3_game_ls";

function init() {
  const view = new View();
  const store = new Store(LS_T3_KEY, players);

  store.addEventListener("statechange", () => {
    view.render(store.game, store.stats);
  });

  window.addEventListener("storage", () => {
    view.render(store.game, store.stats);
  });
  view.render(store.game, store.stats);

  view.bindGameResetEvent((event) => {
    store.reset();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) return;

    store.playerMove(+square.id);
  });
}
window.addEventListener("load", init);

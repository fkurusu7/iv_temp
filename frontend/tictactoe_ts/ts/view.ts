import type { Game, Move, Player } from "./types";
import { DerivedGame, DerivedStats } from "./store";

class View {
  $: Record<string, Element> = {};
  /* type ElementObjectDict = {
    [key in string]: Element;
  }; */
  // $: ElementObjectDict = {};
  $$: Record<string, NodeListOf<Element>> = {};

  constructor() {
    // All selected HTML elements
    // Menu
    this.$.menuBtnElement = this.#qs("menu-button");
    this.$.menuItemsElement = this.#qs("menu-popover");

    // Game
    this.$.turnElement = this.#qs("turn");
    this.$.resetBtn = this.#qs("reset-btn");
    this.$.newRoundBtn = this.#qs("new-round-btn");
    this.$$.squares = this.#qsa("square");
    this.$.gridElement = this.#qs("grid");

    // Modal
    this.$.modalElement = this.#qs("modal");
    this.$.modalTextElement = this.#qs("modal-text");
    this.$.modalButtonElement = this.#qs("modal-button");

    // UI-Only Event Listeners
    this.$.menuBtnElement.addEventListener("click", (event) =>
      this.#toggleMenu()
    );

    // Stats
    this.$.player1StatsElement = this.#qs("player1-stats");
    this.$.player2StatsElement = this.#qs("player2-stats");
    this.$.tiesStatsElement = this.#qs("tie-stats");
  }

  render(game: DerivedGame, stats: DerivedStats) {
    const { playerWithStats, ties } = stats;
    const {
      currentPlayer,
      nextPlayer,
      moves,
      status: { isComplete, winner },
    } = game;

    this.#closeAll();
    this.#clearMoves();
    this.#updateStats(playerWithStats[0].wins, playerWithStats[1].wins, ties);
    this.#initializeMoves(moves);

    if (isComplete) {
      this.#openModal(winner ? `${winner.name} wins!` : "Tie!");
      return;
    }
    this.#setTurnIndicator(currentPlayer, nextPlayer);
  }

  /**
   Register all event listeners
  */
  bindGameResetEvent(handler: EventListener) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalButtonElement.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler: EventListener) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler: (el: Element) => void) {
    this.#delegate(this.$.gridElement, '[data-id="square"]', "click", handler);
    /* this.$$.squares.forEach((square) =>
      square.addEventListener("click", () => handler(square))
    ); */
  }

  /**
   DOM helper methods
  */
  #toggleMenu() {
    this.$.menuItemsElement.classList.toggle("hidden");
    this.$.menuBtnElement.classList.toggle("border");
    // const iconSpan = this.$.menuBtnElement.querySelector("span");
    // iconSpan.style.transform = "rotate(180deg)";
  }
  #closeMenu() {
    this.$.menuItemsElement.classList.add("hidden");
    this.$.menuBtnElement.classList.remove("border");
  }

  #setTurnIndicator(player: Player, opponent: Player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.iconClass);

    this.$.turnElement.classList.add(player.colorClass);
    this.$.turnElement.classList.remove(opponent.colorClass);

    label.innerText = `${player.name}, you're up!`;

    this.$.turnElement.replaceChildren(icon, label);
  }

  #updateStats(p1wins: number, p2wins: number, ties: number) {
    this.$.player1StatsElement.textContent = `${p1wins} wins`;
    this.$.player2StatsElement.textContent = `${p2wins} wins`;
    this.$.tiesStatsElement.textContent = `${ties}`;
  }

  #handlePlayerMove(squareEl: Element, player: Player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }

  #openModal(message: string) {
    const pTurnLabel = document.createElement("p");
    pTurnLabel.textContent = "Game over!";
    this.$.turnElement.replaceChildren(pTurnLabel);

    this.$.modalElement.classList.remove("hidden");
    this.$.modalTextElement.textContent = message;
    this.$.modalButtonElement;
  }

  #closeModal() {
    this.$.modalElement.classList.add("hidden");
  }

  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #clearMoves() {
    this.$$.squares.forEach((square) => square.replaceChildren());
  }

  #initializeMoves(moves: Move[]) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);
      if (existingMove) {
        this.#handlePlayerMove(square, existingMove.player);
      }
    });
  }

  // QuerySelector helper functions
  #qs(selector: string, parent?: Element) {
    const el = parent
      ? parent.querySelector(`[data-id="${selector}"]`)
      : document.querySelector(`[data-id="${selector}"]`);

    if (!el) throw new Error(`Could not find element ${selector}`);

    return el;
  }
  #qsa(selector: string) {
    const elList = document.querySelectorAll(`[data-id="${selector}"]`);

    if (!elList) throw new Error(`Could not find elements for ${selector}`);

    return elList;
  }

  #delegate(
    el: Element,
    selector: string,
    eventKey: string,
    handler: (el: Element) => void
  ) {
    el.addEventListener(eventKey, (event) => {
      if (!(event.target instanceof Element)) {
        throw new Error("Event target not found");
      }

      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}
export default View;

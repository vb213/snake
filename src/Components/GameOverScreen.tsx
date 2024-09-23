import React, { Component } from "react";
import thumbdownIMG from "../thumbs-down.png";
import styles from "./GameOverScreen.module.css";
import { Game } from "../Game/Game";

interface GameOverScreenProps {
  onReset: () => void;
  game: Game | null;
}

class GameOverScreen extends Component<GameOverScreenProps> {
  game: Game;
  constructor(props: GameOverScreenProps) {
    super(props);
    if (!props.game) {
      throw new Error("Game is null");
    }

    this.game = props.game;
  }

  render() {
    const { onReset } = this.props; // Destructure the onReset function from props

    return (
      <div className={styles.gameoverscreen}>
        <img
          src={thumbdownIMG}
          alt="Game Over"
          className={styles.gameoverimg}
        />
        <div className={styles.scorePanel}>{this.game.getScore()}</div>
        Boo, that was very bad
        <button className={styles.resetbutton} onClick={onReset}>
          Go Again
        </button>
      </div>
    );
  }
}

export default GameOverScreen;

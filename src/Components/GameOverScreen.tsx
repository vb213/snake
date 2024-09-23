import React from "react";
import thumbdownIMG from "../thumbs-down.png";
import styles from "./GameOverScreen.module.css";

interface GameOverScreenProps {
  onReset: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onReset }) => {
  return (
    <div className={styles.gameoverscreen}>
      <img src={thumbdownIMG} alt="Game Over" className={styles.gameoverimg} />
      <button className={styles.resetbutton} onClick={onReset}>
        Go Again
      </button>
    </div>
  );
};

export default GameOverScreen;

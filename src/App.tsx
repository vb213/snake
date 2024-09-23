import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import Canvas from "./Components/Canvas";
import "./App.css";
import { Direction, Game, Speed } from "./Game/Game";
import GameOverScreen from "./Components/GameOverScreen";
import ScorePanel from "./Components/ScorePanel";
import TopBar from "./Components/TopBar";

function App() {
  let canvasRef = useRef<Canvas | null>(null);
  let gameRef = useRef<Game | null>(null);
  let scoreRef = useRef<ScorePanel | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleDeath = () => {
    setIsGameOver(true);
  };

  const resetGame = () => {
    setIsGameOver(false);
    if (gameRef.current) {
      gameRef.current.reset();
    }
  };
  useEffect(() => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current;
      if (canvasElement) {
        gameRef.current = new Game(20, 20, canvasElement, handleDeath);
      }
    }
    if (gameRef.current && scoreRef.current) {
      gameRef.current.setOnScoreUpdate(
        scoreRef.current.setScoreState.bind(scoreRef.current)
      );
    }
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameRef.current) {
        switch (event.key) {
          case "ArrowUp":
            //console.log("Up");
            gameRef.current.changeDirection(Direction.Up);
            break;
          case "ArrowDown":
            //console.log("Down");
            gameRef.current.changeDirection(Direction.Down);
            break;
          case "ArrowLeft":
            //console.log("Left");
            gameRef.current.changeDirection(Direction.Left);
            break;
          case "ArrowRight":
            //console.log("Right");
            gameRef.current.startGame();
            gameRef.current.changeDirection(Direction.Right);
            break;
          case "Enter":
            resetGame();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      gameRef.current?.destroy();
    };
  });
  return (
    <div className="App">
      <header className="App-header">
        <div className="game-container">
          <TopBar></TopBar>
          <div>
            <Canvas ref={canvasRef} />
            <ScorePanel ref={scoreRef}></ScorePanel>
          </div>
          {isGameOver ? (
            <div>
              <GameOverScreen onReset={resetGame}></GameOverScreen>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;

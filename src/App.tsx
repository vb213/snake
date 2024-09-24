import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import Canvas from "./Components/Canvas";
import "./App.css";
import { Direction, Game, Speed } from "./Game/Game";
import GameOverScreen from "./Components/GameOverScreen";
import ScorePanel from "./Components/ScorePanel";
import TopBar from "./Components/TopBar";
import BottomBar from "./Components/BottomBar";

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];

function App() {
  let canvasRef = useRef<Canvas | null>(null);
  let gameRef = useRef<Game | null>(null);
  let scoreRef = useRef<ScorePanel | null>(null);
  let gameOverScreenRef = useRef<GameOverScreen | null>(null);
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
        if (!isGameOver) {
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
          }
        } else if (!ARROW_KEYS.includes(event.key)) {
          resetGame();
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
        <TopBar></TopBar>
      </header>
      <div className="App-body">
        <div className="game-container">
          <div>
            <Canvas ref={canvasRef} />
          </div>
          <div>
            <ScorePanel ref={scoreRef}></ScorePanel>
          </div>
        </div>
      </div>
      {isGameOver ? (
        <div>
          <GameOverScreen
            game={gameRef.current}
            ref={gameOverScreenRef}
            onReset={resetGame}
          ></GameOverScreen>
        </div>
      ) : (
        <div></div>
      )}
      <BottomBar></BottomBar>
    </div>
  );
}

export default App;

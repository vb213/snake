import React, { useEffect, useRef } from "react";
import logo from "./logo.svg";
import Canvas from "./Canvas";
import "./App.css";
import { Direction, Game, Speed } from "./Game/Game";

function App() {
  let canvasRef = useRef<Canvas | null>(null);
  let gameRef = useRef<Game | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current;
      if (canvasElement) {
        gameRef.current = new Game(10, 10, canvasElement);
      }
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
            gameRef.current.changeDirection(Direction.Right);
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
        Snake
        <Canvas ref={canvasRef} />
      </header>
    </div>
  );
}

export default App;

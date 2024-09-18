import React, { Component, RefObject } from "react";
import { Vector } from "./Game/Vector";
import { createThis } from "typescript";

interface CanvasProps {
  width: number;
  height: number;
}

interface CanvasState {}

class Canvas extends Component<CanvasProps, CanvasState> {
  private canvasRef: RefObject<HTMLCanvasElement>;

  static defaultProps = {
    width: 500,
    height: 500,
  };

  constructor(props: CanvasProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.initializeCanvas();
  }

  componentWillUnmount() {
    this.cleanUpCanvas();
  }

  initializeCanvas() {
    const canvas = this.canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context && this.props.width && this.props.height) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, this.props.width, this.props.height);
      }
    }
  }

  fillSquare(position: Vector, width: number, color: string) {
    this.fillRect(position, width, width, color);
  }

  fillRect(position: Vector, width: number, height: number, color: string) {
    const canvas = this.canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = color;
        context.fillRect(position.x, position.y, width, height);
      }
    }
  }

  cleanUpCanvas() {
    this.fillRect(
      new Vector(0, 0),
      this.props.width,
      this.props.height,
      "#ffffff"
    );
  }

  render() {
    const { width, height } = this.props;

    return (
      <canvas
        ref={this.canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid black" }}
      />
    );
  }
  getCanvas() {
    return this.canvasRef.current;
  }
}

export default Canvas;

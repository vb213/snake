import React, { Component, useEffect, useState } from "react";
import { Game } from "../Game/Game";
import styles from "./ScorePanel.module.css";

interface ScorePanelProps {}

interface ScorePanelState {
  score: number;
  animate: boolean;
}

class ScorePanel extends Component<ScorePanelProps, ScorePanelState> {
  constructor(props: ScorePanelProps) {
    super(props);
    this.state = {
      score: 0,
      animate: false,
    };
  }

  setScoreState(score: number) {
    this.setState({
      score: score,
      animate: true,
    });
    setTimeout(() => {
      this.setState({ animate: false });
    }, 100);
  }
  render() {
    const scorePanelClass = `${styles.scorepanel} ${
      this.state.animate ? styles["scale-animation"] : ""
    }`;

    return <div className={scorePanelClass}>{this.state.score}</div>;
  }
}

export default ScorePanel;

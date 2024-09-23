import React, { Component, useEffect, useState } from "react";
import { Game } from "../Game/Game";
import styles from "./ScorePanel.module.css";

interface ScorePanelProps {}

interface ScorePanelState {
  score: number;
}

class ScorePanel extends Component<ScorePanelProps, ScorePanelState> {
  constructor(props: ScorePanelProps) {
    super(props);
    this.state = {
      score: 10, // Initialize with a default score (e.g., 0)
    };
  }

  setScoreState(score: number) {
    this.setState({
      score: score,
    });
  }
  render() {
    console.log("Score panel render: ", this.state.score);
    return <div className={styles.scorepanel}>{this.state.score}</div>;
  }
}

export default ScorePanel;

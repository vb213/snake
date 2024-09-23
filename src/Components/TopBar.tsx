import React from "react";
import styles from "./TopBar.module.css"; // Import the CSS for styling

const TopBar: React.FC = () => {
  return (
    <div className={styles.topbar}>
      <h1 className={styles.topbartitle}>Discouraging Snake</h1>
    </div>
  );
};

export default TopBar;

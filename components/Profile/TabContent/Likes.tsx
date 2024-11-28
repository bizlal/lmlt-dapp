// components/Profile/TabContent/Likes.tsx
import React from "react";
import styles from "./TabContent/Likes.module.css";

const Likes: React.FC = () => {
  return (
    <div className={styles.tabSection}>
      <h2>Likes</h2>
      {/* Add your Likes content here */}
      <p>No likes available.</p>
    </div>
  );
};

export default Likes;

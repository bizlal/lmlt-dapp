// components/Profile/WriteSomething.tsx
import React from "react";
import { FaPen } from "react-icons/fa";
import styles from "../../styles/Profile/WriteSomething.module.css";

const WriteSomething: React.FC = () => {
  return (
    <div className={styles.writeContainer}>
      <FaPen className={styles.writeIcon} />
      <input
        type="text"
        placeholder="Write something on the timeline"
        className={styles.writeInput}
      />
    </div>
  );
};

export default WriteSomething;

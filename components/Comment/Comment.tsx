// Comment.jsx

import React, { useState } from "react";
import styles from "../../styles/Comment.module.css";

const Comment = ({ onClose }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle comment submission logic here
    console.log("New Comment:", comment);
    setComment("");
    onClose();
  };

  return (
    <div className={styles.commentPopup}>
      <div className={styles.commentContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Leave a Comment</h2>
        <form className={styles.commentForm} onSubmit={handleSubmit}>
          <textarea
            rows="4"
            placeholder="Type your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Comment;

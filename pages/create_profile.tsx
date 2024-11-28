// pages/CreateProfile.tsx
import React, { useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const CreateProfile = () => {
  const [artistName, setArtistName] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "artists"), {
      name: artistName,
      bio,
    });
    // Redirect or display success message
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Artist Name"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
      />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      ></textarea>
      <button type="submit">Create Profile</button>
    </form>
  );
};

export default CreateProfile;

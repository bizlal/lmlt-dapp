// pages/ArtistProfile.tsx
import React, { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const ArtistProfile = () => {
  const [artist, setArtist] = useState<any>(null);
  const router = useRouter();
  const { artistId } = router.query;

  useEffect(() => {
    const fetchArtist = async () => {
      if (artistId) {
        const docRef = doc(db, "artists", artistId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArtist(docSnap.data());
        }
      }
    };
    fetchArtist();
  }, [artistId]);

  if (!artist) return <p>Loading...</p>;

  return (
    <div>
      <h1>{artist.name}</h1>
      <p>{artist.bio}</p>
      {/* Display other artist info */}
    </div>
  );
};

export default ArtistProfile;

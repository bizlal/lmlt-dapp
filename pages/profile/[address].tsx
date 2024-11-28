// pages/profile/[address].tsx
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import Profile from "../../components/Profile/Profile";
import styles from "../../styles/Profile/ProfilePage.module.css";
import Skeleton from "../../components/Skeleton/Skeleton"; // Assuming you have a Skeleton component

interface UserData {
  username: string;
  profile: {
    bio: string;
    cover: string;
    email_address: string;
    image: string;
    name: string;
    total_followers: number;
    total_following: number;
    web3: {
      public_address: string;
    };
    location?: string;
    lmlt_balance?: string;
  };
  isArtist: boolean;
  isCreator: boolean;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { address: queryAddress } = router.query;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!queryAddress || typeof queryAddress !== "string") return;

      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", queryAddress));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("User not found.");
          setLoading(false);
          return;
        }

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setUserData({
            username: data.username,
            profile: {
              bio: data.profile.bio || "",
              cover: data.profile.cover || "",
              email_address: data.profile.email_address || "",
              image: data.profile.image || "",
              name: data.profile.name || "",
              total_followers: data.profile.total_followers || 0,
              total_following: data.profile.total_following || 0,
              web3: {
                public_address: data.profile.web3?.public_address || "",
              },
              location: data.profile.location || "",
              lmlt_balance: data.profile.lmlt_balance || "0.00",
            },
            isArtist: data.isArtist || false,
            isCreator: data.isCreator || false,
          });
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user data.");
      }
      setLoading(false);
    };

    fetchUser();
  }, [queryAddress]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Skeleton width="100%" height="300px" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {userData ? <Profile userData={userData} /> : <p>User data unavailable.</p>}
    </div>
  );
};

export default ProfilePage;

// components/Profile/ProfileStats.tsx
import React from "react";
import styles from "../Profile/ProfileStats.module.css";

interface ProfileStatsProps {
  userData: UserData;
}

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

const ProfileStats: React.FC<ProfileStatsProps> = ({ userData }) => {
  const { profile, isArtist, isCreator } = userData;

  const userType = isArtist ? "Artist" : isCreator ? "Creator" : "User";

  const formatNumber = (number: number): string => {
    if (number < 1000) return number.toString();
    if (number < 1000000) return `${(number / 1000).toFixed(1)}K`;
    if (number < 1000000000) return `${(number / 1000000).toFixed(1)}M`;
    return `${(number / 1000000000).toFixed(1)}B`;
  };

  return (
    <div className={styles.statsContainer}>
      {profile.lmlt_balance && (
        <div className={styles.statItem}>
          <strong>{profile.lmlt_balance}</strong>
          <p>LMLT Balance</p>
        </div>
      )}
      <div className={styles.statItem}>
        <strong>{formatNumber(profile.total_followers)}</strong>
        <p>Followers</p>
      </div>
      <div className={styles.statItem}>
        <strong>{formatNumber(profile.total_following)}</strong>
        <p>Following</p>
      </div>
      <div className={styles.statItem}>
        <strong>{userType}</strong>
        <p>Type</p>
      </div>
    </div>
  );
};

export default ProfileStats;

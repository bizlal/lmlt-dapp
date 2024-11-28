// components/Profile/Profile.tsx
import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";
import WriteSomething from "./WriteSomething";
import styles from "../../styles/Profile.module.css";

interface ProfileProps {
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

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  return (
    <div className={styles.pageContainer}>
      <ProfileHeader coverImage={userData.profile.cover} />
      <div className={styles.profileContainer}>
        <ProfileStats userData={userData} />
        <ProfileTabs userData={userData} />
        <WriteSomething />
      </div>
    </div>
  );
};

export default Profile;

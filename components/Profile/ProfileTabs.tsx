// components/Profile/ProfileTabs.tsx
import React, { useState } from "react";
import styles from "../Profile/ProfileTabs.module.css";
import Releases from "./TabContent/Releases";
import Collectibles from "./TabContent/Collectibles";
import Repost from "./TabContent/Repost";
import Likes from "./TabContent/Likes";


interface ProfileTabsProps {
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

const ProfileTabs: React.FC<ProfileTabsProps> = ({ userData }) => {
  const tabs = ["Releases", "Collectibles", "Repost", "Likes"];
  const [activeTab, setActiveTab] = useState<string>("Releases");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Releases":
        return <Releases />;
      case "Collectibles":
        return <Collectibles />;
      case "Repost":
        return <Repost />;
      case "Likes":
        return <Likes />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabButtons}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${
              activeTab === tab ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab(tab)}
            aria-selected={activeTab === tab}
            role="tab"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
};

export default ProfileTabs;

// components/Profile/ProfileHeader.tsx
import React, { useState, useEffect } from "react";
import styles from "./ProfileHeader.module.css";

interface ProfileHeaderProps {
  coverImage: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ coverImage }) => {
  const [headerHeight, setHeaderHeight] = useState<number>(350);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const newHeight = Math.max(200, 350 - scrollPosition); // Minimum height is 200px
    setHeaderHeight(newHeight);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={styles.header}
      style={{
        height: `${headerHeight}px`,
        backgroundImage: coverImage
          ? `url(${coverImage}), linear-gradient(116.94deg, #8D52CC -39.29%, #A650B2 -26%, #BC4E9B -15.53%, #CF4C87 1.54%, #DB4B7B 11.57%, #18171C 89.21%)`
          : `linear-gradient(116.94deg, #8D52CC -39.29%, #A650B2 -26%, #BC4E9B -15.53%, #CF4C87 1.54%, #DB4B7B 11.57%, #18171C 89.21%)`,
      }}
    >
      <div className={styles.overlay}></div>
    </div>
  );
};

export default ProfileHeader;

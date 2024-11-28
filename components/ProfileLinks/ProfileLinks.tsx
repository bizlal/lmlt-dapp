// components/ProfileLinks.tsx
import React from "react";
import styles from "../../styles/Profile.module.css";

interface ProfileLinksProps {
  links: {
    instagram: string;
    itunes: string;
    spotify: string;
    twitter: string;
    website: string;
  } | null;
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ links }) => {
  if (!links) return null;

  return (
    <div className={styles.profileLinks}>
      {links.instagram && (
        <a href={links.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      )}
      {links.itunes && (
        <a href={links.itunes} target="_blank" rel="noopener noreferrer">
          iTunes
        </a>
      )}
      {links.spotify && (
        <a href={links.spotify} target="_blank" rel="noopener noreferrer">
          Spotify
        </a>
      )}
      {links.twitter && (
        <a href={links.twitter} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      )}
      {links.website && (
        <a href={links.website} target="_blank" rel="noopener noreferrer">
          Website
        </a>
      )}
    </div>
  );
};

export default ProfileLinks;

import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

/**
 * Limelight's landing page featuring a vibrant gradient background and a hero asset.
 * Designed to showcase Limelight's mission to revolutionize music discovery and artist support.
 */
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.heroBackgroundInner}>
              <Image
                src="/limelight-gradient-bg.png" // Update your gradient background image path
                width={1390}
                height={1390}
                alt="Energetic background gradient symbolizing the vibrant music industry"
                quality={100}
                className={styles.gradient}
              />
            </div>
          </div>
          <div className={styles.heroAssetFrame}>
            <Image
              src="/limelight-hero-asset.png" // Update your hero asset image path
              width={860}
              height={540}
              alt="Dynamic hero asset showcasing artists and music NFTs"
              quality={100}
              className={styles.heroAsset}
            />
          </div>
          <div className={styles.heroBodyContainer}>
            <div className={styles.heroBody}>
              <h1 className={styles.heroTitle}>
                <span className={styles.heroTitleGradient}>
                  Discover and Support
                </span>
                <br />
                Independent Artists
              </h1>
              <p className={styles.heroSubtitle}>
                Limelight empowers you to explore music in a whole new way, connecting with artists around the world through NFTs and location-based discovery. Support your favorite artists directly and become part of their creative journey.
              </p>

              <div className={styles.heroCtaContainer}>
                <Link href="/explore" className={styles.heroCta}>
                  Explore Now
                </Link>
                <Link
                  href="https://github.com/limelight-platform/marketplace"
                  target="_blank"
                  className={styles.secondaryCta}
                >
                  GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

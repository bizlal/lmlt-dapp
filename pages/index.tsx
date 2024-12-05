// pages/index.tsx

import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import MediaPlayer from "../components/MediaPlayer/MediaPlayer";

const Home: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Search Query:", searchQuery);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            limelight
            <sup className={styles.beta}>beta</sup>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Discover
          </Link>
          <Link href="/library" className={styles.navLink}>
            Library
          </Link>
          <Link href="/top-charts" className={styles.navLink}>
            Top Charts
          </Link>
          <Link href="/playlist" className={styles.navLink}>
            Playlist
          </Link>
          <Link href="/artists" className={styles.navLink}>
            Artists
          </Link>
          <Link href="/genres" className={styles.navLink}>
            Genres
          </Link>
          <Link href="/events" className={styles.navLink}>
            Events
          </Link>
        </nav>
        <div className={styles.userActions}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button type="submit" className={styles.searchButton}>
              🔍
            </button>
          </form>
          <div className={styles.userProfile}>
            <Image
              src="/images/user-profile.png" // Ensure this image exists in /public/images
              alt="User Profile"
              width={40}
              height={40}
              className={styles.profileImage}
            />
            <div className={styles.userDropdown}>
              <Link href="/account" className={styles.dropdownLink}>
                Account
              </Link>
              <Link href="/settings" className={styles.dropdownLink}>
                Settings
              </Link>
              <Link href="/logout" className={styles.dropdownLink}>
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar (Optional) */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Categories</h2>
        <ul className={styles.sidebarList}>
          <li>
            <Link href="/genres/pop" className={styles.sidebarLink}>
              Pop
            </Link>
          </li>
          <li>
            <Link href="/genres/rock" className={styles.sidebarLink}>
              Rock
            </Link>
          </li>
          <li>
            <Link href="/genres/jazz" className={styles.sidebarLink}>
              Jazz
            </Link>
          </li>
          <li>
            <Link href="/genres/hip-hop" className={styles.sidebarLink}>
              Hip Hop
            </Link>
          </li>
          <li>
            <Link href="/genres/classical" className={styles.sidebarLink}>
              Classical
            </Link>
          </li>
          {/* Add more genres as needed */}
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Greeting Section */}
        <section className={styles.greetingSection}>
          <div className={styles.greetingText}>
            <h1 className={styles.greetingTitle}>
              <span className={styles.highlight}>Good Evening</span>
            </h1>
            <p className={styles.subText}>Let’s get you going with some music</p>
          </div>
          <div className={styles.featuredContainer}>
            <div className={styles.featuredCard}>
              <Image
                src="/images/drake-ep.png" // Ensure this image exists in /public/images
                alt="Drake's New EP"
                width={300}
                height={300}
                className={styles.featuredImage}
              />
              <div className={styles.featuredDetails}>
                <h2 className={styles.featuredTitle}>Drake's New EP</h2>
                <p className={styles.featuredDescription}>
                  This summer Drake announced his third upcoming album called "God's Plan."
                </p>
                <p className={styles.trackCount}>12 tracks</p>
                <Link href="/learn-more" className={styles.learnMoreButton}>
                  Learn More
                </Link>
              </div>
            </div>
            <div className={styles.recentlyPlayed}>
              <div className={styles.recentlyHeader}>
                <h2 className={styles.recentlyTitle}>Recently Played</h2>
                <Link href="/recently-played" className={styles.seeAll}>
                  See all
                </Link>
              </div>
              <div className={styles.recentlyCardList}>
                <div className={styles.recentlyCard}>
                  <Image
                    src="/images/killshot.png" // Ensure this image exists in /public/images
                    alt="Killshot"
                    width={150}
                    height={150}
                    className={styles.recentlyImage}
                  />
                  <p className={styles.recentlyTrackTitle}>Killshot</p>
                  <p className={styles.recentlyArtist}>MGK</p>
                </div>
                <div className={styles.recentlyCard}>
                  <Image
                    src="/images/placeholder.png" // Ensure this image exists in /public/images
                    alt="Track 2"
                    width={150}
                    height={150}
                    className={styles.recentlyImage}
                  />
                  <p className={styles.recentlyTrackTitle}>Track 2</p>
                  <p className={styles.recentlyArtist}>Artist 2</p>
                </div>
                <div className={styles.recentlyCard}>
                  <Image
                    src="/images/placeholder.png" // Duplicate placeholder
                    alt="Track 3"
                    width={150}
                    height={150}
                    className={styles.recentlyImage}
                  />
                  <p className={styles.recentlyTrackTitle}>Track 3</p>
                  <p className={styles.recentlyArtist}>Artist 3</p>
                </div>
                <div className={styles.recentlyCard}>
                  <Image
                    src="/images/placeholder.png" // Duplicate placeholder
                    alt="Track 4"
                    width={150}
                    height={150}
                    className={styles.recentlyImage}
                  />
                  <p className={styles.recentlyTrackTitle}>Track 4</p>
                  <p className={styles.recentlyArtist}>Artist 4</p>
                </div>
                {/* Add more recently played tracks as needed */}
              </div>
            </div>
          </div>
        </section>

        {/* Made for You Section */}
        <section className={styles.horizontalSection}>
          <h2 className={styles.sectionTitle}>Made for You</h2>
          <div className={styles.horizontalCards}>
            <div className={styles.card}>
              <Image
                src="/images/90s-mix.png" // Ensure this image exists in /public/images
                alt="Hot 90s Mix"
                width={200}
                height={120}
                className={styles.cardImage}
              />
              <p className={styles.cardTitle}>Hot 90s Mix</p>
              <p className={styles.cardTracks}>80 songs</p>
            </div>
            <div className={styles.card}>
              <Image
                src="/images/weekly-hits.png" // Ensure this image exists in /public/images
                alt="Weekly Hits"
                width={200}
                height={120}
                className={styles.cardImage}
              />
              <p className={styles.cardTitle}>Weekly Hits</p>
              <p className={styles.cardTracks}>50 songs</p>
            </div>
            <div className={styles.card}>
              <Image
                src="/images/placeholder.png" // Placeholder image
                alt="Mix 3"
                width={200}
                height={120}
                className={styles.cardImage}
              />
              <p className={styles.cardTitle}>Chill Vibes</p>
              <p className={styles.cardTracks}>60 songs</p>
            </div>
            <div className={styles.card}>
              <Image
                src="/images/placeholder.png" // Placeholder image
                alt="Mix 4"
                width={200}
                height={120}
                className={styles.cardImage}
              />
              <p className={styles.cardTitle}>Workout Beats</p>
              <p className={styles.cardTracks}>70 songs</p>
            </div>
            {/* Add more cards as needed */}
          </div>
        </section>

        {/* Explore New Region Section */}
        <section className={styles.horizontalSection}>
          <h2 className={styles.sectionTitle}>Explore New Region</h2>
          <div className={styles.horizontalCards}>
            <div className={styles.card}>
              <Image
                src="/images/atlanta.png" // Ensure this image exists in /public/images
                alt="Atlanta"
                width={200}
                height={120}
                className={styles.cardImage}
              />
              <p className={styles.cardTitle}>Atlanta</p>
              <p className={styles.cardInfo}>233 artists, 24 producers</p>
            </div>
            <div className={styles.card}>
              <Image
                src="/images/los-angeles.png" // Ensure this image exists in /public/images
                alt="Los Angeles"
                width={200}
                height={120}
                className={styles.cardImage}
              />
              <p className={styles.cardTitle}>Los Angeles</p>
              <p className={styles.cardInfo}>120 artists, 32 producers</p>
            </div>
            <div className={styles.card}>
              <Image
                src="/images/new-york.png" // Ensure this image exists in /public/images
                alt="New York"
                width={200}
                height={120}
                className={styles.cardImage}
              />
              <p className={styles.cardTitle}>New York</p>
              <p className={styles.cardInfo}>150 artists, 28 producers</p>
            </div>
            <div className={styles.card}>
              <Image
                src="/images/london.png" // Ensure this image exists in /public/images
                alt="London"
                width={200}
                height={120}
                className={styles.cardImage}
              />
              <p className={styles.cardTitle}>London</p>
              <p className={styles.cardInfo}>200 artists, 35 producers</p>
            </div>
            {/* Add more region cards as needed */}
          </div>
        </section>

        {/* Top Chart Section */}
        <section className={styles.topChart}>
          <h2 className={styles.sectionTitle}>Top Chart</h2>
          <table className={styles.chartTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Album</th>
                <th>Date</th>
                <th>Genre</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Middle Child</td>
                <td>KOD</td>
                <td>Apr 23, 2021</td>
                <td>Hip Hop</td>
              </tr>
              <tr>
                <td>2</td>
                <td>She Bad</td>
                <td>KOD</td>
                <td>Apr 23, 2021</td>
                <td>Hip Hop</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Blinding Lights</td>
                <td>After Hours</td>
                <td>Mar 20, 2020</td>
                <td>Pop</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Levitating</td>
                <td>Future Nostalgia</td>
                <td>Oct 1, 2020</td>
                <td>Disco</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Good 4 U</td>
                <td>Good 4 U</td>
                <td>Jun 9, 2021</td>
                <td>Pop Punk</td>
              </tr>
              {/* Add more chart rows as needed */}
            </tbody>
          </table>
        </section>

        {/* Upcoming Releases Section */}
        <section className={styles.upcomingReleases}>
          <h2 className={styles.sectionTitle}>Upcoming Releases</h2>
          <div className={styles.upcomingGrid}>
            <div className={styles.upcomingCard}>
              <Image
                src="/images/upcoming1.png" // Ensure this image exists in /public/images
                alt="Upcoming Album 1"
                width={200}
                height={200}
                className={styles.upcomingImage}
              />
              <p className={styles.upcomingTitle}>Album Title 1</p>
              <p className={styles.upcomingArtist}>Artist Name 1</p>
              <p className={styles.upcomingDate}>Dec 15, 2024</p>
            </div>
            <div className={styles.upcomingCard}>
              <Image
                src="/images/upcoming2.png" // Ensure this image exists in /public/images
                alt="Upcoming Album 2"
                width={200}
                height={200}
                className={styles.upcomingImage}
              />
              <p className={styles.upcomingTitle}>Album Title 2</p>
              <p className={styles.upcomingArtist}>Artist Name 2</p>
              <p className={styles.upcomingDate}>Jan 10, 2025</p>
            </div>
            <div className={styles.upcomingCard}>
              <Image
                src="/images/upcoming3.png" // Ensure this image exists in /public/images
                alt="Upcoming Album 3"
                width={200}
                height={200}
                className={styles.upcomingImage}
              />
              <p className={styles.upcomingTitle}>Album Title 3</p>
              <p className={styles.upcomingArtist}>Artist Name 3</p>
              <p className={styles.upcomingDate}>Feb 20, 2025</p>
            </div>
            <div className={styles.upcomingCard}>
              <Image
                src="/images/upcoming4.png" // Ensure this image exists in /public/images
                alt="Upcoming Album 4"
                width={200}
                height={200}
                className={styles.upcomingImage}
              />
              <p className={styles.upcomingTitle}>Album Title 4</p>
              <p className={styles.upcomingArtist}>Artist Name 4</p>
              <p className={styles.upcomingDate}>Mar 5, 2025</p>
            </div>
            {/* Add more upcoming releases as needed */}
          </div>
        </section>

        {/* Featured Artists Section */}
        <section className={styles.featuredArtists}>
          <h2 className={styles.sectionTitle}>Featured Artists</h2>
          <div className={styles.artistsGrid}>
            <div className={styles.artistCard}>
              <Image
                src="/images/artist1.png" // Ensure this image exists in /public/images
                alt="Artist 1"
                width={150}
                height={150}
                className={styles.artistImage}
              />
              <p className={styles.artistName}>Artist Name 1</p>
              <p className={styles.artistGenre}>Genre: Pop</p>
              <Link href="/artists/artist1" className={styles.followButton}>
                Follow
              </Link>
            </div>
            <div className={styles.artistCard}>
              <Image
                src="/images/artist2.png" // Ensure this image exists in /public/images
                alt="Artist 2"
                width={150}
                height={150}
                className={styles.artistImage}
              />
              <p className={styles.artistName}>Artist Name 2</p>
              <p className={styles.artistGenre}>Genre: Rock</p>
              <Link href="/artists/artist2" className={styles.followButton}>
                Follow
              </Link>
            </div>
            <div className={styles.artistCard}>
              <Image
                src="/images/artist3.png" // Ensure this image exists in /public/images
                alt="Artist 3"
                width={150}
                height={150}
                className={styles.artistImage}
              />
              <p className={styles.artistName}>Artist Name 3</p>
              <p className={styles.artistGenre}>Genre: Jazz</p>
              <Link href="/artists/artist3" className={styles.followButton}>
                Follow
              </Link>
            </div>
            <div className={styles.artistCard}>
              <Image
                src="/images/artist4.png" // Ensure this image exists in /public/images
                alt="Artist 4"
                width={150}
                height={150}
                className={styles.artistImage}
              />
              <p className={styles.artistName}>Artist Name 4</p>
              <p className={styles.artistGenre}>Genre: Hip Hop</p>
              <Link href="/artists/artist4" className={styles.followButton}>
                Follow
              </Link>
            </div>
            {/* Add more artist cards as needed */}
          </div>
        </section>

        {/* Genres Section */}
        <section className={styles.genresSection}>
          <h2 className={styles.sectionTitle}>Explore Genres</h2>
          <div className={styles.genresGrid}>
            <div className={styles.genreCard}>
              <Image
                src="/images/genre-pop.png" // Ensure this image exists in /public/images
                alt="Pop Genre"
                width={100}
                height={100}
                className={styles.genreImage}
              />
              <p className={styles.genreName}>Pop</p>
            </div>
            <div className={styles.genreCard}>
              <Image
                src="/images/genre-rock.png" // Ensure this image exists in /public/images
                alt="Rock Genre"
                width={100}
                height={100}
                className={styles.genreImage}
              />
              <p className={styles.genreName}>Rock</p>
            </div>
            <div className={styles.genreCard}>
              <Image
                src="/images/genre-jazz.png" // Ensure this image exists in /public/images
                alt="Jazz Genre"
                width={100}
                height={100}
                className={styles.genreImage}
              />
              <p className={styles.genreName}>Jazz</p>
            </div>
            <div className={styles.genreCard}>
              <Image
                src="/images/genre-hiphop.png" // Ensure this image exists in /public/images
                alt="Hip Hop Genre"
                width={100}
                height={100}
                className={styles.genreImage}
              />
              <p className={styles.genreName}>Hip Hop</p>
            </div>
            <div className={styles.genreCard}>
              <Image
                src="/images/genre-classical.png" // Ensure this image exists in /public/images
                alt="Classical Genre"
                width={100}
                height={100}
                className={styles.genreImage}
              />
              <p className={styles.genreName}>Classical</p>
            </div>
            <div className={styles.genreCard}>
              <Image
                src="/images/genre-electronic.png" // Ensure this image exists in /public/images
                alt="Electronic Genre"
                width={100}
                height={100}
                className={styles.genreImage}
              />
              <p className={styles.genreName}>Electronic</p>
            </div>
            {/* Add more genre cards as needed */}
          </div>
        </section>

        {/* Events Section */}
        <section className={styles.eventsSection}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          <div className={styles.eventsGrid}>
            <div className={styles.eventCard}>
              <Image
                src="/images/event1.png" // Ensure this image exists in /public/images
                alt="Event 1"
                width={300}
                height={200}
                className={styles.eventImage}
              />
              <div className={styles.eventDetails}>
                <h3 className={styles.eventName}>Summer Fest 2024</h3>
                <p className={styles.eventDate}>June 21, 2024</p>
                <p className={styles.eventLocation}>Central Park, NYC</p>
                <Link href="/events/summer-fest-2024" className={styles.eventButton}>
                  Learn More
                </Link>
              </div>
            </div>
            <div className={styles.eventCard}>
              <Image
                src="/images/event2.png" // Ensure this image exists in /public/images
                alt="Event 2"
                width={300}
                height={200}
                className={styles.eventImage}
              />
              <div className={styles.eventDetails}>
                <h3 className={styles.eventName}>Rock Night 2024</h3>
                <p className={styles.eventDate}>July 15, 2024</p>
                <p className={styles.eventLocation}>Madison Square Garden, NYC</p>
                <Link href="/events/rock-night-2024" className={styles.eventButton}>
                  Learn More
                </Link>
              </div>
            </div>
            <div className={styles.eventCard}>
              <Image
                src="/images/event3.png" // Ensure this image exists in /public/images
                alt="Event 3"
                width={300}
                height={200}
                className={styles.eventImage}
              />
              <div className={styles.eventDetails}>
                <h3 className={styles.eventName}>Jazz Evening</h3>
                <p className={styles.eventDate}>August 10, 2024</p>
                <p className={styles.eventLocation}>Blue Note, NYC</p>
                <Link href="/events/jazz-evening" className={styles.eventButton}>
                  Learn More
                </Link>
              </div>
            </div>
            {/* Add more event cards as needed */}
          </div>
        </section>

        {/* Featured Playlists Section */}
        <section className={styles.featuredPlaylists}>
          <h2 className={styles.sectionTitle}>Featured Playlists</h2>
          <div className={styles.playlistsGrid}>
            <div className={styles.playlistCard}>
              <Image
                src="/images/playlist1.png" // Ensure this image exists in /public/images
                alt="Playlist 1"
                width={200}
                height={200}
                className={styles.playlistImage}
              />
              <p className={styles.playlistName}>Morning Motivation</p>
              <p className={styles.playlistDescription}>Start your day with energy</p>
              <Link href="/playlists/morning-motivation" className={styles.playlistButton}>
                Play Now
              </Link>
            </div>
            <div className={styles.playlistCard}>
              <Image
                src="/images/playlist2.png" // Ensure this image exists in /public/images
                alt="Playlist 2"
                width={200}
                height={200}
                className={styles.playlistImage}
              />
              <p className={styles.playlistName}>Evening Chill</p>
              <p className={styles.playlistDescription}>Relax and unwind</p>
              <Link href="/playlists/evening-chill" className={styles.playlistButton}>
                Play Now
              </Link>
            </div>
            <div className={styles.playlistCard}>
              <Image
                src="/images/playlist3.png" // Ensure this image exists in /public/images
                alt="Playlist 3"
                width={200}
                height={200}
                className={styles.playlistImage}
              />
              <p className={styles.playlistName}>Workout Hits</p>
              <p className={styles.playlistDescription}>Get pumped up</p>
              <Link href="/playlists/workout-hits" className={styles.playlistButton}>
                Play Now
              </Link>
            </div>
            <div className={styles.playlistCard}>
              <Image
                src="/images/playlist4.png" // Ensure this image exists in /public/images
                alt="Playlist 4"
                width={200}
                height={200}
                className={styles.playlistImage}
              />
              <p className={styles.playlistName}>Night Drives</p>
              <p className={styles.playlistDescription}>Perfect for late nights</p>
              <Link href="/playlists/night-drives" className={styles.playlistButton}>
                Play Now
              </Link>
            </div>
            {/* Add more playlist cards as needed */}
          </div>
        </section>

        {/* User Recommendations Section */}
        <section className={styles.userRecommendations}>
          <h2 className={styles.sectionTitle}>Recommended for You</h2>
          <div className={styles.recommendationsGrid}>
            <div className={styles.recommendationCard}>
              <Image
                src="/images/recommend1.png" // Ensure this image exists in /public/images
                alt="Recommendation 1"
                width={200}
                height={200}
                className={styles.recommendationImage}
              />
              <p className={styles.recommendationName}>Artist Name 5</p>
              <p className={styles.recommendationGenre}>Genre: Electronic</p>
              <Link href="/artists/artist5" className={styles.followButton}>
                Follow
              </Link>
            </div>
            <div className={styles.recommendationCard}>
              <Image
                src="/images/recommend2.png" // Ensure this image exists in /public/images
                alt="Recommendation 2"
                width={200}
                height={200}
                className={styles.recommendationImage}
              />
              <p className={styles.recommendationName}>Artist Name 6</p>
              <p className={styles.recommendationGenre}>Genre: Pop</p>
              <Link href="/artists/artist6" className={styles.followButton}>
                Follow
              </Link>
            </div>
            <div className={styles.recommendationCard}>
              <Image
                src="/images/recommend3.png" // Ensure this image exists in /public/images
                alt="Recommendation 3"
                width={200}
                height={200}
                className={styles.recommendationImage}
              />
              <p className={styles.recommendationName}>Artist Name 7</p>
              <p className={styles.recommendationGenre}>Genre: Rock</p>
              <Link href="/artists/artist7" className={styles.followButton}>
                Follow
              </Link>
            </div>
            <div className={styles.recommendationCard}>
              <Image
                src="/images/recommend4.png" // Ensure this image exists in /public/images
                alt="Recommendation 4"
                width={200}
                height={200}
                className={styles.recommendationImage}
              />
              <p className={styles.recommendationName}>Artist Name 8</p>
              <p className={styles.recommendationGenre}>Genre: Jazz</p>
              <Link href="/artists/artist8" className={styles.followButton}>
                Follow
              </Link>
            </div>
            {/* Add more recommendation cards as needed */}
          </div>
        </section>

        {/* Newsletter Subscription Section */}
        <section className={styles.newsletterSection}>
          <h2 className={styles.sectionTitle}>Subscribe to Our Newsletter</h2>
          <form className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.newsletterInput}
              aria-label="Email Address"
              required
            />
            <button type="submit" className={styles.subscribeButton}>
              Subscribe
            </button>
          </form>
          <p className={styles.newsletterInfo}>
            Stay updated with the latest releases, events, and exclusive offers.
          </p>
        </section>
        <MediaPlayer />
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}>
            <Link href="/" className={styles.logoLink}>
              limelight
              <sup className={styles.beta}>beta</sup>
            </Link>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/about" className={styles.footerLink}>
              About
            </Link>
            <Link href="/contact" className={styles.footerLink}>
              Contact
            </Link>
            <Link href="/privacy" className={styles.footerLink}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={styles.footerLink}>
              Terms of Service
            </Link>
          </div>
          <div className={styles.socialMedia}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              📘
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              🐦
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              📸
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              ▶️
            </a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerText}>
            © 2024 Limelight. All rights reserved.
          </p>
          <div className={styles.footerBottomLinks}>
            <Link href="/sitemap" className={styles.footerLink}>
              Sitemap
            </Link>
            <Link href="/careers" className={styles.footerLink}>
              Careers
            </Link>
            <Link href="/support" className={styles.footerLink}>
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

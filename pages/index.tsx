// components/ChartComponent.tsx

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface ChartComponentProps {
  title: string;
  dataPoints: number[];
  labels: string[];
  backgroundColor?: string;
  borderColor?: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  title,
  dataPoints,
  labels,
  backgroundColor = "rgba(40, 123, 183, 0.2)",
  borderColor = "rgba(40, 123, 183, 1)",
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: dataPoints,
        fill: true,
        backgroundColor,
        borderColor,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#A1A1A1",
        },
        grid: {
          color: "#333",
        },
      },
      y: {
        ticks: {
          color: "#A1A1A1",
        },
        grid: {
          color: "#333",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

// pages/index.tsx

import { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  // Sample data for charts
  const priceData = [300, 320, 310, 330, 340, 360, 350, 370, 380, 400];
  const fundsRaisedData = [10000, 15000, 12000, 18000, 20000, 25000, 23000, 27000, 30000, 35000];
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.tokenInfo}>
          <img
            src="/images/token-logo.png"
            alt="Token Logo"
            className={styles.tokenLogo}
          />
          <div className={styles.tokenDetails}>
            <h1>G.A.M.E</h1>
            <p>Empowering creators with decentralized tools</p>
          </div>
        </div>
        <div className={styles.marketInfo}>
          <div>
            <h4>Market Cap</h4>
            <p>$45.7m</p>
          </div>
          <div>
            <h4>1 Day Change</h4>
            <p className={styles.negativeChange}>-13.19%</p>
          </div>
          <div>
            <h4>Total Value Locked</h4>
            <p>$8.9m</p>
          </div>
          <div>
            <h4>Lifetime Inferences</h4>
            <p>64,845</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Top Stats Section */}
        <section className={styles.topSection}>
          <div className={styles.statBox}>
            <h3>Remaining Supply</h3>
            <p>750m LMLT</p>
          </div>
          <div className={styles.statBox}>
            <h3>Burned Supply</h3>
            <p>0 LMLT</p>
          </div>
          <div className={styles.statBox}>
            <h3>Purchased Supply</h3>
            <p>0 LMLT</p>
          </div>
          <div className={styles.statBox}>
            <h3>Total Burned</h3>
            <p>$43,523.80</p>
          </div>
        </section>

        {/* Charts Section */}
        <section className={styles.chartSection}>
          <div className={styles.chartContainer}>
            <h3>Price</h3>
            <ChartComponent
              title="Price"
              dataPoints={priceData}
              labels={labels}
              backgroundColor="rgba(255, 108, 64, 0.2)"
              borderColor="rgba(255, 108, 64, 1)"
            />
          </div>
          <div className={styles.chartContainer}>
            <h3>Funds Raised</h3>
            <ChartComponent
              title="Funds Raised"
              dataPoints={fundsRaisedData}
              labels={labels}
              backgroundColor="rgba(39, 206, 136, 0.2)"
              borderColor="rgba(39, 206, 136, 1)"
            />
          </div>
        </section>

        {/* Transactions Section */}
        <section className={styles.transactionsSection}>
          <h3>Transactions</h3>
          <table className={styles.transactionTable}>
            <thead>
              <tr>
                <th>Address</th>
                <th>wMATIC Contributed</th>
                <th>LMLT Purchased</th>
                <th>Round</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0xfaD4...788e2e</td>
                <td>23</td>
                <td>$564.15</td>
                <td>#1</td>
                <td>11 Jan, 2022</td>
              </tr>
              <tr>
                <td>0xd418...5d7789</td>
                <td>23</td>
                <td>$234.15</td>
                <td>#1</td>
                <td>15 Jan, 2022</td>
              </tr>
              <tr>
                <td>0xLasVegas</td>
                <td>23</td>
                <td>$564.15</td>
                <td>#1</td>
                <td>17 Jan, 2022</td>
              </tr>
              <tr>
                <td>0xChicago</td>
                <td>23</td>
                <td>$854.15</td>
                <td>#1</td>
                <td>20 Jan, 2022</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Round Details Section */}
        <section className={styles.roundDetails}>
          <h3>Round Details</h3>
          <p>
            Price: 1 wMATIC = <span>300 LMLT</span>
          </p>
          <p>Supply: 250,000,000 LMLT</p>
          <p>Projected Price: 1 wMATIC = 150 LMLT</p>
          <button className={styles.buyTokensButton}>Purchase $564</button>
        </section>

        {/* Holder Distribution Section */}
        <section className={styles.holderDistribution}>
          <h3>Holder Distribution (1,266 holders)</h3>
          <table className={styles.holderTable}>
            <tbody>
              <tr>
                <td>1. 0xfaD4...788e2e</td>
                <td>9.6222%</td>
              </tr>
              <tr>
                <td>
                  2. 0xd418...5d7789
                  <span className={styles.contractBadge}>🏦 (contract)</span>
                </td>
                <td>9.5633%</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </section>

        {/* Forum Section */}
        <section className={styles.forum}>
          <h3>Forum</h3>
          <div className={styles.forumMessages}>
            <div className={styles.message}>
              <p className={styles.username}>namma.</p>
              <p>Wow, nice</p>
              <p className={styles.timestamp}>04/12/2024, 07:50:51 AM</p>
            </div>
            <div className={styles.message}>
              <p className={styles.username}>cognitive</p>
              <p>Is it a working model?</p>
              <p className={styles.timestamp}>04/12/2024, 09:35:02 AM</p>
            </div>
            <div className={`${styles.message} ${styles.admin}`}>
              <p className={styles.username}>ADMIN</p>
              <p>THE BOT IS NOT RESPONDING; USE ITS PLATFORM</p>
              <p className={styles.timestamp}>04/12/2024, 09:59:25 AM</p>
            </div>
          </div>
          <button className={styles.postReplyButton}>Post a Reply</button>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2024 Limelight. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
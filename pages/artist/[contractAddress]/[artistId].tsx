import {
  useContract,
  Web3Button,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import React, { useState, useEffect } from "react";
import Container from "../../../components/Container/Container";
import { GetStaticProps, GetStaticPaths } from "next";
import {
  BONDING_CONTRACT_ADDRESS,
  NETWORK,
} from "../../../const/contractAddresses";
import styles from "../../../styles/Bonding.module.css";
import Link from "next/link";
import Chart from "chart.js/auto";
import Skeleton from "../../../components/Skeleton/Skeleton";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../../../util/toastConfig";

type Props = {
  artistAddress: string;
};

export default function BondingPage({ artistAddress }: Props) {
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [sellAmount, setSellAmount] = useState<string>("");
  const [chartData, setChartData] = useState<any>(null);
  const [artistProfile, setArtistProfile] = useState<any>(null);

  // Connect to Bonding smart contract
  const { contract: bondingContract, isLoading: loadingContract } = useContract(
    BONDING_CONTRACT_ADDRESS
  );

  // Read artist profile from the contract
  const { data: profileData, isLoading: loadingProfile } = useContractRead(
    bondingContract,
    "getArtistProfile",
    [artistAddress]
  );

  // Fetch chart data (price history)
  const { data: priceHistory, isLoading: loadingChart } = useContractRead(
    bondingContract,
    "getPriceHistory",
    [artistAddress]
  );

  // Prepare buy and sell functions
  const { mutateAsync: buyTokens } = useContractWrite(
    bondingContract,
    "buyTokens"
  );
  const { mutateAsync: sellTokens } = useContractWrite(
    bondingContract,
    "sellTokens"
  );

  useEffect(() => {
    if (profileData) {
      setArtistProfile(profileData);
    }
  }, [profileData]);

  useEffect(() => {
    if (priceHistory) {
      // Process price history data for the chart
      const labels = priceHistory.map((entry: any) =>
        new Date(entry.timestamp * 1000).toLocaleDateString()
      );
      const prices = priceHistory.map((entry: any) => entry.price);

      setChartData({
        labels,
        datasets: [
          {
            label: "Token Price",
            data: prices,
            fill: false,
            borderColor: "#4F46E5",
            tension: 0.1,
          },
        ],
      });
    }
  }, [priceHistory]);

  // Render chart using Chart.js
  useEffect(() => {
    if (chartData) {
      const ctx = document.getElementById("priceChart") as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: chartData,
        });
      }
    }
  }, [chartData]);

  const handleBuy = async () => {
    if (!buyAmount) {
      toast(`Please enter an amount to buy`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      return;
    }
    try {
      await buyTokens({ args: [artistAddress], value: buyAmount });
      toast(`Purchase successful!`, {
        icon: "✅",
        style: toastStyle,
        position: "bottom-center",
      });
    } catch (error: any) {
      toast(`Purchase failed! Reason: ${error.message}`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
    }
  };

  const handleSell = async () => {
    if (!sellAmount) {
      toast(`Please enter an amount to sell`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      return;
    }
    try {
      await sellTokens({ args: [artistAddress, sellAmount] });
      toast(`Sale successful!`, {
        icon: "✅",
        style: toastStyle,
        position: "bottom-center",
      });
    } catch (error: any) {
      toast(`Sale failed! Reason: ${error.message}`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
    }
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg">
        <div className={styles.container}>
          {/* Artist Profile */}
          <div className={styles.profileContainer}>
            {loadingProfile ? (
              <Skeleton width="100%" height="400px" />
            ) : (
              artistProfile && (
                <>
                  <img
                    src={artistProfile.image}
                    alt={artistProfile.name}
                    className={styles.profileImage}
                  />
                  <h1 className={styles.artistName}>{artistProfile.name}</h1>
                  <p className={styles.artistDescription}>
                    {artistProfile.description}
                  </p>
                  <div className={styles.socialLinks}>
                    {artistProfile.twitter && (
                      <Link href={artistProfile.twitter} target="_blank">
                        Twitter
                      </Link>
                    )}
                    {artistProfile.website && (
                      <Link href={artistProfile.website} target="_blank">
                        Website
                      </Link>
                    )}
                  </div>
                </>
              )
            )}
          </div>

          {/* Chart */}
          <div className={styles.chartContainer}>
            {loadingChart ? (
              <Skeleton width="100%" height="400px" />
            ) : (
              <canvas id="priceChart"></canvas>
            )}
          </div>

          {/* Buy/Sell Section */}
          <div className={styles.transactionContainer}>
            <div className={styles.buySellContainer}>
              <h2>Buy Tokens</h2>
              <input
                className={styles.input}
                type="number"
                step="0.0001"
                placeholder="Amount in ETH"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
              />
              <Web3Button
                contractAddress={BONDING_CONTRACT_ADDRESS}
                action={handleBuy}
                className={styles.btn}
              >
                Buy Tokens
              </Web3Button>
            </div>

            <div className={styles.buySellContainer}>
              <h2>Sell Tokens</h2>
              <input
                className={styles.input}
                type="number"
                step="1"
                placeholder="Amount of Tokens"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />
              <Web3Button
                contractAddress={BONDING_CONTRACT_ADDRESS}
                action={handleSell}
                className={styles.btn}
              >
                Sell Tokens
              </Web3Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const artistAddress = context.params?.artistAddress as string;

  return {
    props: {
      artistAddress,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all artist addresses from the bonding contract
  const sdk = new ThirdwebSDK(NETWORK, {
    secretKey: process.env.TW_SECRET_KEY,
  });

  const contract = await sdk.getContract(BONDING_CONTRACT_ADDRESS);

  const artists = await contract.call("getAllArtists");

  const paths = artists.map((artistAddress: string) => {
    return {
      params: {
        artistAddress,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

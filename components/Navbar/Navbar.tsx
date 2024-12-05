// components/Navbar/Navbar.jsx

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useBalance,
  useChainId,
} from "@thirdweb-dev/react";
import { FaCoins, FaCopy } from "react-icons/fa";
import styles from "./Navbar.module.css";

export function Navbar() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const connectWithMetamask = useMetamask();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = useCallback(() => {
    if (address) {
      setIsModalOpen((prev) => !prev);
    } else {
      // Trigger wallet connection if not connected
      connectWithMetamask();
    }
  }, [address, connectWithMetamask]);

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        {/* Left side of the navbar */}
        <div className={styles.navLeft}>
          <Link href="/" className={styles.homeLink}>
            <Image src="/logo.png" width={48} height={48} alt="Logo" />
          </Link>

          <div className={styles.navMiddle}>
            <Link href="/buy" className={styles.link}>
              Buy
            </Link>
            <Link href="/create_profile" className={styles.link}>
              Create
            </Link>
            <Link href="/profile" className={styles.link}>
              Explore
            </Link>
            <Link href="/sell" className={styles.link}>
              Sell
            </Link>
          </div>
        </div>

        {/* Right side of the navbar */}
        <div className={styles.navRight}>
          {address ? (
            <BalanceButton onClick={handleModalToggle} />
          ) : (
            <button className={styles.connectButton} onClick={connectWithMetamask}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Token Modal */}
      {isModalOpen && address && (
        <TokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

function BalanceButton({ onClick }) {
  const { data: nativeBalance, isLoading: isNativeBalanceLoading } = useBalance();
  const [ethPrice, setEthPrice] = useState(null);
  const [isPriceLoading, setIsPriceLoading] = useState(true);

  // Fetch ETH price in USD from CoinGecko
  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch ETH price");
        }
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        setEthPrice(null);
      } finally {
        setIsPriceLoading(false);
      }
    }

    fetchEthPrice();
  }, []);

  const formattedNativeBalance = nativeBalance?.displayValue
    ? parseFloat(nativeBalance.displayValue).toFixed(4)
    : "0.0000";

  const usdConversion =
    ethPrice && formattedNativeBalance
      ? (parseFloat(formattedNativeBalance) * ethPrice).toFixed(2)
      : "0.00";

  return (
    <button className={styles.balanceButton} onClick={onClick}>
      <Image src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg" width={20} height={20} alt="ETH Logo" className={styles.ethLogo} />
      <div className={styles.balanceInfo}>
        <span>{formattedNativeBalance} ETH</span>
        <span className={styles.usdConversion}>
          ${isPriceLoading ? "Loading..." : usdConversion}
        </span>
      </div>
    </button>
  );
}

function TokenModal({ isOpen, onClose }) {
  const address = useAddress();
  const disconnect = useDisconnect();
  const { data: nativeBalance, isLoading: isBalanceLoading } = useBalance();

  const [tokens, setTokens] = useState([]);
  const [ethPrice, setEthPrice] = useState(null);
  const [isPriceLoading, setIsPriceLoading] = useState(true);

  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      } finally {
        setIsPriceLoading(false);
      }
    }

    fetchEthPrice();
  }, []);

  useEffect(() => {
    if (!address) return;

    const tokens = [
      {
        name: "Ethereum",
        symbol: "ETH",
        balance: nativeBalance?.displayValue || "0",
        logo: "/tokens/ETH.png",
        usdValue:
          ethPrice && nativeBalance?.displayValue
            ? (parseFloat(nativeBalance.displayValue) * ethPrice).toFixed(2)
            : "0.00",
      },
      {
        name: "Virtual",
        symbol: "Virtual",
        balance: "200.3157",
        usdValue: "336.53",
        logo: "/tokens/Virtual.png",
      },
      // Add more tokens here
    ];

    setTokens(tokens);
  }, [address, nativeBalance, ethPrice]);

  if (!isOpen) return null;

  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <h2>Account Settings</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>

        <div className={styles.userInfo}>
          <Image
            src="/default-profile.png"
            alt="User"
            width={80}
            height={80}
            className={styles.userImage}
          />
          <h3 className={styles.displayName}>bizlal</h3>
          <p className={styles.walletAddress}>
            {truncateAddress(address)}
            <button
              className={styles.copyButton}
              onClick={() => navigator.clipboard.writeText(address)}
            >
              <FaCopy />
            </button>
          </p>
        </div>

        <ul className={styles.tokenList}>
          {tokens.map((token, index) => (
            <li key={index} className={styles.tokenItem}>
              <div className={styles.tokenDetails}>
                <Image src={token.logo} alt={token.symbol} width={32} height={32} />
                <span>{token.name}</span>
              </div>
              <div className={styles.tokenBalances}>
                <span>
                  {parseFloat(token.balance).toFixed(4)} {token.symbol}
                </span>
                <span className={styles.usdValue}>
                  ${parseFloat(token.usdValue).toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <button
          className={styles.disconnectButton}
          onClick={() => {
            disconnect();
            onClose();
          }}
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}

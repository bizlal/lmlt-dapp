// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Mock Uniswap Router
  const MockUniswapRouter = await ethers.getContractFactory("MockUniswapRouter");
  const mockUniswapRouter = await MockUniswapRouter.deploy(deployer.address, ethers.constants.AddressZero);
  await mockUniswapRouter.deployed();
  console.log("MockUniswapRouter deployed to:", mockUniswapRouter.address);

  // Deploy BondingCurveLMLT as an upgradeable proxy
  const BondingCurveLMLT = await ethers.getContractFactory("BondingCurveLMLT");
  const bonding = await upgrades.deployProxy(
    BondingCurveLMLT,
    [
      mockUniswapRouter.address,
      "0xYourFeeRecipientAddress", // Replace with actual fee recipient address
      2, // buyTaxPercent
      2, // sellTaxPercent
      1  // liquidityTaxPercent
    ],
    { initializer: 'initialize' }
  );
  await bonding.deployed();
  console.log("BondingCurveLMLT deployed to:", bonding.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
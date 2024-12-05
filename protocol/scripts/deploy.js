// scripts/deploy.js

const hre = require("hardhat");
const { ethers, upgrades } = hre;
console.log(ethers); // This should log the ethers object.

async function main() {
  // Compile contracts
  await hre.run('compile');

  // Access ethers and upgrades from hre
  const { ethers, upgrades } = hre;

  // Deploy FFactory
  const FFactory = await ethers.getContractFactory("FFactory");
  const taxVault = "0x0000000000000000000000000000000000000000"; // Replace with your tax vault address
  const buyTax = ethers.utils.parseEther("0"); // Set your buy tax
  const sellTax = ethers.utils.parseEther("0"); // Set your sell tax
  const fFactory = await FFactory.deploy(taxVault, buyTax, sellTax);
  await fFactory.deployed();
  console.log("FFactory deployed to:", fFactory.address);

  // Deploy Asset Token (e.g., a mock token for testing)
  const AssetToken = await ethers.getContractFactory("FERC20");
  const assetToken = await AssetToken.deploy(
    "Asset Token",
    "AST",
    ethers.utils.parseEther("1000000"),
    100
  );
  await assetToken.deployed();
  console.log("Asset Token deployed to:", assetToken.address);

  // Deploy FRouter (you need to provide this contract)
  const FRouter = await ethers.getContractFactory("FRouter");
  const fRouter = await FRouter.deploy(fFactory.address, assetToken.address);
  await fRouter.deployed();
  console.log("FRouter deployed to:", fRouter.address);

  // Set router in FFactory
  await fFactory.setRouter(fRouter.address);
  console.log("Router set in FFactory.");

  // Deploy Bonding (Upgradeable)
  const Bonding = await ethers.getContractFactory("Bonding");
  const bonding = await upgrades.deployProxy(Bonding, [], { initializer: false });
  await bonding.deployed();
  console.log("Bonding deployed to:", bonding.address);

  // Initialize Bonding
  const feeTo = "0x0000000000000000000000000000000000000000"; // Replace with your feeTo address
  const fee = 10; // Fee in basis points (e.g., 10 for 1%)
  const initialSupply = ethers.utils.parseEther("1000000");
  const assetRate = ethers.utils.parseEther("1"); // Adjust as needed
  const maxTx = 100; // Max transaction percentage (e.g., 100 for 1%)
  const agentFactory = "0x0000000000000000000000000000000000000000"; // Replace with your agent factory address
  const gradThreshold = ethers.utils.parseEther("1000");

  await bonding.initialize(
    fFactory.address,
    fRouter.address,
    feeTo,
    fee,
    initialSupply,
    assetRate,
    maxTx,
    agentFactory,
    gradThreshold
  );
  console.log("Bonding initialized.");

  // Set up DeployParams (if needed)
  const deployParams = {
    tbaSalt: ethers.utils.formatBytes32String("some_salt"),
    tbaImplementation: "0x0000000000000000000000000000000000000000", // Replace with your implementation address
    daoVotingPeriod: 604800, // Example: one week in seconds
    daoThreshold: ethers.utils.parseEther("100")
  };

  await bonding.setDeployParams(deployParams);
  console.log("DeployParams set in Bonding.");

  // Now the contracts are deployed and initialized
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });

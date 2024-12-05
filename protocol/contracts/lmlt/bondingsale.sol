// contracts/BondingCurveLMLT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BondingCurveLMLT
 * @dev ERC20 Token with Bonding Curve Mechanism, Taxation, and Uniswap Liquidity Management
 */

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

interface IUniswapV2Router02 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    // Add liquidity ETH
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    )
        external
        payable
        returns (uint amountToken, uint amountETH, uint liquidity);
}

contract BondingCurveLMLT is
    ERC20Upgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    // Uniswap V2 Router
    IUniswapV2Router02 public uniswapRouter;
    address public uniswapPair;

    // Constants
    uint256 public constant INITIAL_PRICE = 5 * 10 ** 15; // 0.005 ETH in wei
    uint256 public constant MARKET_CAP_THRESHOLD = 100000 * 10 ** 18; // 100,000 ETH (adjust based on actual ETH price)

    // Tax configurations
    uint256 public buyTaxPercent; // e.g., 2 for 2%
    uint256 public sellTaxPercent; // e.g., 2 for 2%
    uint256 public liquidityTaxPercent; // e.g., 1 for 1%
    address public feeRecipient;

    // Reserve for ETH
    uint256 public ethReserve;

    // Total tokens sold
    uint256 public totalSold;

    // Flag to check if liquidity has been added
    bool public liquidityAdded;

    // Events
    event Buy(address indexed buyer, uint256 amountETH, uint256 amountTokens);
    event Sell(address indexed seller, uint256 amountTokens, uint256 amountETH);
    event LiquidityAdded(uint256 amountToken, uint256 amountETH);
    event FeesUpdated(uint256 buyTax, uint256 sellTax, uint256 liquidityTax);

    /**
     * @dev Initialize function to replace constructor for upgradeable contracts.
     * @param _uniswapRouter Address of Uniswap V2 Router.
     * @param _feeRecipient Address to receive fee taxes.
     * @param _buyTaxPercent Tax percentage on buys.
     * @param _sellTaxPercent Tax percentage on sells.
     * @param _liquidityTaxPercent Tax percentage allocated to liquidity.
     */
    function initialize(
        address _uniswapRouter,
        address _feeRecipient,
        uint256 _buyTaxPercent,
        uint256 _sellTaxPercent,
        uint256 _liquidityTaxPercent
    ) public initializer {
        require(_uniswapRouter != address(0), "Invalid Uniswap Router address");
        require(_feeRecipient != address(0), "Invalid fee recipient address");

        __ERC20_init("Limelight Market Token", "LMLT");
        __Ownable_init();
        __ReentrancyGuard_init();

        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
        feeRecipient = _feeRecipient;
        buyTaxPercent = _buyTaxPercent;
        sellTaxPercent = _sellTaxPercent;
        liquidityTaxPercent = _liquidityTaxPercent;

        liquidityAdded = false;
    }

    /**
     * @dev Function to buy LMLT tokens by sending ETH.
     */
    function buyTokens() external payable nonReentrant {
        require(msg.value > 0, "Must send ETH to buy tokens");

        uint256 tokensToMint = calculateBuyAmount(msg.value);
        require(tokensToMint > 0, "Insufficient ETH for purchase");

        // Calculate taxes
        uint256 buyTax = (msg.value * buyTaxPercent) / 100;
        uint256 liquidityTax = (msg.value * liquidityTaxPercent) / 100;
        uint256 feeTax = (msg.value * sellTaxPercent) / 100; // Using sellTaxPercent for fee as example

        uint256 totalTax = buyTax + liquidityTax + feeTax;
        uint256 ethForTokens = msg.value - totalTax;

        // Update reserves
        ethReserve += ethForTokens;

        // Mint tokens to buyer
        _mint(msg.sender, tokensToMint);
        totalSold += tokensToMint;

        // Handle taxes
        // 1. Send feeTax to feeRecipient
        if (feeTax > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: feeTax}("");
            require(feeSuccess, "Fee transfer failed");
        }

        // 2. Allocate liquidityTax for liquidity
        if (liquidityTax > 0) {
            ethReserve += liquidityTax;
            // Tokens to allocate for liquidity will be handled when adding liquidity
        }

        emit Buy(msg.sender, ethForTokens, tokensToMint);

        // Check if market cap threshold is reached
        uint256 currentMarketCap = getMarketCap();
        if (currentMarketCap >= MARKET_CAP_THRESHOLD && !liquidityAdded) {
            addLiquidity();
        }
    }

    /**
     * @dev Function to sell LMLT tokens and receive ETH.
     * @param tokenAmount Amount of LMLT tokens to sell.
     */
    function sellTokens(uint256 tokenAmount) external nonReentrant {
        require(tokenAmount > 0, "Must sell at least 1 token");
        require(
            balanceOf(msg.sender) >= tokenAmount,
            "Insufficient token balance"
        );

        uint256 ethToReturn = calculateSellAmount(tokenAmount);
        require(
            address(this).balance >= ethToReturn,
            "Insufficient ETH reserve"
        );

        // Calculate taxes
        uint256 sellTax = (ethToReturn * sellTaxPercent) / 100;
        uint256 liquidityTax = (ethToReturn * liquidityTaxPercent) / 100;
        uint256 feeTax = (ethToReturn * buyTaxPercent) / 100; // Using buyTaxPercent for fee as example

        uint256 totalTax = sellTax + liquidityTax + feeTax;
        uint256 ethForSeller = ethToReturn - totalTax;

        // Update reserves
        ethReserve -= ethToReturn;

        // Burn tokens from seller
        _burn(msg.sender, tokenAmount);
        totalSold -= tokenAmount;

        // Handle taxes
        // 1. Send feeTax to feeRecipient
        if (feeTax > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: feeTax}("");
            require(feeSuccess, "Fee transfer failed");
        }

        // 2. Allocate liquidityTax for liquidity
        if (liquidityTax > 0) {
            ethReserve += liquidityTax;
            // Tokens to allocate for liquidity will be handled when adding liquidity
        }

        // Transfer ETH to seller
        (bool success, ) = msg.sender.call{value: ethForSeller}("");
        require(success, "ETH transfer to seller failed");

        emit Sell(msg.sender, tokenAmount, ethForSeller);
    }

    /**
     * @dev Internal function to calculate the number of tokens to mint for a given ETH amount based on the bonding curve.
     * Uses a linear bonding curve: P = P0 + k * S
     * Where P0 is the initial price, k is the slope, and S is the total supply.
     * ETH required: ETH = P0 * tokens + 0.5 * k * tokens^2
     * Solving for tokens: tokens = (-P0 + sqrt(P0^2 + 2 * k * ETH)) / k
     * @param ethAmount Amount of ETH sent.
     * @return tokens Amount of LMLT tokens to mint.
     */
    function calculateBuyAmount(
        uint256 ethAmount
    ) public view returns (uint256 tokens) {
        uint256 P0 = INITIAL_PRICE; // Starting price
        uint256 k = 1 * 10 ** 12; // Define slope, adjust as needed (e.g., 0.000001 ETH per token)

        // Calculate tokens using quadratic formula
        // tokens = (-P0 + sqrt(P0^2 + 2 * k * ethAmount)) / k
        uint256 numerator = sqrt(P0 * P0 + 2 * k * ethAmount);
        tokens = (numerator - P0) / k;
    }

    /**
     * @dev Internal function to calculate the amount of ETH to return for selling a given number of tokens based on the bonding curve.
     * ETH to return: ETH = P0 * tokens + 0.5 * k * tokens^2
     * @param tokenAmount Amount of LMLT tokens to sell.
     * @return ethAmount Amount of ETH to return.
     */
    function calculateSellAmount(
        uint256 tokenAmount
    ) public view returns (uint256 ethAmount) {
        uint256 P0 = INITIAL_PRICE; // Starting price
        uint256 k = 1 * 10 ** 12; // Define slope, same as buy

        ethAmount = (P0 * tokenAmount + k * tokenAmount * tokenAmount) / 2;
    }

    /**
     * @dev Function to add liquidity to Uniswap once the market cap threshold is reached.
     */
    function addLiquidity() internal nonReentrant {
        require(!liquidityAdded, "Liquidity already added");

        uint256 tokenBalance = balanceOf(address(this));
        uint256 ethBalance = address(this).balance;

        require(
            tokenBalance > 0 && ethBalance > 0,
            "Insufficient tokens or ETH for liquidity"
        );

        // Approve Uniswap router to spend tokens
        _approve(address(this), address(uniswapRouter), tokenBalance);

        // Add liquidity
        uniswapRouter.addLiquidityETH{value: ethBalance}(
            address(this),
            tokenBalance,
            0, // Slippage is unavoidable, set to 0 for simplicity
            0, // Slippage is unavoidable, set to 0 for simplicity
            owner(),
            block.timestamp
        );

        liquidityAdded = true;

        emit LiquidityAdded(tokenBalance, ethBalance);
    }

    /**
     * @dev Function to calculate the current market cap.
     * Market Cap = Current Price * Total Supply
     * @return marketCap Current market cap in ETH.
     */
    function getMarketCap() public view returns (uint256 marketCap) {
        uint256 currentPrice = getCurrentPrice();
        marketCap = currentPrice * totalSupply();
    }

    /**
     * @dev Function to get the current price based on the bonding curve.
     * P = P0 + k * S
     * @return price Current price in wei.
     */
    function getCurrentPrice() public view returns (uint256 price) {
        uint256 P0 = INITIAL_PRICE;
        uint256 k = 1 * 10 ** 12; // Same slope as above
        price = P0 + k * totalSupply();
    }

    /**
     * @dev Internal function to compute square root using the Babylonian method.
     * @param y The input value.
     * @return z The square root of the input.
     */
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    /**
     * @dev Override ERC20's transfer functions to prevent transfers outside of buy/sell functions.
     * This ensures that all token movements go through the bonding curve mechanism.
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        require(
            sender == address(this) || recipient == address(this),
            "Transfers are restricted"
        );
        super._transfer(sender, recipient, amount);
    }

    /**
     * @dev Function to receive ETH. This is necessary for the contract to accept ETH when selling tokens.
     */
    receive() external payable {}

    /**
     * @dev Function to withdraw accidentally sent ERC20 tokens.
     * @param token Address of the ERC20 token.
     * @param amount Amount to withdraw.
     */
    function rescueERC20(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }

    /**
     * @dev Function to withdraw accidentally sent ETH.
     * @param amount Amount of ETH to withdraw.
     */
    function rescueETH(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient ETH");
        (bool success, ) = owner().call{value: amount}("");
        require(success, "ETH transfer failed");
    }

    /**
     * @dev Function to update tax percentages.
     * @param _buyTaxPercent New buy tax percentage.
     * @param _sellTaxPercent New sell tax percentage.
     * @param _liquidityTaxPercent New liquidity tax percentage.
     */
    function setFees(
        uint256 _buyTaxPercent,
        uint256 _sellTaxPercent,
        uint256 _liquidityTaxPercent
    ) external onlyOwner {
        buyTaxPercent = _buyTaxPercent;
        sellTaxPercent = _sellTaxPercent;
        liquidityTaxPercent = _liquidityTaxPercent;

        emit FeesUpdated(_buyTaxPercent, _sellTaxPercent, _liquidityTaxPercent);
    }
}

// contracts/MockUniswapRouter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockUniswapRouter {
    address public factory;
    address public WETH;

    event LiquidityAdded(
        address token,
        uint256 amountToken,
        uint256 amountETH,
        address to
    );

    constructor(address _factory, address _WETH) {
        factory = _factory;
        WETH = _WETH;
    }

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    )
        external
        payable
        returns (uint amountToken, uint amountETH, uint liquidity)
    {
        // Simplified mock: transfer tokens from sender to this contract
        IERC20(token).transferFrom(
            msg.sender,
            address(this),
            amountTokenDesired
        );
        // Assume liquidity tokens are minted and sent to 'to'
        liquidity = amountTokenDesired; // Simplified
        emit LiquidityAdded(token, amountTokenDesired, msg.value, to);
    }
}

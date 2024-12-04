// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importing necessary OpenZeppelin contracts
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

// Importing Limelight-specific contracts
import "./FFactory.sol";
import "./IFPair.sol";
import "./FRouter.sol";
import "./FERC20.sol";
import "../virtualPersona/IArtistFactoryV4.sol"; // Updated import
import "../contributions/IContributionNft.sol";
import "../services/IServiceNft.sol";
import "../governance/IGovernanceDAO.sol";

contract Bonding is
    Initializable,
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable
{
    using SafeERC20 for IERC20;

    // Limelight-specific addresses
    address private _feeToTreasury;
    address private _feeToSupporters;

    FFactory public factory;
    FRouter public router;
    uint256 public initialSupply;
    uint256 public feePercentage; // Fee in basis points (e.g., 100 = 1%)
    uint256 public constant K = 3_000_000_000_000;
    uint256 public assetRate;
    uint256 public gradThreshold;
    uint256 public maxTx;
    address public artistFactory; // Updated variable name
    address public contributionNft;
    address public serviceNft;
    address public governanceDAO;

    struct Profile {
        address user;
        address[] tokens;
    }

    struct Token {
        address creator;
        address token;
        address pair;
        address artistToken; // Updated variable name
        Data data;
        string description;
        uint8[] cores;
        string image;
        string twitter;
        string telegram;
        string youtube;
        string website;
        bool trading;
        bool tradingOnUniswap;
    }

    struct Data {
        address token;
        string name;
        string _name;
        string ticker;
        uint256 supply;
        uint256 price;
        uint256 marketCap;
        uint256 liquidity;
        uint256 volume;
        uint256 volume24H;
        uint256 prevPrice;
        uint256 lastUpdated;
    }

    struct DeployParams {
        bytes32 tbaSalt;
        address tbaImplementation;
        uint32 daoVotingPeriod;
        uint256 daoThreshold;
    }

    DeployParams private _deployParams;

    mapping(address => Profile) public profile;
    address[] public profiles;

    mapping(address => Token) public tokenInfo;
    address[] public tokenInfos;

    event Launched(address indexed token, address indexed pair, uint256 index);
    event Deployed(address indexed token, uint256 amount0, uint256 amount1);
    event Graduated(address indexed token, address artistToken); // Updated event

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the Bonding contract with Limelight-specific parameters.
     */
    function initialize(
        address factory_,
        address router_,
        address feeToTreasury_,
        address feeToSupporters_,
        uint256 feePercentage_,
        uint256 initialSupply_,
        uint256 assetRate_,
        uint256 maxTx_,
        address artistFactory_, // Updated parameter name
        uint256 gradThreshold_,
        address contributionNft_,
        address serviceNft_,
        address governanceDAO_
    ) external initializer {
        __Ownable_init();
        __ReentrancyGuard_init();

        factory = FFactory(factory_);
        router = FRouter(router_);

        _feeToTreasury = feeToTreasury_;
        _feeToSupporters = feeToSupporters_;

        feePercentage = feePercentage_; // e.g., 100 = 1%
        initialSupply = initialSupply_;
        assetRate = assetRate_;
        maxTx = maxTx_;

        artistFactory = artistFactory_; // Updated variable assignment
        gradThreshold = gradThreshold_;

        contributionNft = contributionNft_;
        serviceNft = serviceNft_;
        governanceDAO = governanceDAO_;
    }

    /**
     * @dev Creates a user profile if it doesn't exist.
     */
    function _createUserProfile(address _user) internal returns (bool) {
        address[] memory _tokens;
        Profile memory _profile = Profile({user: _user, tokens: _tokens});
        profile[_user] = _profile;
        profiles.push(_user);
        return true;
    }

    /**
     * @dev Checks if a user profile exists.
     */
    function _checkIfProfileExists(address _user) internal view returns (bool) {
        return profile[_user].user == _user;
    }

    /**
     * @dev Approves token spending.
     */
    function _approval(
        address _spender,
        address _token,
        uint256 amount
    ) internal returns (bool) {
        IERC20(_token).approve(_spender, amount);
        return true;
    }

    /**
     * @dev Setter functions for various parameters.
     */
    function setInitialSupply(uint256 newSupply) external onlyOwner {
        initialSupply = newSupply;
    }

    function setGradThreshold(uint256 newThreshold) external onlyOwner {
        gradThreshold = newThreshold;
    }

    function setFeePercentage(uint256 newFeePercentage) external onlyOwner {
        feePercentage = newFeePercentage;
    }

    function setFeeRecipients(
        address newFeeToTreasury,
        address newFeeToSupporters
    ) external onlyOwner {
        _feeToTreasury = newFeeToTreasury;
        _feeToSupporters = newFeeToSupporters;
    }

    function setMaxTx(uint256 maxTx_) external onlyOwner {
        maxTx = maxTx_;
    }

    function setAssetRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate error");
        assetRate = newRate;
    }

    function setDeployParams(DeployParams memory params) external onlyOwner {
        _deployParams = params;
    }

    /**
     * @dev Retrieves user tokens.
     */
    function getUserTokens(address account) external view returns (address[] memory) {
        require(_checkIfProfileExists(account), "User profile does not exist.");
        Profile memory _profile = profile[account];
        return _profile.tokens;
    }

    /**
     * @dev Launches a new ArtistToken with initial liquidity and profiles.
     */
    function launch(
        string memory _name,
        string memory _ticker,
        uint8[] memory cores,
        string memory desc,
        string memory img,
        string[4] memory urls,
        uint256 purchaseAmount
    ) external nonReentrant returns (address, address, uint256) {
        address assetToken = router.assetToken();
        require(
            IERC20(assetToken).balanceOf(msg.sender) >= purchaseAmount,
            "Insufficient amount"
        );

        uint256 feeAmount = (purchaseAmount * feePercentage) / 10000; // e.g., 100 = 1%
        uint256 initialPurchase = purchaseAmount - feeAmount;

        // Transfer fees
        IERC20(assetToken).safeTransferFrom(msg.sender, _feeToTreasury, feeAmount / 2);
        IERC20(assetToken).safeTransferFrom(msg.sender, _feeToSupporters, feeAmount / 2);

        // Transfer initial purchase to Bonding contract
        IERC20(assetToken).safeTransferFrom(
            msg.sender,
            address(this),
            initialPurchase
        );

        // Mint new ArtistToken
        FERC20 token = new FERC20(
            string.concat("Limelight ", _name),
            _ticker,
            initialSupply,
            maxTx
        );
        uint256 supply = token.totalSupply();

        // Create liquidity pair
        address _pair = factory.createPair(address(token), assetToken);

        // Approve router to spend tokens
        bool approved = _approval(address(router), address(token), supply);
        require(approved, "Approval failed");

        // Calculate liquidity based on assetRate
        uint256 k = ((K * 10000) / assetRate);
        uint256 liquidity = (((k * 10000 ether) / supply) * 1 ether) / 10000;

        // Add initial liquidity
        router.addInitialLiquidity(address(token), supply, liquidity);

        // Initialize token data
        Data memory _data = Data({
            token: address(token),
            name: string.concat("Limelight ", _name),
            _name: _name,
            ticker: _ticker,
            supply: supply,
            price: supply / liquidity,
            marketCap: liquidity,
            liquidity: liquidity * 2,
            volume: 0,
            volume24H: 0,
            prevPrice: supply / liquidity,
            lastUpdated: block.timestamp
        });

        // Store token information
        Token memory tmpToken = Token({
            creator: msg.sender,
            token: address(token),
            artistToken: address(0),
            pair: _pair,
            data: _data,
            description: desc,
            cores: cores,
            image: img,
            twitter: urls[0],
            telegram: urls[1],
            youtube: urls[2],
            website: urls[3],
            trading: true,
            tradingOnUniswap: false
        });
        tokenInfo[address(token)] = tmpToken;
        tokenInfos.push(address(token));

        // Manage user profile
        bool exists = _checkIfProfileExists(msg.sender);
        if (exists) {
            Profile storage _profile = profile[msg.sender];
            _profile.tokens.push(address(token));
        } else {
            bool created = _createUserProfile(msg.sender);
            if (created) {
                Profile storage _profile = profile[msg.sender];
                _profile.tokens.push(address(token));
            }
        }

        uint256 n = tokenInfos.length;

        emit Launched(address(token), _pair, n);

        // Make initial purchase via router
        IERC20(assetToken).approve(address(router), initialPurchase);
        router.buy(initialPurchase, address(token), address(this));
        token.transfer(msg.sender, token.balanceOf(address(this)));

        return (address(token), _pair, n);
    }

    /**
     * @dev Allows users to sell their ArtistToken for asset tokens.
     */
    function sell(uint256 amountIn, address tokenAddress) external returns (bool) {
        require(tokenInfo[tokenAddress].trading, "Token not trading");

        address pairAddress = factory.getPair(tokenAddress, router.assetToken());
        IFPair pair = IFPair(pairAddress);

        (uint256 reserveA, uint256 reserveB) = pair.getReserves();

        (uint256 amount0In, uint256 amount1Out) = router.sell(amountIn, tokenAddress, msg.sender);

        uint256 newReserveA = reserveA + amount0In;
        uint256 newReserveB = reserveB - amount1Out;
        uint256 duration = block.timestamp - tokenInfo[tokenAddress].data.lastUpdated;

        uint256 liquidity = newReserveB * 2;
        uint256 mCap = (tokenInfo[tokenAddress].data.supply * newReserveB) / newReserveA;
        uint256 price = newReserveA / newReserveB;
        uint256 volume = duration > 86400
            ? amount1Out
            : tokenInfo[tokenAddress].data.volume24H + amount1Out;
        uint256 prevPrice = duration > 86400
            ? tokenInfo[tokenAddress].data.price
            : tokenInfo[tokenAddress].data.prevPrice;

        // Update token data
        tokenInfo[tokenAddress].data.price = price;
        tokenInfo[tokenAddress].data.marketCap = mCap;
        tokenInfo[tokenAddress].data.liquidity = liquidity;
        tokenInfo[tokenAddress].data.volume += amount1Out;
        tokenInfo[tokenAddress].data.volume24H = volume;
        tokenInfo[tokenAddress].data.prevPrice = prevPrice;

        if (duration > 86400) {
            tokenInfo[tokenAddress].data.lastUpdated = block.timestamp;
        }

        return true;
    }

    /**
     * @dev Allows users to buy ArtistToken with asset tokens.
     */
    function buy(uint256 amountIn, address tokenAddress) external payable returns (bool) {
        require(tokenInfo[tokenAddress].trading, "Token not trading");

        address pairAddress = factory.getPair(tokenAddress, router.assetToken());
        IFPair pair = IFPair(pairAddress);

        (uint256 reserveA, uint256 reserveB) = pair.getReserves();

        (uint256 amount1In, uint256 amount0Out) = router.buy(amountIn, tokenAddress, msg.sender);

        uint256 newReserveA = reserveA - amount0Out;
        uint256 newReserveB = reserveB + amount1In;
        uint256 duration = block.timestamp - tokenInfo[tokenAddress].data.lastUpdated;

        uint256 liquidity = newReserveB * 2;
        uint256 mCap = (tokenInfo[tokenAddress].data.supply * newReserveB) / newReserveA;
        uint256 price = newReserveA / newReserveB;
        uint256 volume = duration > 86400
            ? amount1In
            : tokenInfo[tokenAddress].data.volume24H + amount1In;
        uint256 _price = duration > 86400
            ? tokenInfo[tokenAddress].data.price
            : tokenInfo[tokenAddress].data.prevPrice;

        // Update token data
        tokenInfo[tokenAddress].data.price = price;
        tokenInfo[tokenAddress].data.marketCap = mCap;
        tokenInfo[tokenAddress].data.liquidity = liquidity;
        tokenInfo[tokenAddress].data.volume += amount1In;
        tokenInfo[tokenAddress].data.volume24H = volume;
        tokenInfo[tokenAddress].data.prevPrice = _price;

        if (duration > 86400) {
            tokenInfo[tokenAddress].data.lastUpdated = block.timestamp;
        }

        // Check if token should graduate
        if (newReserveA <= gradThreshold && tokenInfo[tokenAddress].trading) {
            _openTradingOnUniswap(tokenAddress);
        }

        return true;
    }

    /**
     * @dev Opens trading on Uniswap by graduating the token.
     */
    function _openTradingOnUniswap(address tokenAddress) private {
        FERC20 token_ = FERC20(tokenAddress);
        Token storage _token = tokenInfo[tokenAddress];

        require(_token.trading && !_token.tradingOnUniswap, "Already graduated or trading opened");

        _token.trading = false;
        _token.tradingOnUniswap = true;

        // Transfer asset tokens to bonding contract
        address pairAddress = factory.getPair(tokenAddress, router.assetToken());
        IFPair pair = IFPair(pairAddress);

        uint256 assetBalance = pair.assetBalance();
        uint256 tokenBalance = pair.balance();

        router.graduate(tokenAddress);

        IERC20(router.assetToken()).approve(artistFactory, assetBalance);

        // Updated function call to match `IArtistFactoryV4`
        uint256 id = IArtistFactoryV4(artistFactory).initFromToken(
            address(token_),
            _token.data._name,
            _token.data.ticker,
            _token.cores,
            _deployParams.tbaSalt,
            _deployParams.tbaImplementation,
            _deployParams.daoVotingPeriod,
            _deployParams.daoThreshold,
            assetBalance
        );

        address artistToken = IArtistFactoryV4(artistFactory).executeTokenApplication(
            id,
            _token.data.supply,
            tokenBalance,
            pairAddress
        );

        _token.artistToken = artistToken; // Updated variable assignment

        router.approval(
            pairAddress,
            artistToken,
            address(this),
            IERC20(artistToken).balanceOf(pairAddress)
        );

        token_.burnFrom(pairAddress, tokenBalance);

        emit Graduated(tokenAddress, artistToken);
    }

    /**
     * @dev Unwraps tokens post-graduation, allowing users to claim their artist tokens.
     */
    function unwrapToken(address srcTokenAddress, address[] memory accounts) external {
        Token memory info = tokenInfo[srcTokenAddress];
        require(info.tradingOnUniswap, "Token is not graduated yet");

        FERC20 token = FERC20(srcTokenAddress);
        IERC20 artistToken = IERC20(info.artistToken);
        address pairAddress = factory.getPair(srcTokenAddress, router.assetToken());

        for (uint256 i = 0; i < accounts.length; i++) {
            address acc = accounts[i];
            uint256 balance = token.balanceOf(acc);
            if (balance > 0) {
                token.burnFrom(acc, balance);
                artistToken.transferFrom(pairAddress, acc, balance);
            }
        }
    }
}

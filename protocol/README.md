Limelight Protocol Details (MVP)
Contract	Purpose	Access Control	Upgradable
LMLTToken	Core utility token of the Limelight ecosystem, used for staking, trading, and governance.	Ownable	N
ArtistFactory	Handles the application, instantiation, and management of new artist tokens. References bonding curve, treasury, and governance implementation.	Roles: DEFAULT_ADMIN_ROLE, ARTIST_CREATOR_ROLE	Y
ArtistToken	Represents fungible tokens for individual artists (e.g., LJBR for Lil JBR). Minted upon recognition.	-	N
RecognitionPool	Manages the staking of LMLT for and against an artist’s recognition status. Maintains separate "Recognition" and "No Recognition" pools.	-	Y
BondingCurve	Implements the bonding curve for pricing artist tokens based on supply and demand.	-	N
LiquidityPool	Pairs artist tokens with LMLT to enable trading.	-	N
Treasury	Collects transaction fees and manages funds for protocol sustainability, buybacks, and liquidity.	Roles: TREASURY_ADMIN_ROLE, GOVERNANCE_ROLE	Y
GovernanceDAO	Manages governance proposals and voting for protocol-wide decisions.	Roles: GOVERNANCE_ROLE	N
ArtistDAO	Decentralized governance for each artist token. Allows token holders to vote on artist-specific decisions (e.g., future releases or collaborations).	-	Y
RewardDistribution	Handles the distribution of rewards from transaction fees and treasury earnings.	Roles: REWARD_ADMIN_ROLE, TOKEN_SAVER_ROLE	Y
StakingContract	Allows users to stake LMLT to earn rewards or participate in artist governance.	Roles: GOVERNANCE_ROLE, STAKER_ROLE	N
Main Activities (MVP)
Artist Genesis
Submit an application at ArtistFactory.
LMLT is transferred to the factory as a stake.
Propose at GovernanceDAO to initiate recognition voting.
RecognitionPool is created with "Recognition" and "No Recognition" pools.
Voting begins at RecognitionPool:
Users stake LMLT to vote for or against the artist's recognition.
When the Recognition Pool wins:
ArtistToken is minted.
BondingCurve is initialized.
A LiquidityPool is created for the artist token paired with LMLT.
Fee Structure
Transaction Fees:

Trades involving artist tokens incur a 1% fee:
50%: Rewards artists and their projects.
30%: Allocated to the Limelight treasury.
20%: Rewarded to early supporters.
Treasury Usage:

Funds are used for:
Adding liquidity to artist tokens.
Supporting protocol operations and development.
Buying back and burning LMLT to reduce supply.
Staking and Governance
Users stake LMLT in the StakingContract to:
Earn rewards from the protocol treasury.
Gain governance rights in ArtistDAO or GovernanceDAO.
Governance proposals:
Protocol-wide proposals (e.g., fee adjustments, treasury usage) are submitted to GovernanceDAO.
Artist-specific proposals (e.g., collaborations, content releases) are managed via ArtistDAO.
Liquidity and Bonding Curve Management
Users purchase artist tokens via the BondingCurve.
The price dynamically adjusts based on supply.
Fees from transactions are collected by the Treasury:
50%: Rewards artists and token holders.
30%: Allocated to protocol operations.
20%: Reserved for buybacks or liquidity addition.
LiquidityPool pairs artist tokens with LMLT:
Ensures seamless trading for token holders.

# Main Activities
## VIRTUAL Genesis
1. Submit a new application at **AgentFactory** 
	a. It will transfer VIRTUAL to AgentFactory
2. Propose at **VirtualGenesisDAO** (action = ```VirtualFactory.executeApplication``` )
3. Start voting at **VirtualGenesisDAO**
4. Execute proposal at  **VirtualGenesisDAO**  , it will do following:
	a. Clone **AgentToken**
	b. Clone **AgentDAO**
	c. Mint **AgentNft**
	d. Stake VIRTUAL -> $PERSONA (depending on the symbol sent to application)
	e. Create **TBA** with **AgentNft**
	

## Submit Contribution
1. Create proposal at **AgentDAO** (action = ServiceNft.mint)
2. Mint **ContributionNft** , it will authenticate by checking whether sender is the proposal's proposer.


## Upgrading Core
1. Validator vote for contribution proposal at **AgentDAO**
2. Execute proposal at **AgentDAO**, it will mint a **ServiceNft**, and trigger following actions:
	a. Update maturity score
	b. Update VIRTUAL core service id.


## Distribute Reward
1. On daily basis, protocol backend will conclude daily profits into a single amount.
2. Protocol backend calls **AgentReward**.distributeRewards , triggering following:
	a. Transfer VIRTUAL into **AgentReward** 
	b. Account & update claimable amounts for: Protocol, Stakers, Validators, Dataset Contributors, Model Contributors
	
	
## Claim Reward
1. Protocol calls **AgentReward**.withdrawProtocolRewards
2. Stakers, Validators, Dataset Contributors, Model Contributors calls **AgentReward**.claimAllRewards


## Staking VIRTUAL
1. Call **AgentToken**.stake , pass in the validator that you would like to delegate your voting power to. It will take in sVIRTUAL and mint $*PERSONA* to you.
2. Call **AgentToken**.withdraw to withdraw , will burn your $*PERSONA* and return sVIRTUAL to you.


Introduction
Limelight is a decentralized platform that empowers artists by enabling fans and supporters to directly influence and support their journey. Using LMLT, the platform's native token, and artist-specific tokens, Limelight fosters a transparent and fair system for artists to achieve recognition, release music, and engage with their community.

Core Components
1. LMLT (Limelight Token)
Overview
LMLT is the native utility token of the Limelight platform.
It acts as the primary medium for:
Supporting artists.
Accessing exclusive features and content.
Participating in governance and voting.
Facilitating transactions, such as buying artist tokens and accessing virtual concerts.
Tokenomics
Total supply: Fixed and capped at launch.
Utilities:
Purchase artist tokens through bonding curves.
Access premium features, such as exclusive content, voting, and virtual shows.
Staking to earn rewards or participate in governance.
Payment for fees on trades, music releases, and other services.
Role in the Ecosystem
Exclusivity: Artist tokens are paired exclusively with LMLT, ensuring its central role in the platform.
Treasury Funding: Fees collected in LMLT sustain the platform and provide rewards to artists and early supporters.
2. Artist Tokens
Overview
Each artist on Limelight has their own fungible token (e.g., LJBR for Lil JBR).
These tokens represent the artist’s presence on the platform and are used for:
Voting and governance related to the artist.
Accessing exclusive content and experiences.
Trading and speculation by fans and supporters.
Issuance Mechanism
Artist tokens are minted upon achieving recognition status through a platform-wide voting system.
Bonding Curve
Artist tokens are priced dynamically through a bonding curve:
Recognition Pool Price:
𝑃
𝑅
(
𝑆
𝑅
,
𝑆
𝑁
𝑅
)
=
𝑘
𝑅
𝑆
𝑅
+
𝑏
𝑅
+
𝛼
𝑆
𝑁
𝑅
P 
R
​
 (S 
R
​
 ,S 
NR
​
 )=k 
R
​
 S 
R
​
 +b 
R
​
 +αS 
NR
​
 
No Recognition Pool Price:
𝑃
𝑁
𝑅
(
𝑆
𝑁
𝑅
,
𝑆
𝑅
)
=
𝑘
𝑁
𝑅
𝑆
𝑁
𝑅
+
𝑏
𝑁
𝑅
+
𝛽
𝑆
𝑅
P 
NR
​
 (S 
NR
​
 ,S 
R
​
 )=k 
NR
​
 S 
NR
​
 +b 
NR
​
 +βS 
R
​
 
𝑆
𝑅
S 
R
​
 : Supply in the "Recognition" pool.
𝑆
𝑁
𝑅
S 
NR
​
 : Supply in the "No Recognition" pool.
𝑘
,
𝑏
,
𝛼
,
𝛽
k,b,α,β: Curve parameters that adjust price dynamics and cross-pool influence.
Core Features
1. Voting and Recognition
Recognition Pools
Fans stake LMLT in one of two pools:
Recognition Pool: Supports the artist’s recognition.
No Recognition Pool: Opposes recognition.
Sentiment Calculation
The ratio of the two pools determines the artist’s recognition status:
Recognition Ratio
=
𝑆
𝑅
𝑆
𝑅
+
𝑆
𝑁
𝑅
Recognition Ratio= 
S 
R
​
 +S 
NR
​
 
S 
R
​
 
​
 
If the Recognition Ratio exceeds 50%, the artist achieves recognition.
Outcomes
Recognition Achieved:
Artist token is minted (e.g., LJBR).
Bonding curve and liquidity pool are established.
The artist progresses to the first tier of the record label-inspired system.
Recognition Denied:
Supporters in the "Recognition Pool" can reclaim their stake.
2. Record Label-Inspired Tiers
As the artist’s token market cap grows, they unlock new features and tools:

Tier 1: Independent Artist
Milestone: Token launch on the bonding curve.
Unlocks:
Artist profile setup.
Fans can trade and support the artist by purchasing tokens.
Tier 2: Bedroom Studio ($4.2k Market Cap)
Unlocks:
Release up to 3 tracks on Limelight’s platform.
Access to a community forum for fan interactions.
Tier 3: Indie Label ($42k Market Cap)
Unlocks:
Release an EP with optional NFT integration.
Community-driven voting for creative decisions.
Token-gated merch store.
Tier 4: Major Label ($420k Market Cap)
Unlocks:
Full album release.
Virtual concert hosting in Limelight’s metaverse.
Collaboration with other artists.
Tier 5: Touring Artist ($4.2M Market Cap)
Unlocks:
Global virtual tours.
Distribution to major streaming platforms.
Exclusive virtual backstage passes for top token holders.
Tier 6: Superstar ($42M Market Cap)
Unlocks:
Custom virtual venue in the metaverse.
Licensing opportunities for media projects.
Revenue-sharing for top token holders.
Tier 7: Global Icon ($126M Market Cap)
Unlocks:
On-chain wallet for creative projects.
Fully immersive virtual world for fan engagement.
Decentralized governance shared between the artist and top token holders.
3. Fee Structure
Transaction Fees
Trades involving artist tokens incur a 1% tax:
50%: Supports artist development and activities.
30%: Added to the Limelight treasury.
20%: Rewarded to early supporters.
Treasury Usage
Treasury funds are used for:
Adding liquidity to artist tokens.
Buying back and burning LMLT to reduce supply.
Supporting platform development and operations.
4. Governance and Validation
Artist-Led Validation
Once recognized, artists gain primary governance power over their tokens.
They can propose decisions like upgrades, collaborations, or special projects.
Community Participation
Early supporters hold proportional governance power.
Decisions are validated through weighted voting:
50% power: Artist.
50% power: Early token holders.
Workflow Example
Lil JBR’s Journey on Limelight
Launch:

Lil JBR launches LJBR on the bonding curve.
Fans stake LMLT to acquire LJBR, funding his early career.
$4.2k Market Cap:

Lil JBR releases 3 tracks and starts engaging fans in the forum.
$420k Market Cap:

Lil JBR releases a full album and hosts a virtual concert.
$42M Market Cap:

Lil JBR creates a custom virtual venue and licenses his music for a video game.
$126M Market Cap:

Lil JBR manages his own on-chain wallet and launches a metaverse world for fans.
Conclusion
Limelight provides a decentralized, transparent, and scalable ecosystem for artists and fans. By leveraging LMLT as the backbone and introducing artist-specific tokens with fair governance and incentives, Limelight redefines the way artists achieve recognition, engage with fans, and grow their careers.


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ShareSwapNFT
 * @author RazzShares (https://x.com/Razzshares)
 * @notice ERC-721 NFT contract for the ShareSwap dApp on ARC Testnet
 * @dev Supports caller-supplied tokenURIs (stored on IPFS via Pinata).
 *      Mint price is configurable by owner. Free mint on testnet by default.
 *
 * Deploy on ARC Testnet (Chain ID: 5042002):
 *   npx hardhat run scripts/deploy.js --network arcTestnet
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ShareSwapNFT is
    ERC721URIStorage,
    ERC721Enumerable,
    Ownable,
    ReentrancyGuard
{
    using Counters for Counters.Counter;

    // ── Storage ──────────────────────────────────────────────────────────────
    Counters.Counter private _tokenIds;

    /// @notice Mint price in USDC (6 decimals). 0 = free mint.
    uint256 public mintPrice;

    /// @notice Maximum supply (0 = unlimited)
    uint256 public maxSupply;

    // ── Events ───────────────────────────────────────────────────────────────
    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintPriceUpdated(uint256 newPrice);

    // ── Constructor ───────────────────────────────────────────────────────────
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 mintPrice_,
        uint256 maxSupply_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        mintPrice = mintPrice_;
        maxSupply = maxSupply_;
    }

    // ── Mint ─────────────────────────────────────────────────────────────────

    /**
     * @notice Mint a new NFT with a caller-supplied metadata URI
     * @param tokenURI_ IPFS URI pointing to the NFT metadata JSON
     * @return tokenId The newly minted token ID
     */
    function mint(string calldata tokenURI_)
        external
        payable
        nonReentrant
        returns (uint256 tokenId)
    {
        require(bytes(tokenURI_).length > 0, "ShareSwapNFT: empty tokenURI");
        if (maxSupply > 0) {
            require(totalSupply() < maxSupply, "ShareSwapNFT: max supply reached");
        }
        if (mintPrice > 0) {
            require(msg.value >= mintPrice, "ShareSwapNFT: insufficient payment");
        }

        _tokenIds.increment();
        tokenId = _tokenIds.current();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit Minted(msg.sender, tokenId, tokenURI_);

        // Refund excess payment
        if (msg.value > mintPrice && mintPrice > 0) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
    }

    // ── View helpers ─────────────────────────────────────────────────────────

    /**
     * @notice Return all token IDs owned by `owner`
     */
    function tokensOfOwner(address owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 count = balanceOf(owner);
        uint256[] memory ids = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            ids[i] = tokenOfOwnerByIndex(owner, i);
        }
        return ids;
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    /**
     * @notice Update the mint price (owner only)
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }

    /**
     * @notice Withdraw collected fees to owner
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "ShareSwapNFT: nothing to withdraw");
        payable(owner()).transfer(balance);
    }

    // ── Required overrides (ERC721URIStorage + ERC721Enumerable) ─────────────

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AvengersNFT is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    string[] avengers = [
        "im1.json",
        "im2.json",
        "im3.json",
        "im4.json",
        "im5.json",
        "cap1.json",
        "cap2.json",
        "cap3.json",
        "cap4.json",
        "cap5.json",
        "thor1.json",
        "thor2.json",
        "thor3.json",
        "thor4.json",
        "doc1.json",
        "doc2.json",
        "doc3.json",
        "doc4.json",
        "spider1.json",
        "spider2.json",
        "spider3.json",
        "widow1.json",
        "widow2.json",
        "widow3.json",
        "panther1.json",
        "panther2.json",
        "panther3.json"
    ];

    constructor() ERC721("AvengersNFT", "AVG") {}

    event getToken(address indexed _from, uint256 _value);

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.io/ipfs/bafybeid4i7ich5ht72gzbs257kv2wvduxzz42woezfbrw7trcnnbv47vae/";
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(uint256 random) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, avengers[random]);
        emit getToken(msg.sender, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
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
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

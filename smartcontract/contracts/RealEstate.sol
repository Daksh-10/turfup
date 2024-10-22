//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract RealEstate is ERC1155 {
    uint256 public currentPropertyId = 0; // Property ID counter
    address public owner; // Contract owner
    // Mapping to track total fractional tokens for each property
    mapping(uint256 => uint256) public totalTokensPerProperty;
    mapping(uint256 => uint256) public priceOfTokenPerProperty;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() ERC1155("http://localhost:5000/api/properties/{id}") {
        owner = msg.sender;
    }

    // Function to create a property and fractionalize it into 'n' tokens
    function createProperty(
        uint256 n,
        uint256 price
    ) external returns (uint256) {
        require(n > 0, "Number of fractional tokens must be greater than 0");

        // Increment property ID
        uint256 newPropertyId = ++currentPropertyId;

        // Mint 'n' fractional tokens for the new property to the owner
        _mint(msg.sender, newPropertyId, n, "");

        // Store total tokens for this property
        totalTokensPerProperty[newPropertyId] = n;
        priceOfTokenPerProperty[newPropertyId] = price;
        return newPropertyId;
    }

    // Function to transfer fractional tokens of a property
    function transferFractionalTokens(
        address from,
        address to,
        uint256 propertyId,
        uint256 amount
    ) external {
        require(balanceOf(from, propertyId) >= amount, "Insufficient balance");

        // Safe transfer of fractional tokens
        safeTransferFrom(from, to, propertyId, amount, "");
    }

    // Function to get total tokens for a property
    function getTotalTokens(
        uint256 propertyId
    ) external view returns (uint256) {
        return totalTokensPerProperty[propertyId];
    }

    // Batch transfer function (transfers multiple token IDs)
    function batchTransfer(
        address from,
        address to,
        uint256[] memory propertyIds,
        uint256[] memory amounts
    ) external {
        safeBatchTransferFrom(from, to, propertyIds, amounts, "");
    }
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC1155 {
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;
}

contract Escrow {
    address public sftAddress;
    address payable public owner;
    address public inspector;

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public tokensPerProperty;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address[]) public buyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }

    constructor(
        address _sftAddress,
        address payable _owner,
        address _inspector
    ) {
        sftAddress = _sftAddress;
        owner = _owner;
        inspector = _inspector;
    }

    function list(
        uint256 _sftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        uint256 _totalTokens
    ) public {
        IERC1155(sftAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _sftID,
            _totalTokens,
            ""
        );
        isListed[_sftID] = true;
        purchasePrice[_sftID] = _purchasePrice;
        escrowAmount[_sftID] = _escrowAmount;
        tokensPerProperty[_sftID] = _totalTokens;
        // for save transfer the owner needs to approve the escrow contract through this function setApprovalForAll(address _operator, bool _approved) external;
    }

    function depositEarnest(uint256 _sftID) public payable {
        require(
            msg.value >= escrowAmount[_sftID] &&
                msg.value % escrowAmount[_sftID] == 0,
            "Insufficient earnest amount"
        );
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function updateInspectionStatus(
        uint256 _propertyId,
        bool _passed
    ) public onlyInspector {
        inspectionPassed[_propertyId] = _passed;
    }

    function approveSale(uint256 _propertyId) public {
        approval[_propertyId][msg.sender] = true;
    }

    function finalizeSale(uint256 _propertyId) public {
        require(inspectionPassed[_propertyId], "Inspection not passed");
        require(approval[_propertyId][msg.sender], "Buyer not approved");
        require(approval[_propertyId][owner], "Owner not approved");
        // require(approval[_propertyId][lender], "Lender not approved");
        require(
            address(this).balance >= purchasePrice[_propertyId],
            "Insufficient funds"
        );

        isListed[_propertyId] = false;

        (bool success, ) = payable(owner).call{value: address(this).balance}(
            ""
        );
        require(success, "Transfer to seller failed");

        IERC1155(sftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            _propertyId,
            tokensPerProperty[_propertyId],
            ""
        );
    }
}

// contract Escrow is ERC1155Holder {
//     address public realEstateContract;
//     address payable public seller;
//     address public inspector;
//     address public lender;

//     modifier onlyBuyer(uint256 _propertyId) {
//         require(
//             msg.sender == buyer[_propertyId],
//             "Only buyer can call this method"
//         );
//         _;
//     }

//     modifier onlySeller() {
//         require(msg.sender == seller, "Only seller can call this method");
//         _;
//     }

//     modifier onlyInspector() {
//         require(msg.sender == inspector, "Only inspector can call this method");
//         _;
//     }

//     mapping(uint256 => bool) public isListed;
//     mapping(uint256 => uint256) public purchasePrice;
//     mapping(uint256 => uint256) public escrowAmount;
//     mapping(uint256 => address) public buyer;
//     mapping(uint256 => bool) public inspectionPassed;
//     mapping(uint256 => mapping(address => bool)) public approval;
//     mapping(uint256 => uint256) public tokenAmount;

//     constructor(
//         address _realEstateContract,
//         address payable _seller,
//         address _inspector,
//         address _lender
//     ) {
//         realEstateContract = _realEstateContract;
//         seller = _seller;
//         inspector = _inspector;
//         lender = _lender;
//     }

//     function list(
//         uint256 _propertyId,
//         address _buyer,
//         uint256 _purchasePrice,
//         uint256 _escrowAmount,
//         uint256 _tokenAmount
//     ) public onlySeller {
//         IERC1155(realEstateContract).safeTransferFrom(
//             msg.sender,
//             address(this),
//             _propertyId,
//             _tokenAmount,
//             ""
//         );

//         isListed[_propertyId] = true;
//         purchasePrice[_propertyId] = _purchasePrice;
//         escrowAmount[_propertyId] = _escrowAmount;
//         buyer[_propertyId] = _buyer;
//         tokenAmount[_propertyId] = _tokenAmount;
//     }

//     function depositEarnest(
//         uint256 _propertyId
//     ) public payable onlyBuyer(_propertyId) {
//         require(
//             msg.value >= escrowAmount[_propertyId],
//             "Insufficient earnest amount"
//         );
//     }

//     function updateInspectionStatus(
//         uint256 _propertyId,
//         bool _passed
//     ) public onlyInspector {
//         inspectionPassed[_propertyId] = _passed;
//     }

//     function approveSale(uint256 _propertyId) public {
//         approval[_propertyId][msg.sender] = true;
//     }

//     function finalizeSale(uint256 _propertyId) public {
//         require(inspectionPassed[_propertyId], "Inspection not passed");
//         require(
//             approval[_propertyId][buyer[_propertyId]],
//             "Buyer not approved"
//         );
//         require(approval[_propertyId][seller], "Seller not approved");
//         require(approval[_propertyId][lender], "Lender not approved");
//         require(
//             address(this).balance >= purchasePrice[_propertyId],
//             "Insufficient funds"
//         );

//         isListed[_propertyId] = false;

//         (bool success, ) = payable(seller).call{value: address(this).balance}(
//             ""
//         );
//         require(success, "Transfer to seller failed");

//         IERC1155(realEstateContract).safeTransferFrom(
//             address(this),
//             buyer[_propertyId],
//             _propertyId,
//             tokenAmount[_propertyId],
//             ""
//         );
//     }

//     function cancelSale(uint256 _propertyId) public {
//         if (!inspectionPassed[_propertyId]) {
//             payable(buyer[_propertyId]).transfer(address(this).balance);
//         } else {
//             payable(seller).transfer(address(this).balance);
//         }
//     }

//     receive() external payable {}

//     function getBalance() public view returns (uint256) {
//         return address(this).balance;
//     }
// }

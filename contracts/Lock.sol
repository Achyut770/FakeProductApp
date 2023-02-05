// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract FakeProductIdentifier {
    struct Product {
        string description;
        address[] pastOwners;
        address currentOwner;
        address manufacturer;
    }

    // events
    event SubscriptionEvent(address indexed subscriber, uint indexed from, uint indexed to);
    event AddedProduct(address indexed seller, uint id);

    // mappings
    mapping(address => mapping(uint => Product)) private productDetails;
    mapping(address => uint) private subscriptionDetails;
    mapping(address => uint) private productCounts;

    // Errors
    error SubscriptionExpired();
    error OwnershipTransferDenied();
    error PaymentTooLow();

    // Functions
    function getProductDetails(address manufacturer, uint productId) external view returns (Product memory) {
        return productDetails[manufacturer][productId];
    }

    function getProductCount(address manufacturer) external view returns (uint) {
        return productCounts[manufacturer];
    }

    function getSubscriptionDetails(address _addr) external view returns (uint) {
        return subscriptionDetails[_addr];
    }

    function subscribe() external payable {
        if (msg.value < 100000000000) {
            revert PaymentTooLow();
        }
        uint from;
        uint to;
        if (subscriptionDetails[msg.sender] > block.timestamp) {
            from = subscriptionDetails[msg.sender];
            to = subscriptionDetails[msg.sender] + 3 * msg.value / 100000000000;
        } else {
            from = block.timestamp;
            to = block.timestamp + 3 * msg.value / 100000000000;
        }
        subscriptionDetails[msg.sender] = to;
        emit SubscriptionEvent(msg.sender, from, to);
    }

    function addProduct(string memory descriptionUrl) external {
        if (subscriptionDetails[msg.sender] < block.timestamp) {
            revert SubscriptionExpired();
        }
        uint productId = productCounts[msg.sender];
        Product storage individualProduct = productDetails[msg.sender][productId];
        individualProduct.manufacturer = msg.sender;
        individualProduct.description = descriptionUrl;
        individualProduct.currentOwner = msg.sender;
        emit AddedProduct(msg.sender, productId);
        productCounts[msg.sender]++;
    }

    function transferOwnership(address nextOwner, address manufacturer, uint productId) external {
        Product storage individualProduct = productDetails[manufacturer][productId];
        if (individualProduct.currentOwner != msg.sender || individualProduct.currentOwner == nextOwner) {
            revert OwnershipTransferDenied();
        }
        individualProduct.pastOwners.push(individualProduct.currentOwner);
        individualProduct.currentOwner = nextOwner;
    }
}

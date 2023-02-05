// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract FakeProductIdentifier {
 struct Product {
       string description;
       address[] pastOwner;
       address currentOwner;
       address manufacturer;
    }

    //events
    event Subscriptionevent(address indexed subscriber , uint indexed from , uint indexed to);
    event AddedProperty(address indexed seller , uint id);



    mapping(address => mapping (uint => Product)) private Productdetails;
    mapping(address => uint)  private subscriptionDetails;
    mapping(address=> uint) private productCount;

    //Errors
    error SubscriptionEpired();
    error Denied();
    error notEnough();



//  Functions...

function getProductDetails(address _manufacture , uint productId)  view external returns (Product memory){
return Productdetails[_manufacture][productId];
}
function getProductCount(address _manufacture ) view external returns (uint){
return productCount[_manufacture];
}
function getSubscriptionDetailst(address _add ) view external returns (uint){
return subscriptionDetails[_add];
}

function Subscription() external payable {
    if(msg.value<100000000000){
revert notEnough();
    }
    uint from;
    uint to;
    if(subscriptionDetails[msg.sender]  >block.timestamp){
         from = subscriptionDetails[msg.sender];
         to = subscriptionDetails[msg.sender]+3*msg.value/100000000000 ;
    }else{
         from = block.timestamp;
         to = block.timestamp+3*msg.value/100000000000 ;
    }
    subscriptionDetails[msg.sender]= to ;
    emit Subscriptionevent(msg.sender ,from, to);
}


    function addProduct( string calldata descriptionUrl ) external {
        if(subscriptionDetails[msg.sender] < block.timestamp){
            revert SubscriptionEpired();
        }
        uint productId = productCount[msg.sender];
        Product storage indvProduct = Productdetails[msg.sender][productId];
        indvProduct.manufacturer=msg.sender;
        indvProduct.description=descriptionUrl;
        indvProduct.currentOwner=msg.sender;   
        emit AddedProperty(msg.sender , productId);
        productCount[msg.sender]++; 
        
    }

    function transferOwnerShip (address nextOwner , address _manufacturer , uint productId) external {
      Product storage indvProduct = Productdetails[_manufacturer][productId];
      if(indvProduct.currentOwner!=msg.sender || indvProduct.currentOwner==nextOwner){
          revert Denied();
      }
        indvProduct.pastOwner.push(indvProduct.currentOwner);
        indvProduct.currentOwner=nextOwner;
    }

  
}
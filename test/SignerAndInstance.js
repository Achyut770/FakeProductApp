const { ethers } = require("hardhat");

const BeforeEach = async () => {
  let [owner, addr1, addr2] = await ethers.getSigners();
  let FakeProductIdentifier = await ethers.getContractFactory(
    "FakeProductIdentifier"
  );
  let FakeProductIdentifierDeployed = await FakeProductIdentifier.deploy();
  await FakeProductIdentifierDeployed.deployed();
  return { owner, addr1, addr2, FakeProductIdentifierDeployed };
};

module.exports = BeforeEach;

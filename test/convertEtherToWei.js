const { ethers } = require("ethers");

const convertEtherToWei = (weiValue) => {
  return ethers.utils.parseEther(weiValue);
};

module.exports = convertEtherToWei;

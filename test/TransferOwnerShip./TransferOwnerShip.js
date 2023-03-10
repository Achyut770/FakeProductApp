const { expect } = require("chai");
const BeforeEach = require("../SignerAndInstance");
const convertEtherToWei = require("../convertEtherToWei");

const TransferOwnerShip = () => {
  let addr1;
  let owner;
  let FakeProductIdentifierDeployed;
  beforeEach(async () => {
    ({ addr1, owner, FakeProductIdentifierDeployed } = await BeforeEach());
    await FakeProductIdentifierDeployed.connect(addr1).subscribe({
      value: convertEtherToWei("0.0001"),
    });
    await FakeProductIdentifierDeployed.connect(addr1).addProduct("Achyut");
  });

  it("Revert when the caller isnot the current owner", async () => {
    await expect(
      FakeProductIdentifierDeployed.transferOwnership(
        owner.address,
        addr1.address,
        0
      )
    ).to.be.revertedWithCustomError(
      FakeProductIdentifierDeployed,
      "OwnershipTransferDenied"
    );
  });
  it("The struct should be updated", async () => {
    await FakeProductIdentifierDeployed.connect(addr1).transferOwnership(
      owner.address,
      addr1.address,
      0
    );

    const res = await FakeProductIdentifierDeployed.getProductDetails(
      addr1.address,
      0
    );
    expect(res[0]).to.equal("Achyut");
    expect(res[1][0]).to.equal(addr1.address);
    expect(res[2]).to.equal(owner.address);
    expect(res[3]).to.equal(addr1.address);

    //Now past oewner cannot call the transferOwnership ....

    await expect(
      FakeProductIdentifierDeployed.connect(addr1).transferOwnership(
        owner.address,
        addr1.address,
        0
      )
    ).to.be.revertedWithCustomError(
      FakeProductIdentifierDeployed,
      "OwnershipTransferDenied"
    );
  });
};

module.exports = TransferOwnerShip;

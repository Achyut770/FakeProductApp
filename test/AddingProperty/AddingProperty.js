const { expect } = require("chai");
const BeforeEach = require("../SignerAndInstance");
const convertEtherToWei = require("../convertEtherToWei");

const AddingProperty = () => {
  let addr1;

  let FakeProductIdentifierDeployed;
  beforeEach(async () => {
    ({ addr1, FakeProductIdentifierDeployed } = await BeforeEach());
  });
  it("Should revert When Not Subscribed", async () => {
    await expect(
      FakeProductIdentifierDeployed.addProduct("Achyut")
    ).to.be.revertedWithCustomError(
      FakeProductIdentifierDeployed,
      "SubscriptionEpired"
    );
  });
  it("Item Should be added when Subscribed and Struct should be updated", async () => {
    await FakeProductIdentifierDeployed.connect(addr1).Subscription({
      value: convertEtherToWei("0.0001"),
    });
    await FakeProductIdentifierDeployed.connect(addr1).addProduct("Achyut");

    const res = await FakeProductIdentifierDeployed.getProductDetails(
      addr1.address,
      0
    );

    expect(res[0]).to.equal("Achyut");
    expect(res[1].length).to.equal(0);
    expect(res[3]).to.equal(addr1.address);
    expect(res[2]).to.equal(addr1.address);
    // expect(res[2]).to.equal(addr1.address);
  });
  it("Event should be updated and productCount Should be added", async () => {
    await FakeProductIdentifierDeployed.connect(addr1).Subscription({
      value: convertEtherToWei("0.0001"),
    });
    await expect(
      FakeProductIdentifierDeployed.connect(addr1).addProduct("Achyut")
    )
      .to.emit(FakeProductIdentifierDeployed, "AddedProperty")
      .withArgs(addr1.address, 0);
    const res = await FakeProductIdentifierDeployed.getProductCount(
      addr1.address
    );
    expect(res).to.equal(1);
  });
};

module.exports = AddingProperty;

const { expect } = require("chai");
const BeforeEach = require("../SignerAndInstance");
const convertEtherToWei = require("../convertEtherToWei");

const Subscription = () => {
  let addr1;
  let FakeProductIdentifierDeployed;
  beforeEach(async () => {
    ({ addr1, FakeProductIdentifierDeployed } = await BeforeEach());
  });
  it("Revert when the amount is send as is less then specified", async () => {
    await expect(
      FakeProductIdentifierDeployed.Subscription()
    ).to.be.revertedWithCustomError(FakeProductIdentifierDeployed, "notEnough");
  });
  it("Balances of addr1 and contract be updated ", async () => {
    await expect(
      FakeProductIdentifierDeployed.connect(addr1).Subscription({
        value: convertEtherToWei("1"),
      })
    ).to.changeEtherBalances(
      [FakeProductIdentifierDeployed.address, addr1],
      [convertEtherToWei("1"), convertEtherToWei("-1")]
    );
  });
  it(" event should be updated (When currentTime is more then the the previously Subscribed Time)", async () => {
    // getting timestamp
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp + 1; // +1 because Subscription is called after one second .
    await expect(
      FakeProductIdentifierDeployed.connect(addr1).Subscription({
        value: convertEtherToWei("0.0000001"),
      })
    )
      .to.emit(FakeProductIdentifierDeployed, "Subscriptionevent")
      .withArgs(addr1.address, timestampBefore, timestampBefore + 3);
  });
  it(" Struct should be updated (When currentTime is more then the the previously Subscribed Time)", async () => {
    await FakeProductIdentifierDeployed.connect(addr1).Subscription({
      value: convertEtherToWei("0.0000001"),
    });
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;

    const res = await FakeProductIdentifierDeployed.getSubscriptionDetailst(
      addr1.address
    );
    expect(res).to.equal(timestampBefore + 3);
  });

  describe("When currentTime is less then the the previously Subscribed Time ", () => {
    beforeEach(async () => {
      await FakeProductIdentifierDeployed.connect(addr1).Subscription({
        value: convertEtherToWei("0.0000001"),
      });
    });

    it(" event should be update", async () => {
      // getting timestamp
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);
      const timestampBefore = blockBefore.timestamp; // This is the timeStamp of The block of line 55
      await expect(
        FakeProductIdentifierDeployed.connect(addr1).Subscription({
          value: convertEtherToWei("0.0000001"),
        })
      )
        .to.emit(FakeProductIdentifierDeployed, "Subscriptionevent")
        .withArgs(addr1.address, timestampBefore + 3, timestampBefore + 6);
    });
    it(" Struct should be updated ", async () => {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);
      const timestampBefore = blockBefore.timestamp;
      await FakeProductIdentifierDeployed.connect(addr1).Subscription({
        value: convertEtherToWei("0.0000001"),
      });

      const res = await FakeProductIdentifierDeployed.getSubscriptionDetailst(
        addr1.address
      );
      expect(res).to.equal(timestampBefore + 6);
    });
  });
};

module.exports = Subscription;

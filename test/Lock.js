const { erhers } = require("hardhat");
const Subscription = require("./Subscription/Subscription");
const { expect } = require("chai");
const AddingProperty = require("./AddingProperty/AddingProperty");
const TransferOwnerShip = require("./TransferOwnerShip./TransferOwnerShip");

describe("Lock", function () {
  describe("Subscription", Subscription);
  describe("AddingProperty", AddingProperty);
  describe("TransferringOwnership", TransferOwnerShip);
});

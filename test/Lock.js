const { erhers } = require("hardhat");
const Subscription = require("./Subscription/Subscription");
const { expect } = require("chai");
const AddingProduct = require("./AddingProduct/AddingProduct");
const TransferOwnerShip = require("./TransferOwnerShip./TransferOwnerShip");

describe("Lock", function () {
  describe("Subscription", Subscription);
  describe("AddingProduct", AddingProduct);
  describe("TransferringOwnership", TransferOwnerShip);
});

const { expect } = require("chai");

require("../src/system/extensions/array")();

describe("array", () => {
    it("async foreach exists", async () => {
        expect([].forEachAsync).to.be.ok;
    });
});
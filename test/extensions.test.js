const { expect } = require("chai");

require("../src/system/extensions/array")();
require("../src/system/extensions/promise")();

describe("extensions", () => {
    describe("array", () => {
        it("async foreach exists", async () => {
            expect([].forEachAsync).to.be.ok;
        });
    });

    describe("promise", () => {
        it("timeout", async () => {
            var slow = new Promise((resolve, _) => setTimeout(() => resolve(), 1000));
            var error = null;
            try {
                await slow.timeout(1);
            }
            catch (err) {
                error = err;
            }

            expect(error).to.be.ok;
            expect(error.message || error).to.be.equal("Timeout");
        });
    });
});
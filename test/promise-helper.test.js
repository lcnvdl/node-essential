const { expect } = require("chai");
const PromiseHelper = require("../src/system/helpers/promise.helper");

describe("PromiseHelper", () => {
    describe("#sleep", () => {
        it("should work fine", async () => {
            let time = new Date();
            await PromiseHelper.sleep(35);
            time = (new Date() - time);
            expect(time >= 35).to.be.true;
        });
    });

    describe("#waitFor", () => {
        it("should work fine", async () => {
            let time = new Date();
            let result = false;
            setTimeout(() => result = true, 25);
            await PromiseHelper.waitFor(() => result, 1);
            time = (new Date() - time);
            expect(time >= 25).to.be.true;
            expect(result).to.be.true;
        });

        it("should fail if timeout fine", async () => {
            let result = false;
            let error = null;
            try {
                await PromiseHelper.waitFor(() => result, 1, 10);
            }
            catch(err) {
                error = err;
            }

            expect(error.toLowerCase().indexOf("timeout") !== -1).to.be.true;
        });
    });
});
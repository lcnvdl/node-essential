const { expect } = require("chai");
const RegexValidator = require("../src/system/validators/regex-validator")

describe("RegexValidator", () => {
    describe("#validate", () => {
        it("should work fine", async () => {
            const validator = new RegexValidator({ text: "Holanda" }, "text", "[A-Z][a-z]+", "error message");
            await validator.validate();
            expect(validator).to.be.ok;
        });

        it("should fail if regex doesn't match - case 1", async () => {
            const validator = new RegexValidator({ text: "" }, "text", "[A-Z][a-z]+", "error message");
            let error = null;
            try {
                await validator.validate();
            }
            catch (err) {
                error = err;
            }
            expect(error).to.be.ok;
            expect(error).to.be.equals("error message");
        });

        it("should fail if regex doesn't match - case 2", async () => {
            const validator = new RegexValidator({ text: "abc" }, "text", "[A-Z][a-z]+", "error message");
            let error = null;
            try {
                await validator.validate();
            }
            catch (err) {
                error = err;
            }
            expect(error).to.be.ok;
            expect(error).to.be.equals("error message");
        });
    });
});
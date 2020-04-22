const { expect } = require("chai");
const TypeValidator = require("../src/system/validators/type-validator")

describe("TypeValidator", () => {
    describe("#validate", () => {
        it("should work fine", async () => {
            const typeValidator = new TypeValidator({ text: "" }, "text", "text field", "string");
            await typeValidator.validate();
            expect(typeValidator).to.be.ok;
        });
        it("should fail if type doesn't match", async () => {
            const typeValidator = new TypeValidator({ number: 12 }, "text", "textfield", "string");
            let error = null;
            try {
                await typeValidator.validate();
            }
            catch (err) {
                error = err;
            }
            expect(error).to.be.ok;
        });
    });
});
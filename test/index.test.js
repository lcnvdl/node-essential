const { expect } = require("chai");
const index = require("../src/index");

describe("Index", () => {
    it("should work fine", () => {
        const ControllersManager = index.Managers.System.ControllersManager;
        expect(ControllersManager).to.be.ok;
        const RequiredValidator = index.System.Validators.Required;
        expect(RequiredValidator).to.be.ok;
    });
});
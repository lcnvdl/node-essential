const { expect } = require("chai");
const InjectionManager = require("../src/managers/system/injection.manager");
const ControllerBase = require("../src/controllers/controller-base");

class ControllerStub extends ControllerBase {
    testAction() {
        return 100;
    }
}

/** @type {InjectionManager} */
let injection;

/** @type {ControllerStub} */
let controller;

describe("ControllerBase", () => {
    beforeEach(() => {
        injection = new InjectionManager();
        controller = new ControllerStub({ injection });
    });

    describe("#action", () => {
        it("null name should fail", () => {
            expect(() => controller.action(null)).to.throw(Error);
        });

        it("empty name should fail", () => {
            expect(() => controller.action("")).to.throw(Error);
        });

        it("missing action should fail", () => {
            expect(() => controller.action("myAction")).to.throw(Error);
        });

        it("action should work fine", () => {
            expect(controller.action("test")).to.equal(100);
        });
    });
});
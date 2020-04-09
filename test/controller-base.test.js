const { expect } = require("chai");
const InjectionManager = require("../src/managers/system/injection.manager");
const ControllerBase = require("../src/controllers/controller-base");

class ControllerStub extends ControllerBase {
    testAction() {
        return 100;
    }
    testWithoutReturnAction() {
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

    describe("#existsAction", () => {
        it("null name", () => {
            expect(controller.existsAction(null)).to.be.false;
        });

        it("empty name", () => {
            expect(controller.existsAction("")).to.be.false;
        });

        it("missing action", () => {
            expect(controller.existsAction("my")).to.be.false;
        });

        it("action", () => {
            expect(controller.existsAction("test")).to.be.true;
        });
    });

    describe("#actionIfExists", () => {
        it("null name", () => {
            expect(controller.actionIfExists(null)).to.be.undefined;
        });

        it("empty name", () => {
            expect(controller.actionIfExists("")).to.be.undefined;
        });

        it("missing action", () => {
            expect(controller.actionIfExists("my")).to.be.undefined;
        });

        it("action without return must return null instead of undefined", () => {
            expect(controller.actionIfExists("testWithoutReturn")).to.be.null;
        });

        it("action", () => {
            expect(controller.actionIfExists("test")).to.equals(100);
        });
    });

    describe("#action", () => {
        it("null name should fail", () => {
            expect(() => controller.action(null)).to.throw(Error);
        });

        it("empty name should fail", () => {
            expect(() => controller.action("")).to.throw(Error);
        });

        it("missing action should fail", () => {
            expect(() => controller.action("my")).to.throw(Error);
        });

        it("action without return should work fine", () => {
            expect(controller.action("testWithoutReturn")).to.be.undefined;
        });

        it("action should work fine", () => {
            expect(controller.action("test")).to.equal(100);
        });
    });
});
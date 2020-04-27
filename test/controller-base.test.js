const { expect } = require("chai");
const InjectionManager = require("../src/managers/system/injection.manager");
const ControllerBase = require("../src/controllers/controller-base");

class ControllerStub extends ControllerBase {
    constructor(m) {
        super(m);
        this.prefix = "";
    }

    get actionsPrefix() {
        return this.prefix;
    }

    testAction() {
        return 100;
    }
    testWithoutReturnAction() {
    }
    async asyncTestWithoutReturnAction() {
        await Promise.resolve();
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

    describe("#existsActionWithPrefix", () => {
        beforeEach(() => {
            controller.prefix = "xyz"
        });

        it("null name", () => {
            expect(controller.existsAction(null)).to.be.false;
        });

        it("empty name", () => {
            expect(controller.existsAction("")).to.be.false;
        });

        it("missing action", () => {
            expect(controller.existsAction("my")).to.be.false;
        });

        it("action with prefix", () => {
            expect(controller.existsAction("xyzTest")).to.be.true;
        });

        it("action", () => {
            expect(controller.existsAction("test")).to.be.false;
        });
    });

    describe("#actionIfExists", () => {
        it("null name", async () => {
            expect(await controller.actionIfExists(null)).to.be.undefined;
        });

        it("empty name", async () => {
            expect(await controller.actionIfExists("")).to.be.undefined;
        });

        it("missing action", async () => {
            expect(await controller.actionIfExists("my")).to.be.undefined;
        });

        it("action without return must return null instead of undefined", async () => {
            expect(await controller.actionIfExists("testWithoutReturn")).to.be.null;
        });

        it("async action without return must return null instead of undefined", async () => {
            expect(await controller.actionIfExists("asyncTestWithoutReturn")).to.be.null;
        });

        it("action", async () => {
            expect(await controller.actionIfExists("test")).to.equals(100);
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
const { expect } = require("chai");
const InjectionManager = require("../src/managers/system/injection.manager");

class TestClass {
    constructor() {
    }
}

/** @type {InjectionManager} */
let instance;

describe("InjectionManager", () => {
    beforeEach(() => {
        instance = new InjectionManager();
    });

    describe("add", () => {
        it("name should work fine", () => {
            instance.add("number", () => 1);
            let value = instance.get("number");
            expect(value).to.equals(1);
        });

        it("constructor should work fine", () => {
            instance.add(TestClass);
            let value = instance.get(TestClass);
            expect(value).to.be.ok;
            expect(value).to.be.instanceOf(TestClass);
        });

        it("missing name should fail", () => {
            instance.add("number", () => 1);
            let error = null;
            try {
                instance.get("numbero");
            }
            catch (err) {
                error = err;
            }

            expect(error).to.be.ok;
            expect(error.message).to.contains("number");
        });
    });

    describe("destroy", () => {
        it("empty should work fine", () => {
            instance.add("number", () => 1);
            instance.destroy("number");
        });

        it("with instance should work fine", () => {
            instance.add("number", () => 1);
            instance.get("number");
            instance.destroy("number");
        });
    });
});
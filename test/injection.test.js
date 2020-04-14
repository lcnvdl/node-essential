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

    describe("getByTag", () => {
        beforeEach(() => {
            instance.add("number_1", () => 1, { tag: "number" })
            instance.add("number_2", () => 2, { tag: "number" })
            instance.add("number_3", () => 3, { tag: "number" })
            instance.add("text_1", () => "a", { tag: "text" })
            instance.add("text_2", () => "b", { tag: "text" })
            instance.add("text_3", () => "c", { tag: "text" })
        });

        it("unexisting tag should return an empty array", () => {
            expect(instance.getByTag("x")).to.be.empty;
        });

        it("should work fine", () => {
            expect(instance.getByTag("number")).to.be.deep.equal([1, 2, 3]);
            expect(instance.getByTag("text")).to.be.deep.equal(["a", "b", "c"]);
        });
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

    describe("Recursive", () => {
        /** @type {InjectionManager} */
        let child1;
        let child2;

        beforeEach(() => {
            instance.add("val1", () => 1);
            instance.add("val2", () => 2);
            instance.add("val3", () => 3);

            child1 = instance.calve("son1");
            child1.add("val1", () => 11);

            child2 = instance.calve("son2");
            child2.add("val2", () => 22);
        });

        it("should get value if exists", () => {
            const result1 = child1.get("val1");
            const result2 = child2.get("val2");

            expect(result1).to.equal(11);
            expect(result2).to.equal(22);
        });

        it("should get value from parent if doesn't exists", () => {
            const result1 = child2.get("val1");
            const result2 = child1.get("val2");

            expect(result1).to.equal(1);
            expect(result2).to.equal(2);
        });
    });
});
const { expect } = require("chai");
const Serializable = require("../src/system/data/serializable");

class TestSubclass extends Serializable {
  constructor() {
    super();
    this.serializations = 0;
    this.id = "id";
  }

  get serializableFields() {
    return super.serializableFields.filter(m => !["serializations"].includes(m));
  }

  serialize() {
    const result = super.serialize();
    this.serializations++;
    return result;
  }
}

class TestClass extends Serializable {
  constructor() {
    super();
    this.serializations = 0;
    this.id = "id";
    this.array = [];
  }

  get serializableFields() {
    return super.serializableFields.filter(m => !["serializations"].includes(m));
  }

  get customSerializers() {
    return [{ array: TestSubclass }];
  }

  serialize() {
    const result = super.serialize();
    this.serializations++;
    return result;
  }
}

/** @type {TestClass} */
let instance = null;

describe("Serializable", () => {
  beforeEach(() => {
    instance = new TestClass();
  });

  describe("#constructor", () => {
    it("should work fine", () => {
      expect(instance).to.be.ok;
    });
  });

  describe("#serializableFields", () => {
    it("should work fine", () => {
      const result = instance.serializableFields;
      expect(result).to.be.ok;
      expect(result.includes("id")).to.be.true;
      expect(result.includes("serializations")).to.be.false;
    });
  });

  describe("#serialize", () => {
    it("should ignore non serializable fields fine", () => {
      const result = instance.serialize();
      expect(result).to.be.ok;
      expect(result.serializations).to.be.undefined;
      expect(instance.serializations).to.equals(1);
    });

    it("should serialize children", () => {
      const child = new TestSubclass();
      child.id = "child";
      instance.array.push(child);
      const result = instance.serialize();
      
      expect(result).to.be.ok;
      expect(result.array).to.be.ok;
      expect(result.array.length).to.equals(1);

      expect(result.serializations).to.be.undefined;

      expect(result.array[0]).to.be.ok;
      expect(result.array[0].id).to.equals("child");
      expect(result.array[0].serializations).to.be.undefined;

      expect(instance.serializations).to.equals(1);
      expect(child.serializations).to.equals(1);
    });
  });
});

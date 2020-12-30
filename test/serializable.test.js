const { expect } = require("chai");
const Serializable = require("../src/system/data/serializable");

class DeserializeClass extends Serializable {
  constructor() {
    super();
    this.date = new Date();
    this.id = "id";
  }
}

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
    this.serializableChild = null;
  }

  get serializableFields() {
    return super.serializableFields.filter(m => !["serializations"].includes(m));
  }

  get customSerializers() {
    return [{ array: TestSubclass, serializableChild: TestSubclass }];
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

  describe("#deserialize", () => {
    it("should not add _id", () => {
      const inst = new TestClass();
      inst.deserialize({ _id: "test" });
      expect(inst._id).to.be.undefined;
    });

    it("custom serializers as array of classes", () => {
      const inst = new TestClass();
      inst.deserialize({ array: [{ id: "sub1" }, { id: "sub2" }] });
      expect(inst.array.length).to.equals(2);
      expect(inst.array[0].id).to.equals("sub1");
      expect(inst.array[1].id).to.equals("sub2");
      expect(inst.array[0]).instanceOf(TestSubclass);
    });

    it("custom serializers as class", () => {
      const inst = new TestClass();
      inst.deserialize({ serializableChild: { id: "sub1" } });
      expect(inst.serializableChild).to.be.ok;
      expect(inst.serializableChild.id).to.equals("sub1");
      expect(inst.serializableChild).instanceOf(TestSubclass);
    });

    it("should work fine", () => {
      const inst = new DeserializeClass();
      inst.deserialize({ id: "Test", date: "2013-02-04T22:44:30.652Z" });
      expect(inst.id).to.equals("Test");

      const date = new Date("2013-02-04T22:44:30.652Z");
      expect(typeof inst.date).to.not.equals("string");
      expect(inst.date.getTime()).to.equals(date.getTime());
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

const JsonLoader = require("../src/system/io/json-loader");
const { expect } = require("chai");
const path = require("path");

describe("JsonLoader", () => {
    describe("#load", () => {
        it("not json file must fail", () => {
            expect(() => JsonLoader.load("test")).to.throw();
        });

        it("inheritance should work fine", () => {
            let content = JsonLoader.load(path.join(__dirname, "./files/a.json"));
            expect(content).to.be.ok;
            expect(content.a).to.be.true;
            expect(content.b).to.be.equal(100);
            expect(content.c).to.be.equal(1);
        });

        it("should work fine", () => {
            let content = JsonLoader.load(path.join(__dirname, "./files/b.json"));
            expect(content).to.be.ok;
            expect(content.a).to.be.false;
            expect(content.b).to.be.equal(1);
            expect(content.c).to.be.equal(1);
        });
    });
});



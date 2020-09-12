const InjectionManager = require("../src/managers/system/injection.manager");
const { expect } = require("chai");
const path = require("path");
const AutoImporter = require("../src/system/io/auto-importer");

/** @type {InjectionManager} */
let injection;

/** @type {AutoImporter} */
let autoImport;

describe("AutoImporter", () => {
    beforeEach(() => {
        injection = new InjectionManager();
        autoImport = new AutoImporter(__dirname + "/../src/managers/system");
    });

    describe("#inject", () => {
        it("should work fine", async () => {
            expect(injection.getIfExists("ControllersManager")).to.be.null;
            expect(injection.getIfExists("InjectionManager")).to.be.null;

            await autoImport.inject(injection);

            expect(injection.getIfExists("ControllersManager")).to.be.ok;
            expect(injection.getIfExists("InjectionManager")).to.be.ok;
        });
    });
});

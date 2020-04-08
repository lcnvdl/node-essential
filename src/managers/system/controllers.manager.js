/** @typedef {import("./injection.manager")} InjectionManager */

const ControllerBase = require("../../controllers/controller-base");

class ControllersManager {
    /**
     * @param {InjectionManager} injection InjectionManager
     */
    constructor(injection) {
        this._injection = injection;
    }

    add(nameOrConstructor, creator) {
        return this._injection.add(
            nameOrConstructor,
            creator,
            {
                lazy: true,
                scope: "singleton"
            });
    }

    get(nameOrConstructor) {
        const controller = this._injection.get(nameOrConstructor);

        if (!(controller instanceof ControllerBase)) {
            const name = this._injection.getName(nameOrConstructor);
            throw new Error(`The registered controller "${name}" is not an instance of BaseController`);
        }

        return controller;
    }
}

module.exports = ControllersManager;

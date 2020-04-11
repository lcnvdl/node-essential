/** @typedef {import("./injection.manager")} InjectionManager */

const ControllerBase = require("../../controllers/controller-base");

class ControllersManager {
    /**
     * @param {InjectionManager} injection InjectionManager
     */
    constructor(injection) {
        this._injection = injection;
    }

    /** @type {ControllerBase[]} */
    get all() {
        return this._injection.getByTag("controller");
    }

    async action(name, id, args) {
        if (!name || name == "") {
            throw new Error("Empty parameter: name");
        }

        let all = this.all;
        let value = undefined;

        while (all.length > 0 && value === undefined) {
            const controller = all.pop();
            value = await controller.actionIfExists(name, id, args);
        }

        if (value === undefined) {
            throw new Error(`Action "${name}" not found. The mapped method for the action is missing`);
        }

        return value;
    }

    add(nameOrConstructor, creator) {
        return this._injection.add(
            nameOrConstructor,
            creator,
            {
                tag: "controller",
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

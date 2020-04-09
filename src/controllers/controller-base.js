/** @typedef {import("../../managers/system/injection.manager")} InjectionManager */

const camelCase = require("camelcase");

class ControllerBase {
    constructor({ injection }) {
        /** @type {InjectionManager} */
        this.injection = injection;
        this._initialized = false;
    }

    get isInitialized() {
        return this._initialized;
    }

    async initialize() {
        return Promise.resolve();
    }

    async dispose() {
        return Promise.resolve();
    }

    mapAction(name) {
        return camelCase(`${name}_action`);
    }

    existsAction(name) {
        if (!name || name == "") {
            return false;
        }

        const actionName = this.mapAction(name);
        const action = this[actionName];

        return !!action;
    }

    actionIfExists(name, id, args) {
        if (!this.existsAction(name)) {
            return undefined;
        }

        const result = this.action(name, id, args);

        if (typeof result === "undefined") {
            return null;
        }

        return result;
    }

    action(name, id, args) {
        if (!name || name == "") {
            throw new Error("Empty parameter: name");
        }

        if (typeof args === "undefined" && typeof id !== "string") {
            args = id;
            id = undefined;
        }

        const actionName = this.mapAction(name);
        const action = this[actionName];

        if (!action) {
            throw new Error(`Action "${name}" not found. The mapped method "${actionName}" for the action is missing`);
        }

        if (id) {
            return action.bind(this)(id, args);
        }
        else {
            return action.bind(this)(args);
        }
    }

    validateParameter(name, value, settings) {
        if (typeof value === "undefined") {
            throw new Error(`Empty parameter: ${name}`);
        }

        if (settings) {
            if (settings.typeof && (typeof value !== settings.typeof)) {
                throw new Error(`Invalid type for parameter: ${name}`);
            }
        }
    }
}

module.exports = ControllerBase;
/** @typedef {import("../../managers/system/injection.manager")} InjectionManager */

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

    action(name, id, args) {
        if (typeof args === "undefined" && typeof id !== "string") {
            args = id;
            id = undefined;
        }

        const action = this[`action${name}`] || this[`action${name.substr(0, 1).toUpperCase() + name.substr(1)}`];
        if (!action) {
            throw new Error(`Action ${(name || 'empty')} not found`);
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
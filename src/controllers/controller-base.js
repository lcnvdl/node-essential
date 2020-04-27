/** @typedef {import("../../managers/system/injection.manager")} InjectionManager */

const camelCase = require("camelcase");

class ControllerBase {
    constructor({ injection }) {
        /** @type {InjectionManager} */
        this.injection = injection;
        this._initialized = false;
    }

    get actionsPrefix() {
        return "";
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

        const { action } = this.getActionFromName(name);

        return !!action;
    }

    async actionIfExists(name, id, args) {
        if (!this.existsAction(name)) {
            return undefined;
        }

        let result = this.action(name, id, args);

        if (result instanceof Promise) {
            result = await result;
        }

        if (typeof result === "undefined") {
            result = null;
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

        const { action, actionName } = this.getActionFromName(name);

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

    getActionFromName(name) {
        const actionName = this.mapAction(name);

        let action;
        
        if (this.actionsPrefix && this.actionsPrefix !== "") {
            if (name.indexOf(this.actionsPrefix) === -1) {
                action = null;
            }
            else {
                const altName = this.mapAction(name.replace(this.actionsPrefix, ""));
                action = this[actionName] || this[altName];
            }
        }
        else {
            action = this[actionName];
        }

        return { action, actionName };
    }
}

module.exports = ControllerBase;
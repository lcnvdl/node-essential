class InjectionManager {
    constructor() {
        this._instances = {};
        this._constructors = {};
    }

    /**
     * @param {string|*} nameOrConstructor Name or constructor
     * @param {Function} [creator] Function that instances the controller
     * @param {*} [settings] Settings
     * @return {InjectionManager}
     */
    add(nameOrConstructor, creator, settings) {
        const name = getName(nameOrConstructor);

        creator = creator || (() => new (nameOrConstructor)({ injection: this }));
        settings = settings || {};
        settings.scope = settings.scope || "singleton";

        this._constructors[name] = { creator, settings };

        if (settings.lazy === false) {
            if (settings.scope === "singleton") {
                this.get(nameOrConstructor);
            }
            else {
                throw new Error("A non-lazy constructor can only work in a singleton-scoped context");
            }
        }

        return this;
    }

    /**
     * @param {Array} [array] Array of constructors, or array of {nameOrConstructor, creator, settings}
     * @return {InjectionManager}
     */
    addRange(array) {
        array.forEach(m => {
            if (m.nameOrConstructor) {
                const { nameOrConstructor, creator, settings } = m;
                this.add(nameOrConstructor, creator, settings);
            }
            else {
                this.add(m);
            }
        });

        return this;
    }

    /**
     * @param {*} predicate Predicate
     * @returns {Array}
     */
    findAll(predicate) {
        return Object.values(this._instances).filter(predicate);
    }

    destroy(nameOrConstructor) {
        delete this._instances[getName(nameOrConstructor)];
        return this;
    }

    getName(nameOrConstructor) {
        return getName(nameOrConstructor);
    }

    /**
     * @param {string|*} nameOrConstructor Name or constructor
     * @param {*} [defaultValue] Default value
     * @returns {*}
     */
    get(nameOrConstructor, defaultValue) {
        const name = getName(nameOrConstructor);

        if (!this._instances[name]) {
            if (!this._constructors[name]) {
                if (typeof defaultValue === "undefined") {
                    throw new Error(`Missing constructor for the requested type or name "${name}"`);
                }
                else {
                    return defaultValue;
                }
            }

            this._instances[name] = this._constructors[name].creator();
        }

        return this._instances[name];
    }

    getIfExists(nameOrConstructor) {
        return this.get(nameOrConstructor, null);
    }

    /**
     * @param {*} dict Dict
     * @param {*} [target] Target
     */
    inject(dict, target) {
        target = target || dict;
        Object.keys(dict).forEach(k => {
            dict[k] = this.get(k);
        });

        return this;
    }
}

/**
 * @param {*} nameOrConstructor Name or constructor
 * @returns {string} Name
 */
function getName(nameOrConstructor) {
    let name;

    if (typeof nameOrConstructor === "string") {
        name = nameOrConstructor;
    }
    else {
        name = nameOrConstructor.name;
    }

    return name;
}

module.exports = InjectionManager;
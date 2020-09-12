class InjectionManager {
    /**
     * @param [id] {string} id
     * @param [parent] {InjectionManager} parent
     */
    constructor(id, parent) {
        this._id = id || "root";
        this._instances = {};
        this._constructors = {};
        this._parent = parent;
    }

    get name() {
        return this._id;
    }

    get fullName() {
        if (this._parent) {
            return this._parent.fullName + "." + this._id;
        }
        else {
            return this._id;
        }
    }

    /**
     * @param {string|*} nameOrConstructor Name or constructor
     * @param {Function} [creator] Function that instances the controller
     * @param {*} [settings] Settings
     * @return {InjectionManager}
     */
    add(nameOrConstructor, creator, settings) {
        const name = getName(nameOrConstructor);

        if (!name || name === undefined) {
            throw new Error("Couldn't get the name of the object.");
        }

        if (typeof nameOrConstructor === "string") {
            if (typeof creator === "undefined") {
                throw new Error("Undefined values for string keys are not allowed.");
            }
            else if (typeof creator !== "function") {
                const v = creator;
                creator = () => v;
            }
        }
        else if (creator !== null && creator !== undefined && typeof creator !== "function") {
            throw new Error("The optional creator of a constructor can only be a function.");
        }

        creator = creator || (() => new (nameOrConstructor)({ injection: this }));
        settings = settings || {};
        settings.scope = settings.scope || "singleton";
        settings.tags = settings.tags || [];

        if (settings.tags.length === 0 && settings.tag) {
            settings.tags.push(settings.tag);
        }

        this._constructors[name] = { name, creator, settings };

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
     * @param {string} tag Tag
     * @returns {Array}
     */
    getByTag(tag) {
        return Object.values(this._constructors)
            .filter(m => m.settings.tags.indexOf(tag) !== -1)
            .map(m => m.name)
            .map(m => this.get(m));
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
                const parentValue = this._getFromParent(name);

                if (parentValue) {
                    return parentValue;
                }

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

    _getFromParent(nameOrConstructor) {
        let parent = this._parent;
        let result = null;

        while (result == null && parent) {
            result = parent.getIfExists(nameOrConstructor);
            parent = parent.parent;
        }

        return result;
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

    calve(name) {
        const son = new InjectionManager(name, this);
        this.add(`$injection.${son.fullName}`, () => son, { tag: "$child" });
        return son;
    }

    child(name) {
        return this.get(`$injection.${name}`);
    }

    dispose() {
        if (this._parent) {
            this._parent.destroy(`$injection.${this.fullName}`);
        }
        this.getByTag("$child").forEach(m => m.dispose());
        Object.keys(this).forEach(k => this[k] = null);
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

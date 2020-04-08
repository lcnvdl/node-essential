class ValidatorBase {
    constructor(parent, field, fieldName) {
        this.parent = parent;
        this.field = field;
        this.fieldName = fieldName;
    }

    get value() {
        return this.parent[this.field];
    }

    async validate() {
        return Promise.reject("Not implemented");
    }
}

module.exports = ValidatorBase;

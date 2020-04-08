const ValidatorBase = require("./validator-base");

class RequiredValidator extends ValidatorBase {
    constructor(parent, field, fieldName) {
        super(parent, field, fieldName);
    }

    validate() {
        if (this.value === undefined || this.value === null || this.value === "") {
            return Promise.reject(`The field ${this.fieldName} is required`);
        }

        return Promise.resolve();
    }
}

module.exports = RequiredValidator;
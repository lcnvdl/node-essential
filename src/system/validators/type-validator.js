const ValidatorBase = require("./validator-base");

class TypeValidator extends ValidatorBase {
    constructor(parent, field, fieldName, typeOf) {
        super(parent, field, fieldName);
        this.typeOf = typeOf;
    }

    validate() {
        if (typeof this.value !== this.typeOf) {
            return Promise.reject(`The type of ${this.fieldName} (${typeof(this.value)}) is not ${this.typeOf}`);
        }

        return Promise.resolve();
    }
}

module.exports = TypeValidator;
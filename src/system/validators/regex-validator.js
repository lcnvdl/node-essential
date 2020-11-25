const ValidatorBase = require("./validator-base");

class RegexValidator extends ValidatorBase {
    constructor(parent, field, expression, errorMessage) {
        super(parent, field, "");

        if (!expression || !errorMessage) {
            throw new Error("Missing argument");
        }

        if (typeof expression !== "string" && !(expression instanceof RegExp)) {
            return Promise.reject("The expression must be a string or a RegExp");
        }

        this.expression = expression;
        this.errorMessage = errorMessage;
    }

    validate() {
        const rgx = (this.expression instanceof RegExp) ? this.expression : (new RegExp(this.expression));

        if (rgx.test(this.value)) {
            return Promise.resolve();
        }

        return Promise.reject(this.errorMessage);
    }
}

module.exports = RegexValidator;

/** @typedef {import("./controllers/controller-base")} ControllerBase */
/** @typedef {import("./managers/system/controllers.manager")} ControllersManager */
/** @typedef {import("./managers/system/injection.manager")} InjectionManager */
/** @typedef {import("./system/io/json-loader")} JsonLoader */
/** @typedef {import("./system/data/serializable")} Serializable */
/** @typedef {import("./system/types/range")} Range */
/** @typedef {import("./system/validators/type-validator")} TypeValidator */
/** @typedef {import("./system/validators/regex-validator")} RegexValidator */

const Essentials = {
    Controllers: {
        /**
         * @type {ControllerBase}
         */
        get ControllerBase() {
            return require("./controllers/controller-base");
        }
    },
    Managers: {
        System: {
            /**
             * @type {ControllersManager}
             */
            get ControllersManager() {
                return require("./managers/system/controllers.manager");
            },
            /**
             * @type {InjectionManager}
             */
            get InjectionManager() {
                return require("./managers/system/injection.manager");
            }
        }
    },
    System: {
        Extensions: {
            /**
             * @type {*}
             */
            get Array() {
                return require("./system/extensions/array");
            },
            /**
             * @type {*}
             */
            get Promise() {
                return require("./system/extensions/promise");
            }
        },
        Data: {
            /**
             * @type {Serializable}
             */
            get Serializable() {
                return require("./system/data/serializable");
            }
        },
        Types: {
            /**
             * @type {Range}
             */
            get Range() {
                return require("./system/types/range");
            }
        },
        Helpers: {
            /**
             * @type {PromiseHelper} PromiseHelper
             */
            get PromiseHelper() {
                return require("./system/helpers/promise.helper");
            }
        },
        Validators: {
            /**
             * @type {RequiredValidator} Required
             */
            get Required() {
                return require("./system/validators/required");
            },
            /**
             * @type {TypeValidator} TypeValidator
             */
            get Type() {
                return require("./system/validators/type-validator");
            },
            /**
             * @type {RegexValidator} RegexValidator
             */
            get Regex() {
                return require("./system/validators/regex-validator");
            },
            /**
             * @type {Array<any>} All
             */
            get All() {
                return require("./system/validators/validators");
            },
            /**
             * @type {ValidatorBase} ValidatorBase
             */
            get ValidatorBase() {
                return require("./system/validators/validator-base");
            }
        },
        IO: {
            /**
             * @type {JsonLoader}
             */
            get JsonLoader() {
                return require("./system/io/json-loader");
            }
        }
    }
};

module.exports = Essentials;
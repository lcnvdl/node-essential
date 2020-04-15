module.exports = {
    Controllers: {
        get ControllerBase() {
            return require("./controllers/controller-base");
        }
    },
    Managers: {
        System: {
            get ControllersManager() {
                return require("./managers/system/controllers.manager");
            },
            get InjectionManager() {
                return require("./managers/system/injection.manager");
            },
            IO: {
                get JsonLoader() {
                    return require("./system/io/json-loader");
                }
            }
        }
    },
    System: {
        Extensions: {
            get Array() {
                return require("./system/extensions/array");
            },
            get Promise() {
                return require("./system/extensions/promise");
            }
        },
        Data: {
            get Serializable() {
                return require("./system/data/serializable");
            }
        },
        Types: {
            get Range() {
                return require("./system/types/range");
            }
        },
        Validators: {
            get Required() {
                return require("./system/validators/required");
            },
            get All() {
                return require("./system/validators/validators");
            },
            get ValidatorBase() {
                return require("./system/validators/validator-base");
            }
        }
    }
};
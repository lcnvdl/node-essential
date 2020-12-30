class Serializable {
    get serializableFields() {
        return Object.keys(this);
    }

    get customSerializers() {
        return [];
    }

    static isSerializable(value) {
        return value && value.constructor && Object.getPrototypeOf(value).name === "Serializable";
    }

    serialize() {
        let dict = {};

        this.serializableFields.filter(k => k[0] !== "_").forEach(k => {
            let v = this[k];

            if (typeof v !== "function") {
                if (this.customSerializers.some(m => m[k])) {
                    let serializer = this.customSerializers.find(m => m[k])[k];

                    if (Serializable.isSerializable(serializer)) {
                        if (Array.isArray(v)) {
                            v = v.map(m => m.serialize());
                        }
                        else if (v) {
                            v = v.serialize();
                        }
                    }
                    else {
                        v = serializer(v);
                    }
                }

                dict[k] = v;
            }
        });

        return dict;
    }

    set(data) {
        Object.keys(data).forEach(k => {
            if (typeof this[k] === "undefined") {
                throw new Error(`Missing field ${k}`);
            }

            this[k] = data[k];
        });

        return this;
    }

    deserialize(data) {
        if (!data) {
            return null;
        }

        let serializableFields;
        if (data instanceof Serializable) {
            serializableFields = data.serializableFields;
        }
        else {
            serializableFields = Object.keys(data);
        }

        serializableFields
            .filter(k => k[0] !== "_")
            .filter(k => this.serializableFields.some(f => f === k))
            .forEach(k => {
                let v = data[k];

                if (typeof v !== "function") {
                    /** @todo Esto puede estar mal, data nunca o casi nunca debería ser "Serializer", siempre es dict. */
                    if (data.customSerializers && data.customSerializers.some(m => m[k])) {
                        const serializer = data.customSerializers.find(m => m[k])[k];
                        if (typeof serializer === "function" && (!serializer.prototype || !serializer.prototype.deserialize)) {
                            v = serializer(v);
                        }
                        else {
                            if (Array.isArray(v)) {
                                v = v.map(m => (new serializer()).deserialize(m));
                            }
                            else {
                                const instance = new serializer();
                                v = instance.deserialize(v);
                            }
                        }
                    }
                    else if (this.customSerializers && this.customSerializers.some(m => m[k])) {
                        const serializer = this.customSerializers.find(m => m[k])[k];
                        if (Serializable.isSerializable(serializer)) {
                            if (Array.isArray(v)) {
                                v = v.map(m => (new serializer()).deserialize(m));
                            }
                            else {
                                const instance = new serializer();
                                v = instance.deserialize(v);
                            }
                        }
                    }
                    else if (this[k] instanceof Date) {
                        if (typeof v === "string") {
                            v = new Date(v);
                        }
                    }

                    this[k] = v;
                }
            });

        return this;
    }

    assign(data) {
        if (!data) {
            return null;
        }

        Object.assign(this, data);
        return this;
    }
}

module.exports = Serializable;
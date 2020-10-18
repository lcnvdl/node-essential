class Serializable {
    get serializableFields() {
        return Object.keys(this);
    }

    get customSerializers() {
        return [];
    }

    serialize() {
        let dict = {};

        this.serializableFields.filter(k => k[0] !== "_").forEach(k => {
            let v = this[k];

            if (typeof v !== "function") {
                if (this.customSerializers.some(m => m[k])) {
                    let serializer = this.customSerializers.find(m => m[k])[k];

                    if (serializer.constructor && Object.getPrototypeOf(serializer).name === "Serializable") {
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

                    if (data.customSerializers && data.customSerializers.some(m => m[k])) {
                        v = data.customSerializers.find(m => m[k])[k](v);
                    }

                    this[k] = v;
                }
            });

        Object.assign(this, data);
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
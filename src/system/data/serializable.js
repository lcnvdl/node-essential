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
                    v = this.customSerializers.find(m => m[k])[k](v);
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
        Object.assign(this, data);
        return this;
    }
}

module.exports = Serializable;
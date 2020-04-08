class Range {
    constructor(min, max) {
        this.min = min;
        this.max = max;
        this._value = Math.round((max - min) / 2);
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = Math.min(this.max, Math.max(this.min, v));
    }
}

module.exports = Range;


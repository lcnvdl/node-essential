module.exports = () => {
    Array.prototype.forEachAsync = async function (fn) {
        for (let t of this) { await fn(t) }
    };

    Array.prototype.forEachAsyncParallel = async function (fn) {
        await Promise.all(this.map(fn));
    };
};
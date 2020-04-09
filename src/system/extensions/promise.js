module.exports = () => {
    Promise.prototype.timeout = async function (ms) {
        return new Promise((resolve, reject) => {
            let clock = setTimeout(() => {
                reject("Timeout");
            }, ms);

            this.then(m => {
                resolve(m);
                clearTimeout(clock);
            })
            .catch(err => {
                reject(err)
                clearTimeout(clock);
            });
        });
    };
};
class PromiseHelper {
    static sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), ms);
        });
    }

    /**
     * @param {Function<boolean>} condition Condition
     * @param {number} [sleepTime=100] Sleep time between checks
     * @param {number} [timeOut] Timeout
     */
    static waitFor(condition, sleepTime, timeOut) {
        return new Promise(async (resolve, reject) => {
            sleepTime = sleepTime || 100;
            const hasTimeout = timeOut > 0;

            while (!condition() && (!hasTimeout || timeOut > 0)) {
                await PromiseHelper.sleep(sleepTime);
                timeOut -= sleepTime;
            }

            if (hasTimeout && timeOut <= 0) {
                reject("Timeout");
            }
            
            resolve();
        });
    }
}

module.exports = PromiseHelper;
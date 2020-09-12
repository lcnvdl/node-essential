/** @typedef {import("../../managers/system/injection.manager")} InjectionManager */

const path = require("path");
const glob = require("glob");
const camelCase = require("camelcase");

function pglob(pattern, settings) {
    return new Promise((resolve, reject) => {
        glob(pattern, settings, function (er, files) {
            if (er) {
                reject(er);
            }
            else {
                resolve(files);
            }
        });
    });
}

class AutoImporter {
    constructor(workingDirectory) {
        this.workingDirectory = workingDirectory || process.cwd();
        this.recursive = true;
    }

    /**
     * @param {InjectionManager} injection Injection manager
     */
    async inject(injection) {
        const files = await this.__getFiles();

        files.forEach(file => {
            const absFile = path.join(this.workingDirectory, file);
            let name = absFile;
            name = name.split("\\").join("/");
            name = name.substr(name.lastIndexOf("/") + 1);
            name = name.substr(0, name.lastIndexOf("."));
            name = name.split(".").join("_");
            name = camelCase(name, { pascalCase: true });

            injection.add(name, () => require(absFile));
        });
    }

    /**
     * @returns {Promise<string[]>}
     */
    async __getFiles() {
        const options = { cwd: this.workingDirectory };

        const files = await pglob("*.js", options);

        if (this.recursive) {
            const moreFiles = await pglob("**/*.js", options);
            files.push(...moreFiles);
        }

        return files;
    }
}

module.exports = AutoImporter;

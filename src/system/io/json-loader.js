let path;
let fs;

class JsonLoader {
    /**
     * @param {string} file JSON File
     */
    static load(file) {
        if (!file || file.toLowerCase().indexOf(".json") === -1) {
            throw new Error("The file is not a JSON file.");
        }

        try {
            path = path || require("path");
            fs = fs || require("fs");
        }
        catch {
            return null;
        }

        const cwd = path.dirname(file);

        let content = JSON.parse(fs.readFileSync(file, "utf8"));

        while (content.$inherit) {
            const parent = content.$inherit;
            delete content.$inherit;
            console.log(` - Loading parent settings from ${parent}`);

            let parentObject = require(path.join(cwd, parent));
            content = Object.assign(parentObject, content);
        }

        return content;
    }
}

module.exports = JsonLoader;

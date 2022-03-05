const parser = require("./parser/out/parser");
const fs = require("fs");

module.exports = (eleventyConfig) => {
    eleventyConfig.addTemplateFormats("mpls");

    eleventyConfig.addExtension("mpls", {
        compile: (content) => () =>
            parser.parseMPLS(
                content,
                JSON.parse(fs.readFileSync("./mathpage.json").toString())
            ),
    });

    return {
        dir: {
            input: "pages",
            output: "out/pages",
        },
    };
};

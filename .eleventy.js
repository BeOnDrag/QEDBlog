const parse = require("mathpage").parse;
const fs = require("fs");

module.exports = (eleventyConfig) => {
    eleventyConfig.addTemplateFormats("mpls");

    eleventyConfig.addExtension("mpls", {
        compile: parse,
    });

    return {
        dir: {
            input: "pages",
            output: "out",
        },
    };
};

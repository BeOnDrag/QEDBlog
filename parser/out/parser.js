"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_1 = __importDefault(require("markdown-it"));
const outdent_1 = require("outdent");
const MD = (0, markdown_it_1.default)().disable(["heading"]);
class Problem {
    constructor() {
        this.title = "";
        this.content = "";
        this.hint = "";
        this.solution = "";
    }
}
class Category {
    constructor() {
        this.title = "";
        this.content = [];
    }
}
class ProbList {
    constructor() {
        this.title = "";
        this.content = [];
    }
}
function parseProblemList(content) {
    return content.map((str) => {
        let prob = new Problem();
        prob.title = str[0];
        prob.content = MD.render(str[1]);
        prob.hint = MD.render(str[2]);
        prob.solution = MD.render(str[3]);
        return prob;
    });
    // return [{
    //     title: "AAA",
    //     content: content.join(""),
    //     hint: "AAA",
    //     solution: "AAA",
    // }] as Problem[];
}
function toProbList(content) {
    let list = new ProbList();
    let lines = content.split("\n");
    let index = -1;
    function findNextStartWith(str) {
        let i = index + 1;
        while (i < lines.length && !lines[i].startsWith(str))
            i++;
        return i;
    }
    index = findNextStartWith("# ");
    if (index < lines.length) {
        list.title = lines[index].substring(2);
    }
    else {
        throw new Error("No title!");
    }
    index = findNextStartWith("## ");
    while (index < lines.length) {
        let next = findNextStartWith("## ");
        list.content.push({
            title: lines[index].substring(3),
            content: parseProblemList(lines
                .slice(index + 1, next)
                .join("\n")
                .trim()
                .split("===")
                .map((str) => str.split("---"))),
        });
        index = next;
    }
    return list;
}
function parseMPLS(content, config) {
    let list = toProbList(content);
    let body = (0, outdent_1.outdent) `
        <div id="title">
            <h1>${list.title}</h1>
            <a href="../" id="home">
                <img src="../../static/logo.png"/>
            </a>
        </div>
        <div id="main">`.trim();
    for (let cat of list.content) {
        body += (0, outdent_1.outdent) `
            <div class="cat">
                <button class="acc catbtn open">${cat.title}</button>
                <div class="lst">`;
        for (let prob of cat.content) {
            body += (0, outdent_1.outdent) `
            <div class="prb">
                <h3 class="name">${prob.title}</h3>
                <div class="txt">
                    ${prob.content}
                </div>
                <button class="acc sol">
                    ${config.showSolutionStr}
                    <div class="hint">
                        ${prob.hint}
                    </div>
                </button>
                <div class="soltxt">
                    ${prob.solution}
                </div>
            </div>`;
        }
        body += (0, outdent_1.outdent) `
        </div></div>`;
    }
    body += "</div></div>";
    return (0, outdent_1.outdent) `<!DOCTYPE html>
    <html>
    <head>
        <title>${config.siteTitle} - ${list.title}</title>
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css"
            integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ"
            crossorigin="anonymous"
        />
        <script
            defer
            src="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.js"
            integrity="sha384-VQ8d8WVFw0yHhCk5E8I86oOhv48xLpnDZx5T9GogA/Y84DcCKWXDmSDfn13bzFZY"
            crossorigin="anonymous"
        ></script>
        <script
            defer
            src="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/contrib/auto-render.min.js"
            integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR"
            crossorigin="anonymous"
        ></script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="../../scripts/index.js"></script>
        <link rel="stylesheet" href="../../scripts/index.css" />
        <link rel="stylesheet" href="../../scripts/config.css" />
        <meta charset="UTF-8" />
    </head>
    <body>
    ${body}
    </body>
    </html>
    `;
}
module.exports = { parseMPLS };

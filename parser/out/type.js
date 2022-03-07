"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.ProbList = exports.Category = exports.Description = exports.Problem = void 0;
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
    toHTML(config) {
        return (0, outdent_1.outdent) `
        <div class="prb">
        <h3 class="name">${this.title}</h3>
        <div class="txt">
        ${MD.render(this.content)}
        </div>
        <button class="acc sol">
        ${config.showSolutionStr}
        <div class="hint">
        ${MD.render(this.hint)}
        </div>
        </button>
        <div class="soltxt">
        ${MD.render(this.solution)}
        </div>
        </div>`;
    }
}
exports.Problem = Problem;
class Description {
    constructor() {
        this.content = "";
    }
    toHTML() {
        return (0, outdent_1.outdent) `
        <div class="desc">
        ${MD.render(this.content)}
        </div>`;
    }
}
exports.Description = Description;
class Category {
    constructor() {
        this.title = "";
        this.content = [];
    }
    toHTML(config) {
        let html = (0, outdent_1.outdent) `
        <div class="cat">
        <button class="acc catbtn open">${this.title}</button>
        <div class="lst">`;
        for (let unit of this.content) {
            html += unit.toHTML(config);
        }
        return html + (0, outdent_1.outdent) `
        </div>
        </div>`;
    }
}
exports.Category = Category;
class ProbList {
    constructor() {
        this.title = "";
        this.content = [];
    }
    toHTML(config) {
        let html = (0, outdent_1.outdent) `
        <div id="main">`;
        for (let cat of this.content) {
            html += cat.toHTML(config);
        }
        return html + (0, outdent_1.outdent) `
        </div>`;
    }
}
exports.ProbList = ProbList;
class Config {
    constructor() {
        this.showSolutionStr = "Show solution";
        this.siteTitle = "MathPage";
        this.newline = "\r\n";
    }
}
exports.Config = Config;

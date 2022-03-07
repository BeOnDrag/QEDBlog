import MarkdownIt from "markdown-it";
import { outdent } from "outdent";

const MD = MarkdownIt().disable(["heading"]);

export class Problem {
    title: string = "";
    content: string = "";
    hint: string = "";
    solution: string = "";

    toHTML(config: Config) {
        return outdent`
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
        </div>`
    }
}

export class Description {
    content: string = "";

    toHTML() {
        return outdent`
        <div class="desc">
        ${MD.render(this.content)}
        </div>`
    }
}

export class Category {
    title: string = "";
    content: (Problem|Description)[] = [];

    toHTML(config: Config) {
        let html = outdent`
        <div class="cat">
        <button class="acc catbtn open">${this.title}</button>
        <div class="lst">`
        for (let unit of this.content) {
            html += unit.toHTML(config);
        }
        return html + outdent`
        </div>
        </div>`
    }
}

export class ProbList {
    title: string = "";
    content: Category[] = [];

    toHTML(config: Config) {
        let html = outdent`
        <div id="main">`;

        for (let cat of this.content) {
            html += cat.toHTML(config);
        }

        return html + outdent`
        </div>`
    }
}

export class Config {
    showSolutionStr: string = "Show solution";
    siteTitle: string = "MathPage";
    newline: "\n" | "\r\n" = "\r\n";
}

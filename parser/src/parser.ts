import MarkdownIt from "markdown-it";
import { outdent } from "outdent";

const MD = MarkdownIt().disable(["heading"]);

class Problem {
    title: string = "";
    content: string = "";
    hint: string = "";
    solution: string = "";
}

class Category {
    title: string = "";
    content: Problem[] = [];
}

class ProbList {
    title: string = "";
    content: Category[] = [];
}

interface Config {
    showSolutionStr: string;
    siteTitle: string;
}

function parseProblemList(content: string[][]) {
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

function toProbList(content: string) {
    let list = new ProbList();
    let lines = content.split("\n");
    let index = -1;

    function findNextStartWith(str: string) {
        let i = index + 1;
        while (i < lines.length && !lines[i].startsWith(str)) i++;
        return i;
    }

    index = findNextStartWith("# ");
    if (index < lines.length) {
        list.title = lines[index].substring(2);
    } else {
        throw new Error("No title!");
    }

    index = findNextStartWith("## ");
    while (index < lines.length) {
        let next = findNextStartWith("## ");
        list.content.push({
            title: lines[index].substring(3),
            content: parseProblemList(
                lines
                    .slice(index + 1, next)
                    .join("\n")
                    .trim()
                    .split("===")
                    .map((str) => str.split("---"))
            ),
        });
        index = next;
    }

    return list;
}

function parseMPLS(content: string, config: Config) {
    let list = toProbList(content);
    let body = outdent`
        <div id="title">
            <h1>${list.title}</h1>
            <a href="../index.html" id="home">
                <img src="../../static/logo.png"/>
            </a>
        </div>
        <div id="main">`.trim();
    for (let cat of list.content) {
        body += outdent`
            <div class="cat">
                <button class="acc catbtn open">${cat.title}</button>
                <div class="lst">`
        for (let prob of cat.content) {
            body += outdent`
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
            </div>`
        }
        body += outdent`
        </div></div>`
    }
    body += "</div></div>"

    return outdent`<!DOCTYPE html>
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
    `
}

module.exports = { parseMPLS };

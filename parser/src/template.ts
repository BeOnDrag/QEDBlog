import { outdent } from "outdent";
import { ProbList, Config } from "./type";

export function HTMLTemplate(list: ProbList, config: Config) {
    return outdent`
    <!DOCTYPE html>
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
    <script src="../scripts/index.js"></script>
    <link rel="stylesheet" href="../scripts/index.css" />
    <link rel="stylesheet" href="../scripts/config.css" />
    <meta charset="UTF-8" />
    </head>
    <body>
    <div id="title">
    <h1>${list.title}</h1>
    <a href="../" id="home">
    <img src="../static/logo.png"/>
    </a>
    </div>
    ${list.toHTML(config)}
    </body>
    </html>`;
}

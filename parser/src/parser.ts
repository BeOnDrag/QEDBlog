import { HTMLTemplate } from "./template";
import { ProbList, Category, Problem, Description, Config } from "./type";

function parseUnits(text: string, newline: "\n" | "\r\n") {
    text = text.trim();
    let lines = text.split(newline);
    let index = 0;
    let units: (Problem | Description)[] = [];

    while (index < lines.length) {
        while (
            index < lines.length &&
            !lines[index].startsWith("??? ") &&
            !lines[index].startsWith(";;;")
        ) {
            index++;
        }

        if (index >= lines.length) break;

        if (lines[index].startsWith("??? ")) {
            let unit = new Problem();
            unit.title = lines[index].substring(4).trim();
            index++;
            let startI = index;
            while (!lines[index].endsWith("???")) {
                index++;
            }
            let strs = lines
                .slice(startI, index)
                .join(newline)
                .trim()
                .split(newline + ">>>")
                .map((str) => str.trim());
            unit.content = strs[0];
            unit.hint = strs[1];
            unit.solution = strs[2];
            units.push(unit);
        } else if (lines[index].startsWith(";;;")) {
            let desc = new Description();
            index++;
            let startI = index;
            while (!lines[index].endsWith(";;;")) {
                index++;
            }
            let str = lines
                .slice(startI, index)
                .join(newline)
                .trim();
            desc.content = str;
            units.push(desc);
        }
        index++;
    }
    return units;
}

export function parseMPLS(content: string, config: Config) {
    content = content.trim();

    let index = 0;
    let selection = "";

    function select(start: string, end: string, text = content) {
        index = text.indexOf(start, index) + start.length;
        selection = text.substring(index, text.indexOf(end, index));
        index = text.indexOf(end, index);
        return index;
    }

    let list = new ProbList();

    select("# ", config.newline);
    list.title = selection.trim();

    while (content.indexOf("## ", index) > 0) {
        let cat = new Category();
        select("## ", config.newline);
        cat.title = selection.trim();
        select("", config.newline + "@@");
        let units = selection.trim();
        cat.content = parseUnits(units, config.newline);
        list.content.push(cat);
    }

    return HTMLTemplate(list, config);
}

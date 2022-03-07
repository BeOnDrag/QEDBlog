"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMPLS = void 0;
const template_1 = require("./template");
const type_1 = require("./type");
function parseUnits(text, newline) {
    text = text.trim();
    let lines = text.split(newline);
    let index = 0;
    let units = [];
    while (index < lines.length) {
        while (index < lines.length &&
            !lines[index].startsWith("??? ") &&
            !lines[index].startsWith(";;;")) {
            index++;
        }
        if (index >= lines.length)
            break;
        if (lines[index].startsWith("??? ")) {
            let unit = new type_1.Problem();
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
        }
        else if (lines[index].startsWith(";;;")) {
            let desc = new type_1.Description();
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
function parseMPLS(content, config) {
    content = content.trim();
    let index = 0;
    let selection = "";
    function select(start, end, text = content) {
        index = text.indexOf(start, index) + start.length;
        selection = text.substring(index, text.indexOf(end, index));
        index = text.indexOf(end, index);
        return index;
    }
    let list = new type_1.ProbList();
    select("# ", config.newline);
    list.title = selection.trim();
    while (content.indexOf("## ", index) > 0) {
        let cat = new type_1.Category();
        select("## ", config.newline);
        cat.title = selection.trim();
        select("", config.newline + "@@");
        let units = selection.trim();
        cat.content = parseUnits(units, config.newline);
        list.content.push(cat);
    }
    return (0, template_1.HTMLTemplate)(list, config);
}
exports.parseMPLS = parseMPLS;

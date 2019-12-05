import { readFileSync, writeFileSync } from "fs";
import { load } from "cheerio";
import { join } from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { App } from "../app";

const sheet = new ServerStyleSheet();

const reactAsString = renderToString(sheet.collectStyles(<App />));

const sourcePath = join(__dirname, "template.html");
const source = readFileSync(sourcePath);

const $ = load(source);
$("body div#app").append(reactAsString);
$("head").append(sheet.getStyleTags());
sheet.seal();

const destinationPath = join(__dirname, "index.html");
writeFileSync(destinationPath, $.html());

export default {};

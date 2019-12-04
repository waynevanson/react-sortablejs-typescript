import React from "react";
import { renderToString } from "react-dom/server";
import { load } from "cheerio";
import { App } from "../examples/app";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const reactAsString = renderToString(<App />);
const sourcePath = join(__dirname, "template.html");
const source = readFileSync(sourcePath);

const $ = load(source);
$("body div#app").append(reactAsString);

const destinationPath = join(__dirname, "index.html");
writeFileSync(destinationPath, $.html());

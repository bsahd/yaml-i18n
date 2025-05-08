import { load } from "js-yaml";
import fs from "fs";
import path from "path";

const config = load(fs.readFileSync("./doc.config.yml", "utf8"));
for (const filename of fs.globSync("src/**/*")) {
	const doc = load(fs.readFileSync(filename, "utf8"));
	for (const language of config.languages) {
		let langdoc = "";
		for (const line of doc.lines) {
			langdoc +=
				(typeof line == "string"
					? line
					: language in line
					? line[language]
					: "[UNTRANSLATED]" + line[config.mainlanguage]) + "\n";
		}
		fs.mkdirSync(`dist/${language}/${path.dirname(filename.slice(4))}`, {
			recursive: true,
		});
		fs.writeFileSync(
			`dist/${language}/${filename.slice(4).replace(/\.ya?ml/, ".md")}`,
			langdoc,
			{
				encoding: "utf8",
			}
		);
	}
}

import fs from "fs";
import path from "path";
import { load } from "js-yaml";

const config = load(fs.readFileSync("./doc.config.yml", "utf8"));

function calcCoverage(docLines, languages, mainLang) {
	const coverage = {};
	for (const lang of languages) {
		let covered = 0;
		for (const line of docLines) {
			if (typeof line === "string" || line[lang]) covered += 1;
		}
		coverage[lang] = covered / docLines.length;
	}
	return coverage;
}

function renderHeaderLinks(coverage, filename, mainLang) {
	return (
		Object.entries(coverage)
			.map(([lang, ratio]) => {
				const percent = (ratio * 100).toFixed();
				const href = `/dist/${lang}/${filename
					.slice(4)
					.replace(/\.ya?ml$/, ".md")}`;
				return `[${lang}:${percent}%](${href})`;
			})
			.join(" ") + "\n"
	);
}

function renderDocument(docLines, lang, mainLang) {
	return docLines
		.map((line) =>
			typeof line === "string"
				? line
				: line[lang] ?? `[UNTRANSLATED] ${line[mainLang]}`
		)
		.join("\n");
}

function writeLangFile(language, filename, content) {
	const outputPath = `dist/${language}/${filename
		.slice(4)
		.replace(/\.ya?ml$/, ".md")}`;
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, content, "utf8");
}

// メイン処理
for (const filename of fs.globSync("src/**/*.yml")) {
	console.log(filename);
	const lines = load(fs.readFileSync(filename, "utf8"));
	const coverage = calcCoverage(lines, config.languages, config.mainlanguage);

	for (const lang of config.languages) {
		const header = renderHeaderLinks(coverage, filename, config.mainlanguage);
		const body = renderDocument(lines, lang, config.mainlanguage);
		writeLangFile(lang, filename, header + "\n" + body);
	}
}

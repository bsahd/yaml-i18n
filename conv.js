import fs from "fs";
import path from "path";
import { load } from "js-yaml";

const config = load(fs.readFileSync("./doc.config.yml", "utf8"));

function calcCoverage(docLines, languages) {
	const coverage = {};
	for (const lang of languages) {
		let covered = 0;
		for (const line of docLines) {
			if (typeof line === "string" || line[lang]) {
				covered += 1;
			}
		}
		coverage[lang] = covered / docLines.length;
	}
	return coverage;
}

function renderHeaderLinks(coverage, filename, displayingLang) {
	return (
		Object.entries(coverage)
			.map(([lang, ratio]) => {
				const percent = (ratio * 100).toFixed();
				if (displayingLang == lang) {
					return `**${lang}:${percent}%**`;
				}
				const href = path.relative(
					`./dist/${displayingLang}/${path.dirname(filename.slice(4))}`,
					`./dist/${lang}/${filename.slice(4).replace(/\.ya?ml$/, ".md")}`
				);
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

async function writeLangFile(language, filename, content) {
	const outputPath = `dist/${language}/${filename
		.slice(4)
		.replace(/\.ya?ml$/, ".md")}`;
	await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
	await fs.promises.writeFile(outputPath, content, "utf8");
}

let runnings = [];

function delay(ms) {
	return new Promise((a) => setTimeout(a, ms));
}

// メイン処理
const filenames = await Array.fromAsync(fs.promises.glob("src/**/*.yml"));

function updateDisp() {
	process.stdout.write(
		`\x1b[1F\x1b[2K${runnings
			.map((a) => a.slice(4))
			.join(" ")
			.slice(0, 70)}\n${"#".repeat(
			(doneCount / filenames.length) * 60
		)}${"_".repeat((1 - doneCount / filenames.length) * 60)} ${doneCount}(${
			runnings.length
		})/${filenames.length}`
	);
}
let doneCount = 0;
updateDisp();
for (const filename of filenames) {
	while (runnings.length > 7) {
		await delay(10);
		updateDisp();
	}
	updateDisp();
	(async () => {
		runnings.push(filename);
		try {
			const lines = load(await fs.promises.readFile(filename, "utf8"));
			const coverage = calcCoverage(lines, config.languages);

			for (const lang of config.languages) {
				const header = renderHeaderLinks(coverage, filename, lang);
				const body = renderDocument(lines, lang, config.mainlanguage);
				writeLangFile(lang, filename, header + "\n" + body);
			}
		} catch (e) {
			console.log(e);
		} finally {
			runnings.splice(runnings.indexOf(filename), 1);
			doneCount++;
		}
	})();
}

while (runnings.length > 0 && doneCount != filenames.length) {
	await delay(10);
	updateDisp();
}
updateDisp();
console.log("\ndone");

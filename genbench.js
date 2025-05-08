import fs from "fs";
import path from "path";
import { dump } from "js-yaml";
import { v4 as uuidv4 } from "uuid";

// ベンチマーク用ディレクトリ
const dir = path.join(import.meta.dirname, "src", "benchmarks");

function generateComplexContent(index) {
	return [
		{ ja: `${index}番目のページ`, en: `${index}th page` },
		...Array.from({ length: 1000 }, () => ({ ja: uuidv4(), en: uuidv4() })),
	];
}

// ディレクトリがない場合は作成
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

// 1000 個のファイルを生成
for (let i = 1; i <= 1000; i++) {
	const filename = path.join(dir, `${i}.yml`);
	const content = generateComplexContent(i);

	// ファイルを書き込む
	fs.writeFileSync(filename, dump(content), "utf8");
}

console.log("1000 files created!");

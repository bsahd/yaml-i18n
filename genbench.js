import fs from "fs";
import path from "path";

// ベンチマーク用ディレクトリ
const dir = path.join(import.meta.dirname, "src", "benchmarks");

// ディレクトリがない場合は作成
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

// 1000 個のファイルを生成
for (let i = 1; i <= 1000; i++) {
	const filename = path.join(dir, `${i}.yml`);
	const content = `- "benchmark file"`;

	// ファイルを書き込む
	fs.writeFileSync(filename, content, "utf8");
}

console.log("1000 files created!");

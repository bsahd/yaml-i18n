**ja:100%** [en:100%](../en/README.md)

# 使い方
1. `./src/`の中に多言語ドキュメントYAMLを書く。
2. 生成する言語とメイン言語を含む設定ファイルを`./doc.config.yml`に書く。
3. カレントディレクトリを`conv.js`のあるディレクトリに移動する
4. `node conv.js`を実行する
5. 生成されたマークダウンは言語別で`./dist/<language>/<src filename>`にあります。
6. `./dist/`内のmarkdownをデプロイする
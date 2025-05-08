[ja:100%](../ja/README.md) **en:100%**

# Usage
1. Write content multilingal document YAML to under `./src/`.
2. Write config includes languages to generate and main language to `./doc.config.yml`.
3. Set current directory to directory includes `conv.js`.
4. Run `node conv.js`.
5. Generated markdowns separeted by language is in `./dist/<language>/<src filename>`.
6. Deploy document from markdown in `./dist/`.
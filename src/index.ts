import path from "path";
import fs from "fs";
import recursive from "recursive-readdir";
import { isText } from "istextorbinary";
import css from "css";
import { Table } from "console-table-printer";

const RULE: string = "rule";
const MEDIA: string = "media";
type AllCssRule = css.Rule | css.Comment | css.AtRule;

class RefineCss {
	private _inputDir: string;
	private _projectPath: string;

	constructor(inputDir: string = "./dist") {
		this._projectPath = process.cwd();
		this._inputDir = path.resolve(this._projectPath, inputDir);
	}

	start() {
		this.analyzeFiles().then((inputFiles) => {
			const cssFiles: Array<inputFile> = inputFiles.filter(
				(f) => f.extention === "css"
			);
			const noneCssContent: string = inputFiles
				.filter((f) => f.extention !== "css")
				.map((f) => f.content)
				.join("");

			const allWordsInContent: Words =
				this.getAllWordsInContent(noneCssContent);

			const outputCssFiles: Array<Promise<outputCssFile>> = cssFiles.map(
				async (f) => {
					const cssObj: css.Stylesheet = css.parse(f.content);
					const cssRules: Array<AllCssRule> = cssObj.stylesheet?.rules || [];
					const filteredCssRules = this.filterRules(
						cssRules,
						allWordsInContent
					);

					// create filtered css object
					const filteredCssObj: css.Stylesheet = {
						...cssObj,
						stylesheet: {
							...cssObj.stylesheet,
							rules: filteredCssRules,
						},
					};

					// write css file and getsize
					const cssContent: string = css.stringify(filteredCssObj, {
						compress: f.isMinify,
					});
					return this.writeFile(f.path, cssContent).then((fileSize) => {
						return {
							path: f.path,
							inputSize: f.size,
							outputSize: fileSize,
						};
					});
				}
			);

			this.printResults(outputCssFiles);
		});
	}

	private async analyzeFiles(): Promise<Array<inputFile>> {
		return new Promise(async (reslove, reject) => {
			recursive(this._inputDir, (error, filePaths) => {
				if (error) {
					reject(error);
				}

				const inputFiles: Array<inputFile> = filePaths.map((filePath) => {
					const extention: string = filePath.split(".").pop() || "";
					const content: string = this.readFile(filePath);
					const size: number = this.getFileSize(filePath);
					let isMinify: boolean = false;

					if (extention === "css") {
						isMinify = this.isMinify(content);
					}

					return {
						path: filePath,
						extention,
						content,
						size,
						isMinify,
					};
				});

				reslove(inputFiles);
			});
		});
	}

	private filterRules(
		rules: Array<AllCssRule>,
		contentWords: Words
	): Array<AllCssRule> {
		const filteredRules: Array<AllCssRule> = rules
			.map((rule): AllCssRule => {
				switch (rule.type) {
					case RULE: {
						const ruleNode: css.Rule = rule;
						const selectors: Array<string> = ruleNode.selectors || [];
						const filteredSelectors: Array<string> = this.filterSelectors(
							selectors,
							contentWords
						);
						return {
							...rule,
							selectors: filteredSelectors,
						};
					}

					case MEDIA: {
						const mediaNode: css.Media = rule;
						const rulesInsideMedia: Array<AllCssRule> = mediaNode.rules || [];
						return {
							...rule,
							rules: this.filterRules(rulesInsideMedia, contentWords),
						};
					}

					default: {
						return rule;
					}
				}
			})
			.filter((rule): boolean => {
				switch (rule.type) {
					case RULE: {
						const ruleNode: css.Rule = rule;
						const selectors: Array<string> = ruleNode.selectors || [];
						return selectors.length !== 0;
					}
					case MEDIA: {
						const mediaNode: css.Media = rule;
						const rulesInsideMedia: Array<AllCssRule> = mediaNode.rules || [];
						return rulesInsideMedia.length !== 0;
					}

					default:
						return true;
				}
			});
		return filteredRules;
	}

	private filterSelectors(
		selectors: Array<string>,
		contentWords: Words
	): Array<string> {
		const usedSelectors: Array<string> = [];

		selectors.forEach((selector) => {
			const words: Array<string> = this.getAllWordsInSelector(selector);
			const usedWords = words.filter((word) => contentWords[word]);

			if (usedWords.length === words.length) {
				usedSelectors.push(selector);
			}
		});

		return usedSelectors;
	}

	private getAllWordsInContent(content: string): Words {
		content = content.toLowerCase();
		let used: Words = {
			// Always include html and body.
			html: true,
			body: true,
		};
		const words: Array<string> = content.split(/[^a-z]/g);
		for (let word of words) {
			used[word] = true;
		}
		return used;
	}

	private getAllWordsInSelector(selector: string): Array<string> {
		// Remove attr selectors. "a[href...]"" will become "a".
		selector = selector.replace(/\[(.+?)\]/g, "").toLowerCase();
		// If complex attr selector (has a bracket in it) just leave
		// the selector in. ¯\_(ツ)_/¯
		if (selector.includes("[") || selector.includes("]")) {
			return [];
		}

		let skipNextWord: boolean = false;
		let word: string = "";
		let words: Array<string> = [];

		for (let letter of selector) {
			if (skipNextWord && !/[ #.]/.test(letter)) continue;
			// If pseudoclass or universal selector, skip the next word
			if (/[:*]/.test(letter)) {
				if (word) words.push(word);
				word = "";
				skipNextWord = true;
				continue;
			}
			if (/[a-z]/.test(letter)) {
				word += letter;
			} else {
				if (word) words.push(word);
				word = "";
				skipNextWord = false;
			}
		}

		if (word) words.push(word);
		return words;
	}

	private readFile(filePath: string): string {
		if (isText(filePath)) {
			// if file is text
			const rawData = fs.readFileSync(filePath);
			return rawData.toString();
		}
		return ""; // if file is binary
	}

	private writeFile(filePath: string, content: string): Promise<number> {
		const filePathDir = path.parse(filePath).dir;

		// find dir
		if (!fs.existsSync(filePathDir)) {
			// if dir not exists create new dir
			fs.mkdirSync(filePathDir, { recursive: true });
		}

		const fileSize: Promise<number> = new Promise((reslove, reject) => {
			fs.writeFile(filePath, content, (err) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					reslove(this.getFileSize(filePath));
				}
			});
		});

		return fileSize;
	}

	private getFileSize(filePath: string): number {
		return fs.statSync(filePath).size;
	}

	private isMinify(content: string): boolean {
		return content.split(/\r\n|\r|\n/).length === 1;
	}

	private toKB(fileSize: number): string {
		return `${Math.round((fileSize / 1024) * 100) / 100} kb`;
	}

	private async printResults(
		outputData: Array<Promise<outputCssFile>>
	): Promise<void> {
		const dataObjects: Array<outputCssFile> = await Promise.all(outputData);

		const p = new Table({
			title: "Results of Refine CSS",
			columns: [
				{
					name: "path",
					alignment: "left",
					title: "CSS File",
				},
				{
					name: "inputSize",
					alignment: "left",
					title: "After Refine",
				},
				{
					name: "outputSize",
					alignment: "left",
					title: "Before Refine",
				},
			],
		});

		dataObjects.forEach((dataObj) => {
			p.addRow(
				{
					path: dataObj.path.replace(this._projectPath, "."),
					inputSize: this.toKB(dataObj.inputSize),
					outputSize: this.toKB(dataObj.outputSize),
				},
				{ color: "cyan" }
			);
		});

		p.printTable();
	}
}

export default RefineCss;

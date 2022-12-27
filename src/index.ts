import path from "path";
import fs from "fs";
import recursive from "recursive-readdir";
import { isText } from "istextorbinary";

class RefineCss {
	private _inputDir: string;

	constructor(inputDir: string = "./dist") {
		const projectPath: string = process.cwd();
		this._inputDir = path.resolve(projectPath, inputDir);
	}

	start() {
		this.analyzeFiles().then((inputFiles) => {
			console.log(inputFiles);
		});
	}

	private async analyzeFiles(): Promise<Array<inputFile>> {
		return new Promise(async (reslove, reject) => {
			recursive(this._inputDir, (error, filePaths) => {
				if (error) {
					reject(error);
				}

				const inputFiles: Array<inputFile> = filePaths.map((filePath) => {
					return {
						path: filePath,
						extention: filePath.split(".").pop() || "",
						content: this.readFile(filePath),
					};
				});

				reslove(inputFiles);
			});
		});
	}

	private readFile(filePath: string): string {
		if (isText(filePath)) {
			// if file is text
			const rawData = fs.readFileSync(filePath);
			return rawData.toString();
		}
		return ""; // if file is binary
	}
}

export default RefineCss;

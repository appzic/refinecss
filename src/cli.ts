#!/usr/bin/env node

import * as yargs from "yargs";
import RefineCss from "./index";

const yarg = yargs;

main();

async function main(): Promise<void> {
	const argv = yarg.argv;

	// get input directory
	let inputDir: string = "";
	if (argv._ && argv._[0]) {
		inputDir = argv._[0] as string;
	} else {
		yarg.showHelp();
		return;
	}

	const refineCss = new RefineCss();
	refineCss.start();
}

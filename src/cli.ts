#!/usr/bin/env node

import * as yargs from "yargs";
import RefineCss from "./index";

const yarg = yargs
	.usage(
		"Post build unused css remover\nUsage: $0 <directory of final build> [options]"
	)
	.example(
		"$0 ./out",
		"with the directory of final build.\n (default build directory: ./dist)"
	);

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

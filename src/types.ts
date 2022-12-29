type inputFile = {
	path: string;
	extention: string;
	content: string;
	size: number; // in bytes
	isMinify: boolean;
};

type outputCssFile = {
	path: string;
	inputSize: number;
	outputSize: number;
};

type Words = {
	[key: string]: boolean;
};

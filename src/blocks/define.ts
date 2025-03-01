type BreedInfo = [string, string];

let turtleBreeds: BreedInfo[] = [
	["turtles", "turtle"]
];

let undirectedLinkBreeds: BreedInfo[] = [];

let directedLinkBreeds: BreedInfo[] = [];

let linkBreeds: BreedInfo[] = [
	["links", "link"],
	...undirectedLinkBreeds,
	...directedLinkBreeds
];

let breeds: BreedInfo[] = [
	...turtleBreeds,
	...linkBreeds
];

export let breedPlurals: string[] = toPluralArray(breeds);

export let agentSets: string[] = toPluralArray([
	["patches", "patch"],
	...turtleBreeds,
	...linkBreeds
]);

function toPluralArray(array: BreedInfo[]): string[] {
	return array.map(([plural]) => plural);
}

function refreshBreeds(): void {
	breeds = [
		...turtleBreeds,
		...linkBreeds
	];
	breedPlurals = toPluralArray(breeds);
	agentSets = toPluralArray([
		["patches", "patch"],
		...turtleBreeds,
		...linkBreeds
	]);
}

export function resetBreeds(): void {
	turtleBreeds = [
		["turtles", "turtle"]
	];
	undirectedLinkBreeds = [];
	directedLinkBreeds = [];
	linkBreeds = [
		["links", "link"],
		...undirectedLinkBreeds,
		...directedLinkBreeds
	];
	refreshBreeds();
}

export function addBreed(type: string, breedInfo: BreedInfo): void {
	switch (type) {
		case "turtle":
			turtleBreeds.push(breedInfo);
			break;
		case "ulink":
		case "undirected-link":
			undirectedLinkBreeds.push(breedInfo);
			break;
		case "dlink":
		case "directed-link":
			directedLinkBreeds.push(breedInfo);
			break;
		default:
			alert(`Unsupported breed type: ${type}`);
			return;
	}

	linkBreeds = [
		["links", "link"],
		...undirectedLinkBreeds,
		...directedLinkBreeds
	];
	breeds = [
		...turtleBreeds,
		...linkBreeds
	];
	refreshBreeds();
}

// basic block definition
interface BasicBlock {
	type: string;
	message0: string;
	previousStatement: null;
	nextStatement: null;
}

export function defineBasicBlock(type: string): BasicBlock {
	return {
		type,
		message0: type.replace("_", "-"),
		previousStatement: null,
		nextStatement: null
	};
}

export function defineBasicBlocks(...types: string[]): BasicBlock[] {
	return types.map(type => defineBasicBlock(type));
}
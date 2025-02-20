let turtleBreeds = [
	["turtles", "turtle"]
];

let undirectedLinkBreeds = [];

let directedLinkBreeds = [];

let linkBreeds = [
	["links", "link"],
	...undirectedLinkBreeds,
	...directedLinkBreeds
];

let breeds = [
	...turtleBreeds,
	...linkBreeds
];

export let breedPlurals = toPluralArray(breeds);

export let agentSets = toPluralArray([
	["patches", "patch"],
	...turtleBreeds,
	...linkBreeds
]);

function toPluralArray(array) {
	return array.map(([plural,]) => plural);
}

function refreshBreeds() {
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

export function resetBreeds() {
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

export function addBreed(type, breedInfo) {
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
			alert(`unsupported breed type: ${type}`);
			break;
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

export function defineBasicBlock(type) {
	return {
		type,
		message0: type.replace("_", "-"),
		previousStatement: null,
		nextStatement: null
	};
}

export function defineBasicBlocks(...types) {
	return types.map(type => defineBasicBlock(type));
}

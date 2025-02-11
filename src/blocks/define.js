const turtleBreeds = [
	["turtles", "turtle"]
]

const undirectedLinkBreeds = []

const directedLinkBreeds = []

const linkBreeds = [
	["links", "link"],
	...undirectedLinkBreeds,
	...directedLinkBreeds
]

const breeds = [
	...turtleBreeds,
	...linkBreeds
];

export const breedPlurals = toPluralArray(breeds);

export const agentSets = toPluralArray([
	["patches", "patch"],
	["teachers", "teacher"],
	...turtleBreeds,
	...linkBreeds
]);

function toPluralArray(array) {
	return array.map(([plural,]) => plural);
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

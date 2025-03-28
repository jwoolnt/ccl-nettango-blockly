type Breed = [string, string];

let turtleBreeds: Breed[] = [
	["turtles", "turtle"]
];

let undirectedLinkBreeds: Breed[] = [];

let directedLinkBreeds: Breed[] = [];


export function getTurtleBreeds(): Breed[] {
	return turtleBreeds;
}

export function getLinkBreeds(): Breed[] {
	return [
		["links", "link"],
		...undirectedLinkBreeds,
		...directedLinkBreeds
	];
}

export function getBreeds(): Breed[] {
	return [
		...getTurtleBreeds(),
		...getLinkBreeds()
	];
}

export function getAgentSets(): Breed[] {
	return [
		["patches", "patch"],
		...getBreeds()
	];
}

export function specifyPlurality(breeds: Breed[], plural: boolean): string[] {
	if (plural) {
		return breeds.map(([plural,]) => plural);
	} else {
		return breeds.map(([, singular]) => singular);
	}
}

export function addBreed(type: string, breed: Breed) {
	// TODO: breed words (singular or plural) cannot be repeated
	// TODO: breeds cannot be commands (e.g. repeat, random, if)
	switch (type) {
		case "turtle":
			turtleBreeds.push(breed);
			break;
		case "ulink":
		case "undirected-link":
			undirectedLinkBreeds.push(breed);
			break;
		case "dlink":
		case "directed-link":
			directedLinkBreeds.push(breed);
			break;
		default:
			console.error(`Unsupported type: ${type}`);
			break;
	}
}

export function removeBreed(type: string, targetBreed: Breed) {
	switch (type) {
		case "turtle":
			turtleBreeds = turtleBreeds.filter(breed => breed !== targetBreed);
			break;
		case "ulink":
		case "undirected-link":
			undirectedLinkBreeds = undirectedLinkBreeds.filter(breed => breed !== targetBreed);
			break;
		case "dlink":
		case "directed-link":
			directedLinkBreeds = directedLinkBreeds.filter(breed => breed !== targetBreed);
			break;
		default:
			console.error(`Unsupported type: ${type}`);
			break;
	}
}

export function resetBreeds(): void {
	turtleBreeds = [
		["turtles", "turtle"]
	];
	undirectedLinkBreeds = [];
	directedLinkBreeds = [];
}

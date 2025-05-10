import { serialization } from "blockly";


export type BreedType = "turtle" | "undirected-link" | "ulink" | "directed-link" | "dlink";

type Breed = [string, string];

interface BreedState {
	turtleBreeds: Breed[];
	undirectedLinkBreeds: Breed[];
	directedLinkBreeds: Breed[];
}


const BREED_STATE: BreedState = {
	turtleBreeds: [],
	undirectedLinkBreeds: [],
	directedLinkBreeds: []
}

export const BREED_SERIALIZER: serialization.ISerializer = {
	priority: serialization.priorities.VARIABLES,
	clear: () => {
		BREED_STATE.turtleBreeds = [];
		BREED_STATE.undirectedLinkBreeds = [];
		BREED_STATE.directedLinkBreeds = [];
	},
	load: (state: BreedState) => {
		BREED_STATE.turtleBreeds = state.turtleBreeds;
		BREED_STATE.undirectedLinkBreeds = state.undirectedLinkBreeds;
		BREED_STATE.directedLinkBreeds = state.directedLinkBreeds;
	},
	save: () => BREED_STATE
}


export function getTurtleBreeds(): Breed[] {
	return [
		["turtles", "turtle"],
		...BREED_STATE.turtleBreeds
	];
}

export function getLinkBreeds(): Breed[] {
	return [
		["links", "link"],
		...BREED_STATE.undirectedLinkBreeds,
		...BREED_STATE.directedLinkBreeds
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

export const plural = ([plural,]: Breed) => plural;

export const singular = ([, singular]: Breed) => singular;

export const specifyPlurality = (breeds: Breed[], plural_: boolean) =>
	breeds.map(plural_ ? plural : singular);

export function addBreed(type: BreedType, breed: Breed) {
	// TODO: breed words (singular or plural) cannot be repeated
	// TODO: breeds cannot be commands (e.g. repeat, random, if)
	switch (type) {
		case "turtle":
			BREED_STATE.turtleBreeds.push(breed);
			break;
		case "ulink":
		case "undirected-link":
			BREED_STATE.undirectedLinkBreeds.push(breed);
			break;
		case "dlink":
		case "directed-link":
			BREED_STATE.directedLinkBreeds.push(breed);
			break;
		default:
			console.error(`Unsupported type: ${type}`);
			break;
	}
}

export function removeBreed(targetBreed: Breed | string) {
	const FILTER = (targetBreed instanceof Array) ?
		(breed: Breed) => breed !== targetBreed :
		(breed: Breed) => plural(breed) !== targetBreed && singular(breed) !== targetBreed;

	BREED_STATE.turtleBreeds = BREED_STATE.turtleBreeds.filter(FILTER);
	BREED_STATE.undirectedLinkBreeds = BREED_STATE.undirectedLinkBreeds.filter(FILTER);
	BREED_STATE.directedLinkBreeds = BREED_STATE.directedLinkBreeds.filter(FILTER);
}

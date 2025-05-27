import { serialization, Workspace } from "blockly";


type DefaultVariableTypes = "ui" | "globals" | "turtles" | "patches" | "links"

export type BreedType = "turtle" | "undirected-link" | "directed-link"

export interface Breed {
	type: BreedType,
	pluralName: string,
	singularName: string,
	variables?: string[]
}

interface NetlogoContext {
	ui: string[];
	globals: string[];
	turtles: string[];
	patches: string[];
	links: string[];
	breeds: Breed[];
	lists: Record<string, ListType>;
}

export interface ListType {
	name: string;
	elements: any[];
}

const DEFAULT_VARIABLE_TYPES: DefaultVariableTypes[] = ["ui", "globals", "turtles", "patches", "links"];

function isDefaultVariableType(type: string): type is DefaultVariableTypes {
	return DEFAULT_VARIABLE_TYPES.includes(type as DefaultVariableTypes);
}

const DEFAULT_CONTEXT: NetlogoContext = {
	ui: [],
	globals: [],
	turtles: [],
	patches: [],
	links: [],
	breeds: [],
	lists: {}
};


let context: NetlogoContext = { ...DEFAULT_CONTEXT };

let variableType: Record<string, string> = {};

export let refreshMITPlugin = () => { };


export const CONTEXT_SERIALIZER: serialization.ISerializer = {
	priority: serialization.priorities.VARIABLES,
	clear: (workspace: Workspace) => {
		context = DEFAULT_CONTEXT;
		variableType = {};

		//@ts-expect-error
		workspace.getWarningHandler().cacheGlobalNames = true;
		//@ts-expect-error
		refreshMITPlugin = () => workspace.getWarningHandler().cachedGlobalNames = getAllVariables();

		refreshMITPlugin();
	},
	load: (state: NetlogoContext) => {
		context = state;

		DEFAULT_VARIABLE_TYPES.forEach(type =>
			context[type].forEach(variableName =>
				variableType[variableName] = type
			)
		);

		context.breeds.forEach(breed =>
			breed.variables?.forEach(variableName =>
				variableType[variableName] = breed.pluralName
			)
		);

		refreshMITPlugin();
	},
	save: () => context
}


export function getGlobalVariables(): string[] {
	return [...context.globals];
}

export function getVariables(type: string): string[] | undefined {
	if (isDefaultVariableType(type)) {
		return context[type];
	} else {
		let targetBreed = findBreed(type);
		return targetBreed ? targetBreed.variables ?? [] : undefined;
	}
}

export function getAllVariables(): string[] {
	return Object.keys(variableType);
}


export function findVariable(...names: (undefined | string | string[])[]): string[] {
	let namesFlat = names.flat();
	return getAllVariables().filter(variableName => namesFlat.includes(variableName));
}

export function addVariable(name: string, type: string = "globals"): void {
	let breed = findBreed(type);

	if (findVariable(name).length) {
		console.error(`Invalid Variable: cannot reuse name "${name}"`);
		return;
	} else if (isDefaultVariableType(type)) {
		context[type].push(name);
	} else if (breed) {
		breed.variables = [...breed.variables ?? [], name];
		updateBreed(breed.pluralName, breed);
	} else {
		console.error(`Invalid Breed: breed "${type}" could not be found`);
		return;
	}

	variableType[name] = type;
}

export function updateVariable(currentName: string, updateData: string, updateName: boolean = true): void {
	if (findVariable(currentName).length) {
		if (updateName) {
			let type = variableType[currentName];
			removeVariable(currentName);
			addVariable(updateData, type);
		} else {
			removeVariable(currentName);
			addVariable(currentName, updateData);
		}
	} else {
		console.error(`Invalid Variable: variable "${currentName}" could not be found`);
	}
}

export function removeVariable(name: string): void {
	let type = variableType[name];
	let breed = findBreed(type);

	if (!findVariable(name).length) {
		console.error(`Invalid Variable: variable "${name}" could not be found`);
		return;
	} else if (isDefaultVariableType(type)) {
		context[type] = context[type].filter(variableName => variableName != name);
	} else if (breed) {
		breed.variables = breed.variables?.filter(variableName => variableName != name);
		updateBreed(breed.pluralName, breed);
	} else {
		console.error(`Invalid Breed: breed "${type}}" could not be found`);
		return;
	}

	delete variableType[name];
}


export function getTurtleBreeds(): Breed[] {
	return context.breeds.filter(({ type }) => type == "turtle");
}

export function getLinkBreeds(): Breed[] {
	return context.breeds.filter(({ type }) => type != "turtle");
}

export function getAllBreeds(): Breed[] {
	return [...context.breeds];
}


export function findBreed(name: string): Breed | undefined {
	let result = context.breeds.find(({ pluralName }) => pluralName === name);
	return result ? { ...result } : undefined;
}

export function addBreed(newBreed: Breed): void {
	let { pluralName, singularName, variables } = newBreed;
	let usedVariables = findVariable(pluralName, singularName, variables);

	if (usedVariables.length === 0) {
		context.breeds.push(newBreed);
	} else {
		console.error(`Invalid Breed: cannot reuse names ["${usedVariables.join(",\" \"")}"]`);
	}
}

export function updateBreed(currentName: string, breedUpdates: Partial<Breed>): void {
	let oldBreed = findBreed(currentName);

	if (oldBreed) {
		let newBreed = {
			...oldBreed,
			...breedUpdates
		};

		let { pluralName, singularName, variables } = newBreed;
		let usedVariables = findVariable(pluralName, singularName, variables);
		let breedVariables = getVariables(currentName);

		if (breedVariables) {
			usedVariables = usedVariables.filter(variableName => !breedVariables.includes(variableName));
		}

		if (usedVariables.length === 0) {
			removeBreed(currentName);
			addBreed(newBreed);
		} else {
			console.error(`Invalid Breed: cannot reuse names ["${usedVariables.join(",\" \"")}"]`);
		}
	} else {
		console.error(`Invalid Breed: breed "${currentName}}" could not be found`);
	}
}

export function removeBreed(breedName: string): void {
	if (findBreed(breedName)) {
		context.breeds = context.breeds.filter(({ pluralName }) => pluralName !== breedName);
	} else {
		console.error(`Invalid Breed: breed "${breedName}}" could not be found`);
	}
}


function getAgentSets(defaultAgentSets: string[], breedFunction: () => Breed[]) {
	return function () {
		let agentSets = [...defaultAgentSets];

		agentSets.push(
			...breedFunction().map(({ pluralName }) => pluralName)
		);

		return agentSets;
	}
}

export const getTurteAgentSets = getAgentSets(["turtles"], getTurtleBreeds);

export const getLinkAgentSets = getAgentSets(["links"], getLinkBreeds);

export const getAllAgentSets = getAgentSets(["turtles", "patches", "links"], getAllBreeds);

export function addList(name: string, elements: any[] = []): void {
	let list: ListType = { name, elements };
	context.lists[name] = list;
}

export function removeList(name: string): void {
	if (context.lists[name]) {
		delete context.lists[name];
	} else {
		console.error(`Invalid List: list "${name}" could not be found`);
	}
}

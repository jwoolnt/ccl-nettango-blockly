import { serialization, Workspace } from "blockly";


type DefaultVariableTypes = "ui" | "globals" | "turtles" | "patches" | "links"

export type BreedType = "turtle" | "undirected-link" | "directed-link"

export interface Breed {
	type: BreedType,
	pluralName: string,
	singularName: string,
	variables?: string[]
}

export interface VariableControl {
	type: 'slider' | 'switch' | 'input' | 'chooser';
	enabled: boolean;
	min?: number;
	max?: number;
	step?: number;
	options?: string[]; // For chooser type
}

interface NetlogoContext {
	ui: string[];
	globals: string[];
	turtles: string[];
	patches: string[];
	links: string[];
	breeds?: Breed[];
	variableControls?: Record<string, VariableControl>;
	variableValues?: Record<string, any>;
}

const DEFAULT_VARIABLE_TYPES: DefaultVariableTypes[] = ["ui", "globals", "turtles", "patches", "links"];

function isDefaultVariableType(type: string): type is DefaultVariableTypes {
	return DEFAULT_VARIABLE_TYPES.includes(type as DefaultVariableTypes);
}


const BUILT_IN_CONTEXT: NetlogoContext = {
	ui: [],
	globals: [],
	turtles: [
		"breed",
		"color",
		"heading",
		"hidden?",
		"label",
		"label-color",
		"pen-mode",
		"pen-size",
		"shape",
		"size",
		"who",
		"xcor",
		"ycor"
	],
	patches: [
		"pcolor",
		"plabel",
		"plabel",
		"color",
		"pxcor",
		"min-pxcor",
		"pycor"
	],
	links: [
		"breed",
		"color",
		"end1",
		"end2",
		"hidden?",
		"label",
		"label-color",
		"shape",
		"thickness",
		"tie-mode"
	]
};

const DEFAULT_CONTEXT: NetlogoContext = {
	ui: [],
	globals: [],
	turtles: [],
	patches: [],
	links: []
};

const DEFAULT_VARIABLE_MAP: Record<string, string> = {};
DEFAULT_VARIABLE_TYPES.forEach(type =>
	BUILT_IN_CONTEXT[type].forEach(variableName =>
		DEFAULT_VARIABLE_MAP[variableName] = "built-in"
	)
);


let context: NetlogoContext = { ...DEFAULT_CONTEXT };

let variableMap: Record<string, string> = { ...DEFAULT_VARIABLE_MAP };

export let refreshMITPlugin = () => { };

// Registry for variable tracker serialization functions
let getVariableControlsDataFn: (() => Record<string, VariableControl>) | null = null;
let getVariableValuesDataFn: (() => Record<string, any>) | null = null;
let setVariableControlsDataFn: ((data: Record<string, VariableControl>) => void) | null = null;
let setVariableValuesDataFn: ((data: Record<string, any>) => void) | null = null;

export function registerVariableTrackerSerializers(
	getControls: () => Record<string, VariableControl>,
	getValues: () => Record<string, any>,
	setControls: (data: Record<string, VariableControl>) => void,
	setValues: (data: Record<string, any>) => void
) {
	getVariableControlsDataFn = getControls;
	getVariableValuesDataFn = getValues;
	setVariableControlsDataFn = setControls;
	setVariableValuesDataFn = setValues;
}


export const CONTEXT_SERIALIZER: serialization.ISerializer = {
	priority: serialization.priorities.VARIABLES,
	clear: (workspace: Workspace) => {
		context = { ...DEFAULT_CONTEXT };
		variableMap = { ...DEFAULT_VARIABLE_MAP };

		// Clear variable controls and values
		if (setVariableControlsDataFn) {
			setVariableControlsDataFn({});
		}
		if (setVariableValuesDataFn) {
			setVariableValuesDataFn({});
		}

		//@ts-expect-error
		workspace.getWarningHandler().cacheGlobalNames = true;
		refreshMITPlugin = () => {
			const allVars = getAllVariables();
			// Add "create new" option at the start
			(workspace as any).getWarningHandler().cachedGlobalNames = [
				'+ create new variable',
				...allVars
			];
		};
		////@ts-expect-error
		// refreshMITPlugin = () => workspace.getWarningHandler().cachedGlobalNames = getAllVariables();

		refreshMITPlugin();
	},
	load: (state: NetlogoContext) => {
		context = state;

		DEFAULT_VARIABLE_TYPES.forEach(type =>
			context[type].forEach(variableName => {
				if (variableMap[variableName] === "built-in") {
					console.warn(`"${variableName}" shadows a built-in`);
				}
				variableMap[variableName] = type;
			}
			)
		);

		context.breeds?.forEach(breed =>
			breed.variables?.forEach(variableName =>
				variableMap[variableName] = breed.pluralName
			)
		);

		// Restore variable controls and values if available
		if (state.variableControls && setVariableControlsDataFn) {
			setVariableControlsDataFn(state.variableControls);
		}
		if (state.variableValues && setVariableValuesDataFn) {
			setVariableValuesDataFn(state.variableValues);
		}

		refreshMITPlugin();
	},
	save: () => {
		const savedContext: NetlogoContext = { ...context };
		
		// Include variable controls and values if available
		if (getVariableControlsDataFn) {
			savedContext.variableControls = getVariableControlsDataFn();
		}
		if (getVariableValuesDataFn) {
			savedContext.variableValues = getVariableValuesDataFn();
		}
		
		return savedContext;
	}
}


export function getGlobalVariables(): string[] {
	return [...context.globals];
}

export function getUIVariables(): string[] {
	return [...context.ui];
}

export function getVariables(type: string, includeBuiltIn: boolean = false): string[] | undefined {
	if (isDefaultVariableType(type)) {
		return includeBuiltIn ? [...BUILT_IN_CONTEXT[type], ...context[type]] : [...context[type]];
	} else {
		let targetBreed = findBreed(type);
		return targetBreed?.variables ? [...targetBreed.variables] : undefined;
	}
}

export function getAllVariables(): string[] {
	return Object.keys(variableMap);
}

// Returns only user-created variables, excluding any built-ins
export function getUserVariables(): string[] {
	return Object.entries(variableMap)
		.filter(([, type]) => type !== "built-in")
		.map(([name]) => name);
}

// Get the owning scope/type for a variable name (e.g., "globals", "turtles", a breed pluralName)
export function getVariableOwner(name: string): string | undefined {
	return variableMap[name];
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

	variableMap[name] = type;
	refreshMITPlugin();
}

export function updateVariable(currentName: string, updateData: string, updateName: boolean = true): void {
	if (findVariable(currentName).length) {
		let type = variableMap[currentName];

		if (type == "built-in") {
			console.error(`Built-In Variable: variable "${name}" cannot be updated`);
			return;
		} else if (updateName) {
			removeVariable(currentName);
			addVariable(updateData, type);
		} else {
			removeVariable(currentName);
			addVariable(currentName, updateData);
		}
	} else {
		console.error(`Invalid Variable: variable "${currentName}" could not be found`);
	}
	refreshMITPlugin();
}

export function removeVariable(name: string): void {
	let type = variableMap[name];
	let breed = findBreed(type);

	if (type == "built-in") {
		console.error(`Built-In Variable: variable "${name}" cannot be removed`);
		return;
	} else if (!findVariable(name).length) {
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

	delete variableMap[name];
	refreshMITPlugin();
}


export function getTurtleBreeds(): Breed[] {
	return context.breeds?.filter(({ type }) => type == "turtle") || [];
}

export function getLinkBreeds(): Breed[] {
	return context.breeds?.filter(({ type }) => type != "turtle") || [];
}

export function getAllBreeds(): Breed[] {
	return context.breeds ? [...context.breeds] : [];
}


export function findBreed(name: string): Breed | undefined {
	let result = context.breeds?.find(({ pluralName }) => pluralName === name);
	return result ? { ...result } : undefined;
}

export function addBreed(newBreed: Breed): void {
	let { pluralName, singularName, variables } = newBreed;
	let usedVariables = findVariable(pluralName, singularName, variables);

	if (usedVariables.length === 0) {
		if (context.breeds == undefined) {
			context.breeds = [];
		}
		context.breeds.push(newBreed);

		// Add breed variables to the variable map
		if (variables) {
			variables.forEach(variableName => {
				variableMap[variableName] = pluralName;
			});
		}
	} else {
		console.error(`Invalid Breed: cannot reuse names ["${usedVariables.join(",\" \"")}"]`);
	}

	refreshMITPlugin();
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

	refreshMITPlugin();
}

export function removeBreed(breedName: string): void {
	let breed = findBreed(breedName);

	if (context.breeds && breed) {
		// Remove breed names and variables from variableMap before removing the breed
		// so the same names to be reused when recreating the breed
		if (breed.pluralName) {
			delete variableMap[breed.pluralName];
		}
		if (breed.singularName) {
			delete variableMap[breed.singularName];
		}
		if (breed.variables) {
			breed.variables.forEach(variableName => {
				delete variableMap[variableName];
			});
		}

		context.breeds = context.breeds.filter(({ pluralName }) => pluralName !== breedName);
	} else {
		console.error(`Invalid Breed: breed "${breedName}}" could not be found`);
	}

	refreshMITPlugin();
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

export const getTurtleAgentSets = () => {
  const agentSets = [
    '',
    '+ create new breed',
    "turtles"
  ];
  agentSets.push(
    ...getTurtleBreeds().map(({ pluralName }) => pluralName)
  );
  return agentSets;
};

export const getLinkAgentSets = () => {
  const agentSets = [
    '',
    '+ create new breed',
    "links"
  ];
  agentSets.push(
    ...getLinkBreeds().map(({ pluralName }) => pluralName)
  );
  return agentSets;
};

export const getAllAgentSets = () => {
  const agentSets = [
    '',
    '+ create new breed',
    "turtles", 
    "patches", 
    "links", 
    "neighbors4"
  ];
  agentSets.push(
    ...getAllBreeds().map(({ pluralName }) => pluralName)
  );
  return agentSets;
};
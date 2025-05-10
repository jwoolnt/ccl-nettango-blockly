import { serialization } from "blockly";
import { getAgentSets, specifyPlurality } from "./breeds";


const VARIABLE_STATE: Record<string, string[]> = {
	"globals": []
};

export const VARIABLE_SERIALIZER: serialization.ISerializer = {
	priority: serialization.priorities.VARIABLES,
	clear: () => {
		for (const key in VARIABLE_STATE) {
			delete VARIABLE_STATE[key];
		}
		VARIABLE_STATE["globals"] = [];
	},
	load: (state: Record<string, string[]>, workspace) => {
		for (const key in state) {
			VARIABLE_STATE[key] = state[key];
		}
		//@ts-expect-error
		workspace.getWarningHandler().cacheGlobalNames = true;
		//@ts-expect-error
		workspace.getWarningHandler().cachedGlobalNames = getGlobals();
	},
	save: () => VARIABLE_STATE
}

export const getGlobals = (includeDefault: boolean = true) => [...VARIABLE_STATE["globals"]];

export function getBreedVariables(includeDefault: boolean = true) {
	const result = { ...VARIABLE_STATE };
	delete result["globals"];
	return result;
}

export function addVariable(name: string, breed?: string) {
	if (!breed) {
		VARIABLE_STATE["globals"].push(name);
	} else if (specifyPlurality(getAgentSets(), true).includes(breed)) {
		if (!VARIABLE_STATE[breed]) {
			VARIABLE_STATE[breed] = [];
		}
		VARIABLE_STATE[breed].push(name);
	} else {
		console.error(`Invalid Breed: ${breed}`);
	}
}

export function renameVariable(oldName: string, newName: string) {
	addVariable(newName, removeVariable(oldName));
}

export function renameVariableBreed(oldName: string, newName: string) {
	if (VARIABLE_STATE[oldName]) {
		VARIABLE_STATE[newName] = VARIABLE_STATE[oldName];
		delete VARIABLE_STATE[oldName];
	} else {
		console.error(`Invalid Breed: ${oldName}`);
	}
}

export function removeVariable(name: string) {
	for (const key in VARIABLE_STATE) {
		const i = VARIABLE_STATE[key].indexOf(name);
		if (i != -1) {
			VARIABLE_STATE[key].splice(i, 1);
			if (VARIABLE_STATE[key].length == 0) {
				delete VARIABLE_STATE[key];
			}
			return key;
		}
	}
}

export function removeVariableBreed(targetBreed: string) {
	delete VARIABLE_STATE[targetBreed];
}

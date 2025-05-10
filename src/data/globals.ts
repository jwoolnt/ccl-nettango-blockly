import { serialization } from "blockly";


const GLOBAL_STATE: string[] = []

export const GLOBAL_SERIALIZER: serialization.ISerializer = {
	priority: serialization.priorities.VARIABLES,
	clear: () => GLOBAL_STATE.length = 0,
	load: (state: string[], workspace) => {
		GLOBAL_STATE.push(...state);
		//@ts-expect-error
		workspace.getWarningHandler().cacheGlobalNames = true;
		//@ts-expect-error
		workspace.getWarningHandler().cachedGlobalNames = GLOBAL_STATE;
	},
	save: () => GLOBAL_STATE
}


export const getGlobals = (includeDefault: boolean = true) => [...GLOBAL_STATE];

export function addGlobal(name: string) {
	GLOBAL_STATE.push(name);
}

export function renameGlobal(oldName: string, newName: string) {
	removeGlobal(oldName);
	addGlobal(newName);
}

export function removeGlobal(name: string) {
	const i = GLOBAL_STATE.indexOf(name);
	if (i != -1) {
		GLOBAL_STATE.splice(i, 1);
	}
}

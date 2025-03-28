import { BlockDefinition, DynamicDropdownFieldOptions, StaticDropdownFieldOptions } from "./types";


export function createBasicBlock(type: string, overrides?: Partial<BlockDefinition>): BlockDefinition {
	const netlogoCommand = type.replace("_", "-");
	return {
		message0: netlogoCommand,
		previousStatement: null,
		nextStatement: null,
		for: () => netlogoCommand,
		...overrides,
		type
	};
}

export function staticOptions(options: string[]): StaticDropdownFieldOptions {
	return options.map(option => [option, option]);
}

export function dynamicOptions(optionGenerator: () => string[]): DynamicDropdownFieldOptions {
	return () => staticOptions(optionGenerator());
}

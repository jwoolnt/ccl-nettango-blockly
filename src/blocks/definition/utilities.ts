import { BlockDefinition, CheckValue, DynamicDropdownFieldOptions, StaticDropdownFieldOptions, ValueType } from "./types";


export enum Order {
	ATOMIC = 0,
	FUNCTION_CALL,
	EXPONENTIATION,
	UNARY,
	MULTIPLICATIVE,
	ADDITIVE,
	LOGICAL,
	NONE
}


export function staticOptions(options: string[]): StaticDropdownFieldOptions {
	return options.map(option => [option, option]);
}

export function dynamicOptions(optionGenerator: () => string[]): DynamicDropdownFieldOptions {
	return () => staticOptions(optionGenerator());
}


function netlogoCommand(type: string): string {
	return (type.endsWith("_") ? type.slice(0, -1) : type).replace("_", "-");
}

export function createBasicBlock(type: string, overrides?: Partial<BlockDefinition>): BlockDefinition {
	const command = netlogoCommand(type);
	return {
		message0: command,
		previousStatement: null,
		nextStatement: null,
		for: () => command,
		...overrides,
		type
	};
}

export function createValueBlock(type: string, output: ValueType, overrides?: Partial<BlockDefinition>): BlockDefinition {
	const command = netlogoCommand(type);
	return {
		message0: command,
		for: () => command,
		...overrides,
		output,
		type
	};
}

export function createOperatorBlock(
	type: string,
	symbol: string,
	check: CheckValue,
	overrides?: Partial<BlockDefinition>
): BlockDefinition {
	return {
		message0: `%1 ${symbol} %2`,
		args0: [{
			type: "input_value",
			name: "A",
			check
		}, {
			type: "input_value",
			name: "B",
			check
		}]
		for: (block, generator) => {

		},
		...overrides,
		output: check,
		type
	};
}

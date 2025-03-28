import { BlockDefinition, DynamicDropdownFieldOptions, StaticDropdownFieldOptions, ValueType } from "./types";


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


export function orDefault<T>(generatedValue: string, defaultValue: T) {
	return generatedValue !== "" && generatedValue !== null ? generatedValue : defaultValue;
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


function binaryOrder(symbol: string): Order {
	switch (symbol) {
		case "^":
			return Order.EXPONENTIATION;
		case "*":
		case "/":
			return Order.MULTIPLICATIVE;
		case "+":
		case "-":
			return Order.ADDITIVE;
		case "and":
		case "or":
			return Order.LOGICAL;
		default:
			return Order.ATOMIC;
	}
}

export function createMathOperatorBlock(
	type: string,
	symbol: string,
	overrides?: Partial<BlockDefinition>
): BlockDefinition {
	return {
		message0: `%1 ${symbol} %2`,
		args0: [{
			type: "input_value",
			name: "A",
			check: "Number"
		}, {
			type: "input_value",
			name: "B",
			check: "Number"
		}],
		inputsInline: true,
		for: (block, generator) => {
			const order = binaryOrder(symbol);
			const defaultValue = type == "addition" || type == "subtraction" ? 0 : 1;
			const A = orDefault(generator.valueToCode(block, "A", order), defaultValue);
			const B = orDefault(generator.valueToCode(block, "B", order), defaultValue);
			return [`${A} ${symbol} ${B}`, order];
		},
		...overrides,
		output: "Number",
		type
	};
}

export function createLogicalOperatorBlock(
	type: string,
	overrides?: Partial<BlockDefinition>
): BlockDefinition {
	return {
		message0: `%1 ${type} %2`,
		args0: [{
			type: "input_value",
			name: "A",
			check: "Boolean"
		}, {
			type: "input_value",
			name: "B",
			check: "Boolean"
		}],
		inputsInline: true,
		for: (block, generator) => {
			const order = Order.LOGICAL;
			const defaultValue = true;
			const A = orDefault(generator.valueToCode(block, "A", order), defaultValue);
			const B = orDefault(generator.valueToCode(block, "B", order), defaultValue);
			return [`${A} ${type} ${B}`, order];
		},
		...overrides,
		output: "Boolean",
		type
	};
}

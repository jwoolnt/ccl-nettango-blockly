import { Argument, BlockDefinition, CheckValue, DynamicDropdownFieldOptions, StaticDropdownFieldOptions, ValueType } from "./types";


export enum Order {
	ATOMIC = 0,
	NEGATION,
	FUNCTION_CALL,
	EXPONENTIATION,
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
		for: () => command,
		...overrides,
		type
	};
}


export function createStatementBlock(type: string, overrides?: Partial<BlockDefinition>): BlockDefinition {
	return createBasicBlock(type, {
		previousStatement: null,
		nextStatement: null,
		...overrides
	});
}

export function createValueBlock(type: string, output: ValueType, overrides?: Partial<BlockDefinition>): BlockDefinition {
	return createBasicBlock(type, {
		...overrides,
		output
	});
}


function operationOrder(type: string, binary: boolean = true): Order {
	if (!binary && type == "negation") {
		return Order.NEGATION;
	}

	switch (type) {
		case "exponentiation":
			return Order.EXPONENTIATION;
		case "multiplication":
		case "division":
			return Order.MULTIPLICATIVE;
		case "addition":
		case "subtraction":
			return Order.ADDITIVE;
		case "and":
		case "or":
		case "not":
		case "xor":
		case "equal":
		case "not_equal":
		case "less_than":
		case "less_than_or_equal_to":
		case "greater_than":
		case "greater_than_or_equal_to":
			return Order.LOGICAL;
		default:
			return Order.ATOMIC;
	}
}

export function createOperatorBlock(
	type: string,
	symbol: string,
	check: CheckValue,
	output: ValueType,
	binary: boolean = true,
	overrides?: Partial<BlockDefinition>
): BlockDefinition {
	const message0 = binary ? `%1 ${symbol} %2` : `${symbol} %1`;

	const args0: Argument[] = [{
		type: "input_value",
		name: "A",
		check
	}];
	if (binary) {
		args0.push({
			type: "input_value",
			name: "B",
			check
		});
	}

	return createValueBlock(type, output, {
		message0,
		args0,
		inputsInline: true,
		for: (block, generator) => {
			const order = operationOrder(type, binary);
			const A = generator.valueToCode(block, "A", order);

			if (binary) {
				const B = generator.valueToCode(block, "B", order);
				return [`${A} ${symbol} ${B}`, order];
			} else {
				return [type == "negation" ? `(${symbol} ${A})` : `${symbol} ${A}`, order];
			}
		},
		...overrides
	})
}

export function createMathOperatorBlock(
	type: string,
	symbol: string,
	binary: boolean = true,
	overrides?: Partial<BlockDefinition>
): BlockDefinition {
	return createOperatorBlock(type, symbol, "Number", "Number", binary, overrides);
}

export function createLogicalOperatorBlock(
	type: string,
	binary: boolean = true,
	overrides?: Partial<BlockDefinition>
): BlockDefinition {
	return createOperatorBlock(type, type, "Boolean", "Boolean", binary, overrides);
}

export function createComparisonOperatorBlock(
	type: string,
	symbol: string,
	overrides?: Partial<BlockDefinition>
): BlockDefinition {
	const check: ValueType[] = ["Number", "String", "Agent"];
	if (type == "equal" || type == "not_equal") {
		check.push("Agentset");
	}

	return createOperatorBlock(type, symbol, check, "Boolean", true, {
		...overrides,
		// for: (block, generator) => {
		// 	const order = operationOrder(type);
		// 	const A = generator.valueToCode(block, "A", order)|| null;
		// 	const B = generator.valueToCode(block, "B", order)|| null;

		// 	if (A && B) {
		// 		return [`${A} ${symbol} ${B}`, order];
		// 	} else {
		// 		return [`false`, order];
		// 	}
		// }
		for: (block, generator) => {
			const order = operationOrder(type);
			const A = generator.valueToCode(block, "A", order) || "0"; // or any sensible default
			const B = generator.valueToCode(block, "B", order) || "0"; // same here
			return [`${A} ${symbol} ${B}`, order];
		}
		
	});
}

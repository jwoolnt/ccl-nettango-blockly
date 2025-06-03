import { getTurteAgentSets } from "../data/context";
import { BlockDefinition } from "./types";
import { createStatementBlock, createValueBlock, dynamicOptions, Order } from "./utilities";


const create_breeds: BlockDefinition = createStatementBlock("create_breeds", {
	message0: "create-%1 %2\n %3",
	args0: [{
		type: "field_dropdown",
		name: "BREED",
		options: dynamicOptions(getTurteAgentSets)
	}, {
		type: "input_value",
		name: "COUNT",
		check: "Number"
	}, {
		type: "input_statement",
		name: "COMMANDS"
	}],
	colour: "#2E7D32",
	for: (block, generator) => {
		const breed = block.getFieldValue("BREED");
		const count = generator.valueToCode(block, "COUNT", Order.NONE);
		const setup = generator.statementToCode(block, "COMMANDS");

		let code = `create-${breed} ${count}`;
		if (setup) {
			code += ` [\n${setup}\n]`;
		}

		return code;
	}
});

const die: BlockDefinition = createStatementBlock("die");

// hatch number [ commands ]
const hatch: BlockDefinition = createStatementBlock("hatch", {
	message0: "hatch %1\n %2",
	args0: [{
		// number
		type: "input_value",
		name: "COUNT",
		check: "Number"
	}, {
		type: "input_statement",
		name: "COMMANDS"
	}],
	colour: "#2E7D32",
	for: (block, generator) => {
		const count = generator.valueToCode(block, "COUNT", Order.NONE) || "1";
		const setup = generator.statementToCode(block, "COMMANDS");
		let code = `hatch ${count}`;
		if (setup) {
			code += ` [\n${setup}\n]`;
		}
		return code;
	}
});

// forward, back, left, right
// helper functions for movement
function createMovementBlock(name: string, netlogoCmd: string): BlockDefinition {
	return createStatementBlock(name, {
		message0: `${name} %1`,
		args0: [{
			type: "input_value",
			name: "DISTANCE",
			check: "Number"
		}],
		colour: "#2E7D32",
		for: (block, generator) => {
			const distance = generator.valueToCode(block, "DISTANCE", Order.NONE) || "1";
			return `${netlogoCmd} ${distance}`;
		}
	});
}

const forward: BlockDefinition = createMovementBlock("forward", "fd");
const back: BlockDefinition = createMovementBlock("back", "bk");
const left: BlockDefinition = createMovementBlock("left", "lt");
const right: BlockDefinition = createMovementBlock("right", "rt");

const random_xcor = createValueBlock("random_xcor", "Number");
const random_ycor = createValueBlock("random_ycor", "Number");
const setxy = createStatementBlock("setxy", {
	message0: "setxy %1 %2",
	args0: [{
		type: "input_value",
		name: "X",
		check: "Number"
	},
	{
		type: "input_value",
		name: "Y",
		check: "Number"
	}],
	inputsInline: true,
	for: (block, generator) => {
		const X = generator.valueToCode(block, "X", Order.FUNCTION_CALL);
		const Y = generator.valueToCode(block, "Y", Order.FUNCTION_CALL);
		return [`setxy ${X} ${Y}`, Order.FUNCTION_CALL];
	}
});

const turtleBlocks: BlockDefinition[] = [
	create_breeds,
	die,
	hatch,
	forward,
	back,
	left,
	right,
	random_xcor,
	random_ycor,
	setxy
];


export default turtleBlocks;

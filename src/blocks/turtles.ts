import { getTurteAgentSets } from "../data/context";
import { BlockDefinition } from "./types";
import { createStatementBlock, dynamicOptions, Order } from "./utilities";


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
		for : (block, generator) => {
			const distance = generator.valueToCode(block, "DISTANCE", Order.NONE) || "1";
			return `${netlogoCmd} ${distance}`;
		}
	});
}

const forward: BlockDefinition = createMovementBlock("forward", "fd");
const back: BlockDefinition = createMovementBlock("back", "bk");
const left: BlockDefinition = createMovementBlock("left", "lt");
const right: BlockDefinition = createMovementBlock("right", "rt");

const turtleBlocks: BlockDefinition[] = [
	create_breeds,
	die,
	hatch,
	forward,
	back,
	left,
	right
];


export default turtleBlocks;

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


const turtleBlocks: BlockDefinition[] = [
	create_breeds,
	die
];


export default turtleBlocks;

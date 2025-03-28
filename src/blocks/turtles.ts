import { getTurtleBreeds, specifyPlurality } from "../data/breeds";
import { BlockDefinition } from "./definition/types";
import { createBasicBlock, dynamicOptions, Order } from "./definition/utilities";


const create_breeds: BlockDefinition = createBasicBlock("create_breeds", {
	message0: "create-%1 %2\n %3",
	args0: [{
		type: "field_dropdown",
		name: "BREED",
		options: dynamicOptions(() => specifyPlurality(getTurtleBreeds(), true))
	}, {
		type: "input_value",
		name: "COUNT",
		check: "Number"
	}, {
		type: "input_statement",
		name: "COMMANDS"
	}],
	for: function (block, generator) {
		const breed = block.getFieldValue("BREED");
		const count = generator.valueToCode(block, "COUNT", Order.NONE) || 0;
		const setup = generator.statementToCode(block, "COMMANDS");

		let code = `create-${breed} ${count}`;
		if (setup) {
			code += ` [\n${setup}\n]`;
		}

		return code;
	}
});

const die: BlockDefinition = createBasicBlock("die");


const turtleBlocks: BlockDefinition[] = [
	create_breeds,
	die
];


export default turtleBlocks;

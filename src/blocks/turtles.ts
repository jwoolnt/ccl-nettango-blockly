import { getTurtleBreeds, specifyPlurality } from "../data/breeds";
import { BlockDefinition } from "./definition/types";
import { createBasicBlock, dynamicOptions } from "./definition/utilities";


const create_breeds: BlockDefinition = createBasicBlock("create_breeds", {
	message0: "create-%1 %2\n %3",
	args0: [{
		type: "field_dropdown",
		name: "BREED",
		options: dynamicOptions(() => specifyPlurality(getTurtleBreeds(), true))
	}, {
		type: "field_number",
		name: "NUMBER",
		min: 0
	}, {
		type: "input_statement",
		name: "SETUP"
	}],
	for: function (block, generator) {
		const breed = block.getFieldValue("BREED");
		const number = block.getFieldValue("NUMBER");
		const setup = generator.statementToCode(block, 'SETUP');

		let code = `create-${breed} ${number}`;
		if (setup) {
			code += ` [\n${setup}\n]`;
		}

		return code;
	}
});

const die = createBasicBlock("die");


const turtleBlocks: BlockDefinition[] = [
	create_breeds,
	die
];


export default turtleBlocks;

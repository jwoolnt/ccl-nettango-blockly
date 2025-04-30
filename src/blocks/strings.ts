import { BlockDefinition } from "./types";
import { createValueBlock, Order } from "./utilities";


const string: BlockDefinition = createValueBlock("string", "String", {
	message0: "\"%1\"",
	args0: [{
		type: "field_input",
		name: "STRING"
	}],
	for: block => [`"${block.getFieldValue("STRING")}"`, Order.ATOMIC]
});


const stringBlocks: BlockDefinition[] = [
	string
];


export default stringBlocks;

import { BlockDefinition } from "./definition/types";
import { createValueBlock, Order } from "./definition/utilities";


const string: BlockDefinition = createValueBlock("string", "String", {
	message0: "\"%1\"",
	args0: [{
		type: "field_input",
		name: "STRING"
	}],
	output: "String",
	colour: "#673AB7", 
	for: block => [`"${block.getFieldValue("STRING")}"`, Order.ATOMIC]
});


const stringBlocks: BlockDefinition[] = [
	string
];


export default stringBlocks;

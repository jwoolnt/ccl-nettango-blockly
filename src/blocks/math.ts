import { BlockDefinition } from "./definition/types";
import { createValueBlock, Order } from "./definition/utilities";


const random: BlockDefinition = createValueBlock("random", "Number", {
	output: "Number",
	message0: "random %1",
	args0: [{
		type: "field_number",
		name: "NUMBER"
	}],
	for: (block) => {
		const number = block.getFieldValue("NUMBER");
		return [`random ${number}`, Order.FUNCTION_CALL];
	}
});


const mathBlocks: BlockDefinition[] = [
	random
];


export default mathBlocks;

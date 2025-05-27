import { getAllAgentSets } from "../data/context";
import { BlockDefinition } from "./types";
import { createValueBlock, dynamicOptions, Order } from "./utilities";


const agentset: BlockDefinition = createValueBlock("agentset", "Agentset", {
	message0: "%1",
	args0: [{
		type: "field_dropdown",
		name: "AGENTSET",
		options: dynamicOptions(getAllAgentSets)
	}],
	colour: "#4C97FF", // Blue
	tooltip: 'Choose an agentset.',
	for: block => [block.getFieldValue("AGENTSET"), Order.ATOMIC]
});


const agentsetBlocks: BlockDefinition[] = [
	agentset
];


export default agentsetBlocks;

import { BlockDefinition } from "./types";
import { getAgentSets, specifyPlurality } from "../data/breeds";
import { createValueBlock, dynamicOptions, Order } from "./utilities";


const agentset: BlockDefinition = createValueBlock("agentset", "Agentset", {
	message0: "%1",
	args0: [{
		type: "field_dropdown",
		name: "AGENTSET",
		options: dynamicOptions(() => specifyPlurality(getAgentSets(), true))
	}],
	for: block => [block.getFieldValue("AGENTSET"), Order.ATOMIC]
});


const agentsetBlocks: BlockDefinition[] = [
	agentset
];


export default agentsetBlocks;

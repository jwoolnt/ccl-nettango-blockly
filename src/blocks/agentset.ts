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

const any: BlockDefinition = createValueBlock("any", "Boolean", {
	message0: "any? %1",
	args0: [{
		type: "input_value",
		name: "AGENT_SET",
		check: "Agentset",
	}],
	colour: "#795548",
	for: (block, generator) => {
		const list = generator.valueToCode(block, "AGENT_SET", 0);
		return [`any? ${list}`, 0];
	}
});

// TODO: Output type should be Agentset or Array
const one_of: BlockDefinition = createValueBlock("one_of", ["Array", "Agentset"], {
	message0: "one-of %1",
	args0: [{
		type: "input_value",
		name: "LIST",
		check: ["Array", "Agentset"],
	}],
	colour: "#795548",
	for: (block, generator) => {
		const list = generator.valueToCode(block, "LIST", 0);
		return [`one-of ${list}`, 0];
	}
});


const agentsetBlocks: BlockDefinition[] = [
	agentset,
	one_of,
	any
];


export default agentsetBlocks;

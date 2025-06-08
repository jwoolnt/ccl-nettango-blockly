import { getAllAgentSets, getTurtleBreeds } from "../data/context";
import { BlockDefinition } from "./types";
import { createValueBlock, dynamicOptions, Order } from "./utilities";


const nobody: BlockDefinition = createValueBlock("nobody", "Agent");

const agentset: BlockDefinition = createValueBlock("agentset", "Agentset", {
	message0: "%1",
	args0: [{
		type: "field_dropdown",
		name: "AGENT_SET",
		options: dynamicOptions(getAllAgentSets)
	}],
	colour: "#4C97FF", // Blue
	tooltip: 'Choose an agentset.',
	for: block => [block.getFieldValue("AGENT_SET"), Order.ATOMIC]
});

const agentset_here: BlockDefinition = createValueBlock("agentset_here", "Agentset", {
	message0: "%1-here",
	args0: [{
		type: "field_dropdown",
		name: "AGENT_SET",
		options: dynamicOptions(() => ["turtles", ...getTurtleBreeds().map(({ pluralName }) => pluralName)])
	}],
	colour: "#4C97FF", // Blue
	tooltip: 'Choose an agentset.',
	for: block => [`${block.getFieldValue("AGENT_SET")}-here`, Order.ATOMIC]
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
		const list = generator.valueToCode(block, "AGENT_SET", Order.FUNCTION_CALL);
		return [`any? ${list}`, Order.ATOMIC];
	}
});

const agentsetBlocks: BlockDefinition[] = [
	nobody,
	agentset,
	agentset_here,
	any
];


export default agentsetBlocks;

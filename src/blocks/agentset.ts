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

const with_manual: BlockDefinition = createValueBlock("with_manual", null, {
	message0: "%1 with [%2]",
	args0: [{
		type: "input_value",
		name: "AGENT_SET",
		check: "Agentset"
	}, {
		type: "input_value",
		name: "CONDITION",
		check: "Boolean"
	}],
	inputsInline: true,
	for: (block, generator) => {
		const ag = generator.valueToCode(block, "AGENT_SET", Order.FUNCTION_CALL);
		const c = generator.valueToCode(block, "CONDITION", Order.NONE);
		return [
			`${ag} with [${c}]`,
			Order.FUNCTION_CALL
		];
	}
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
	with_manual,
	agentset_here,
	any
];


export default agentsetBlocks;

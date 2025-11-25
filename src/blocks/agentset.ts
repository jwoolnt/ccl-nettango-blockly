import { getAllAgentSets, getTurtleBreeds, getTurtleAgentSets } from "../data/context";
import { BlockDefinition } from "./types";
import { createValueBlock, createStatementBlock, dynamicOptions, Order } from "./utilities";


const nobody: BlockDefinition = createValueBlock("nobody", ["Agent", "Boolean"]);

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

// agent + _ (string)
const agent_plus_string: BlockDefinition = createValueBlock("agent_plus_string", "String", {
	message0: "%1 + \"%2\"",
	args0: [{
		type: "input_value",
		name: "AGENT",
		check: "Agentset",
	}, {
		type: "field_input",
		name: "STRING",
	}],
	inputsInline: true,
	colour: "#795548",
	for: (block, generator) => {
		const agent = generator.valueToCode(block, "AGENT", Order.FUNCTION_CALL);
		const string = block.getFieldValue("STRING");
		return [`${agent} "${string}"`, Order.ATOMIC];
	}
});

// sprout-<breed>
const sprout_breed: BlockDefinition = createStatementBlock("sprout_breed", {
	message0: "sprout-%1 %2\n %3",
	args0: [{
		type: "field_dropdown",
		name: "BREED",
		options: dynamicOptions(getTurtleAgentSets)
	}, {
		type: "input_value",
		name: "COUNT",
		check: "Number"
	}, {
		type: "input_statement",
		name: "COMMANDS"
	}],
	colour: "#2E7D32", // Green (same as create_breeds)
	for: (block, generator) => {
		const breed = block.getFieldValue("BREED");
		const count = generator.valueToCode(block, "COUNT", Order.NONE);
		const setup = generator.statementToCode(block, "COMMANDS");

		// If breed is "turtles", use "sprout" instead of "sprout-turtles"
		const command = breed === "turtles" ? "sprout" : `sprout-${breed}`;
		let code = `${command} ${count}`;
		if (setup) {
			code += ` [\n${setup}\n]`;
		}

		return code;
	}
});

const agentsetBlocks: BlockDefinition[] = [
	nobody,
	agentset,
	with_manual,
	agentset_here,
	any,
	agent_plus_string,
	sprout_breed
];


export default agentsetBlocks;

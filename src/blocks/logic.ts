import { BlockDefinition } from "./definition/types";
import { createBasicBlock, createValueBlock, orDefault, Order, staticOptions } from "./definition/utilities";


const boolean: BlockDefinition = createValueBlock("boolean", "Boolean", {
	message0: "%1",
	args0: [{
		type: "field_dropdown",
		name: "BOOLEAN",
		options: staticOptions(["true", "false"])
	}],
	for: (block) => {
		const boolean = orDefault(block.getFieldValue("BOOLEAN"), "true");
		return [`${boolean}`, Order.ATOMIC];
	}
});

const ask_agent_set: BlockDefinition = createBasicBlock("ask_agent_set", {
	message0: "ask %1\n %2",
	args0: [{
		type: "input_value",
		name: "AGENTSET",
		check: "Agentset"
	}, {
		type: "input_statement",
		name: "COMMANDS"
	}],
	for: (block, generator) => {
		const agentSet = orDefault(generator.valueToCode(block, "AGENTSET", Order.NONE), "no-turtles"); // TODO: update with agenset
		const commands = generator.statementToCode(block, "COMMANDS");
		return `ask ${agentSet} [\n${commands}\n]`
	}
});

const if_: BlockDefinition = createBasicBlock("if_", {
	message0: "if %1\n %2",
	args0: [{
		type: "input_value",
		name: "CONDITION",
		check: "Boolean"
	}, {
		type: "input_statement",
		name: "COMMANDS"
	}],
	for: (block, generator) => {
		const condition = orDefault(generator.valueToCode(block, "CONDITION", Order.NONE), false);
		const commands = generator.statementToCode(block, "COMMANDS");
		return `if ${condition} [\n${commands}\n]`;
	}
});

const ifelse: BlockDefinition = createBasicBlock("ifelse", { // TODO: support multiple if's
	message0: "ifelse %1\n %2\n %3",
	args0: [{
		type: "input_value",
		name: "CONDITION",
		check: "Boolean"
	}, {
		type: "input_statement",
		name: "IF_COMMANDS"
	}, {
		type: "input_statement",
		name: "ELSE_COMMANDS"
	}],
	for: (block, generator) => {
		const condition = orDefault(generator.valueToCode(block, "CONDITION", Order.NONE), false);
		const ifCommands = generator.statementToCode(block, "IF_COMMANDS");
		const elseCommands = generator.statementToCode(block, "ELSE_COMMANDS");
		return `ifelse ${condition} [\n${ifCommands}\n] [\n${elseCommands}\n]`;
	}
});


const logicBlocks: BlockDefinition[] = [
	boolean,
	ask_agent_set,
	if_,
	ifelse
];


export default logicBlocks;

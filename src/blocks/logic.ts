import { BlockDefinition } from "./types";
import { createStatementBlock, createComparisonOperatorBlock, createLogicalOperatorBlock, createValueBlock, Order, staticOptions } from "./utilities";


const boolean: BlockDefinition = createValueBlock("boolean", "Boolean", {
	message0: "%1",
	args0: [{
		type: "field_dropdown",
		name: "BOOLEAN",
		options: staticOptions(["true", "false"])
	}],
	for: (block) => {
		const boolean = block.getFieldValue("BOOLEAN");
		return [`${boolean}`, Order.ATOMIC];
	}
});

const and: BlockDefinition = createLogicalOperatorBlock("and");

const or: BlockDefinition = createLogicalOperatorBlock("or");

const not: BlockDefinition = createLogicalOperatorBlock("not", false);

const xor: BlockDefinition = createLogicalOperatorBlock("xor");

const equal: BlockDefinition = createComparisonOperatorBlock("equal", "=");

const not_equal: BlockDefinition = createComparisonOperatorBlock("not_equal", "!=");

const less_than: BlockDefinition = createComparisonOperatorBlock("less_than", "<");

const less_than_or_equal_to: BlockDefinition = createComparisonOperatorBlock("less_than_or_equal_to", "<=");

const greater_than: BlockDefinition = createComparisonOperatorBlock("greater_than", ">");

const greater_than_or_equal_to: BlockDefinition = createComparisonOperatorBlock("greater_than_or_equal_to", ">=");

const ask_agent_set: BlockDefinition = createStatementBlock("ask_agent_set", {
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
		const agentSet = generator.valueToCode(block, "AGENTSET", Order.NONE);
		const commands = generator.statementToCode(block, "COMMANDS");
		return `ask ${agentSet} [\n${commands}\n]`
	}
});

const if_: BlockDefinition = createStatementBlock("if_", {
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
		const condition = generator.valueToCode(block, "CONDITION", Order.NONE);
		const commands = generator.statementToCode(block, "COMMANDS");
		return `if ${condition} [\n${commands}\n]`;
	}
});

const ifelse: BlockDefinition = createStatementBlock("ifelse", { // TODO: support multiple if's
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
		const condition = generator.valueToCode(block, "CONDITION", Order.NONE);
		const ifCommands = generator.statementToCode(block, "IF_COMMANDS");
		const elseCommands = generator.statementToCode(block, "ELSE_COMMANDS");
		return `ifelse ${condition} [\n${ifCommands}\n] [\n${elseCommands}\n]`;
	}
});


const logicBlocks: BlockDefinition[] = [
	boolean,
	and,
	or,
	not,
	xor,
	equal,
	not_equal,
	less_than,
	less_than_or_equal_to,
	greater_than,
	greater_than_or_equal_to,
	ask_agent_set,
	if_,
	ifelse
];


export default logicBlocks;

// src/blocks/logic.ts
import { BlockDefinition } from "./types";
import { createStatementBlock, createComparisonOperatorBlock, createLogicalOperatorBlock, createValueBlock, Order, staticOptions, dynamicOptions } from "./utilities";
import { getVariableInitialValues } from "../components/variablesTracker";
const let_: BlockDefinition = function simple_local_declaration_statement(block, generator) {
	// TODO: change to local_declaration_statement
	const variable = block.getFieldValue("VAR");
	const value = generator.valueToCode(block, "DECL", Order.NONE);
	let code = `let ${variable} ${value}\n`;

	generator.INDENT = "";
	code += generator.statementToCode(block, "DO");
	generator.INDENT = "  ";

	return code;
}

const set: BlockDefinition = function lexical_variable_set(block, generator) {
	const variable = block.getFieldValue("VAR").split(" ").pop();
	const value = generator.valueToCode(block, "VALUE", Order.NONE);
	return `set ${variable} ${value}`;
}

const get: BlockDefinition = function lexical_variable_get(block) {
	return [block.getFieldValue("VAR").split(" ").pop(), Order.ATOMIC];
}

const boolean: BlockDefinition = createValueBlock("boolean", "Boolean", {
	message0: "%1",
	args0: [{
		type: "field_dropdown",
		name: "BOOLEAN",
		options: staticOptions(["true", "false"])
	}],
	colour: "#d6850d",
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

// TODO: Add Breed

// const to: BlockDefinition = function procedures_defnoreturn(block: any, generator) { // TODO: remove any
// 	let prefix = `to ${block.getFieldValue("NAME")}`;

// 	let parameters = "";
// 	if (block.arguments_.length) {
// 		parameters += " [ "

// 		for (const parameter of block.arguments_) {
// 			parameters += `${parameter} `
// 		}

// 		parameters += "]"
// 	}

// 	const body = generator.statementToCode(block, "STACK");
// 	if (body.includes("report")) {
// 		prefix = `to-report ${block.getFieldValue("NAME")}`;
// 	}

// 	const suffix = "end";

// 	return `\n${prefix}${parameters}\n${body}\n${suffix}\n`;
// }
const to: BlockDefinition = function procedures_defnoreturn(block: any, generator) {
	let prefix = `to ${block.getFieldValue("NAME")}`;

	let parameters = "";
	if (block.arguments_.length) {
		parameters += " [ "
		for (const parameter of block.arguments_) {
			parameters += `${parameter} `
		}
		parameters += "]"
	}

	let body = generator.statementToCode(block, "STACK");
	
	// Inject variable initialization AFTER clear-all if this is setup
	const procedureName = block.getFieldValue("NAME");
	if (procedureName.toLowerCase() === 'setup') {
		const variableValues = getVariableInitialValues();
		
		if (variableValues.size > 0) {
			let varInitialization = '';
			for (const [name, value] of variableValues.entries()) {
				if (typeof value === 'number') {
					varInitialization += `  set ${name} ${value}\n`;
				} else if (typeof value === 'boolean') {
					varInitialization += `  set ${name} ${value ? 'true' : 'false'}\n`;
				}
			}
			
			// Find clear-all and insert AFTER it
			const lines = body.split('\n');
			const clearAllIndex = lines.findIndex(line => 
				line.trim().toLowerCase() === 'clear-all'
			);
			
			if (clearAllIndex !== -1) {
				lines.splice(clearAllIndex + 1, 0, varInitialization);
				body = lines.join('\n');
			} else {
				// No clear-all found, put at beginning
				body = varInitialization + body;
			}
		}
	}
	
	if (body.includes("report")) {
		prefix = `to-report ${block.getFieldValue("NAME")}`;
	}

	const suffix = "end";

	return `\n${prefix}${parameters}\n${body}\n${suffix}\n`;
}

const report: BlockDefinition = createStatementBlock("report", {
	message0: "report %1",
	args0: [{
		type: "input_value",
		name: "VALUE"
	}],
	for: (block, generator) => `report ${generator.valueToCode(block, "VALUE", Order.NONE)}`
});
const show: BlockDefinition = createStatementBlock("show", {
	message0: "show %1",
	args0: [{
		type: "input_value",
		name: "VALUE"
	}],
	for: (block, generator) => `show ${generator.valueToCode(block, "VALUE", Order.NONE)}`
});


const call_command: BlockDefinition = function procedures_callnoreturn(block: any, generator) { // TODO: remove any
	const procedure = block.getFieldValue("PROCNAME");

	let args = "";
	for (let i = 0; i < block.arguments_.length; i++) {
		args += ` ${generator.valueToCode(block, "ARG" + i, Order.FUNCTION_CALL) || "0"}`; // TODO: add zero shadow block
	}

	return procedure + args;
};

const call_manual: BlockDefinition = createValueBlock("call_manual", null, {
	message0: "call %1 %2",
	args0: [{
		type: "field_input",
		name: "PROCNAME"
	}, {
		type: "field_input",
		name: "ARGS"
	}],
	inputsInline: true,
	for: (block) => [
		[block.getFieldValue("PROCNAME"), block.getFieldValue("ARGS")].join(" "),
		Order.FUNCTION_CALL
	]
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
	colour: "#0794a6",
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
	colour: "#0794a6",
	for: (block, generator) => {
		const condition = generator.valueToCode(block, "CONDITION", Order.NONE);
		const ifCommands = generator.statementToCode(block, "IF_COMMANDS");
		const elseCommands = generator.statementToCode(block, "ELSE_COMMANDS");
		return `ifelse ${condition} [\n${ifCommands}\n] [\n${elseCommands}\n]`;
	}
});

const stop: BlockDefinition = createStatementBlock("stop");
const user_message: BlockDefinition = createStatementBlock("user_message", {
	message0: "user message %1",
	args0: [{
		type: "input_value",
		name: "MESSAGE",
		check: "String"
	}],
	colour: "#0794a6",
	for: (block, generator) => {
		const message = generator.valueToCode(block, "MESSAGE", Order.NONE);
		return `user-message ${message}`;
	}
});

const set_default_shape: BlockDefinition = createStatementBlock("set_default_shape", {
	message0: "set-default-shape %1 %2",
	args0: [{
		type: "field_dropdown",
		name: "BREED",
		options: [
		["turtles", "turtles"],
		["patches", "patches"],
		["links", "links"]
		// You can make this dynamic based on breeds too
		]
	}, {
		type: "input_value",
		name: "SHAPE",
		check: "String"
	}],
	inputsInline: true,
	for: (block, generator) => {
		const breed = block.getFieldValue("BREED");
		const shape = generator.valueToCode(block, "SHAPE", Order.NONE) || '"default"';
		return `set-default-shape ${breed} ${shape}`;
	}
});

const netlogo_web: BlockDefinition = createValueBlock("netlogo_web", "Boolean", {
	message0: "netlogo-web?",
	for: () => ["netlogo-web?", Order.ATOMIC]
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

	let_,
	set,
	get,
	stop,
	user_message,

	to,
	report,
	show,
	call_command,
	// to_report,
	// call_report,
	call_manual,

	if_,
	ifelse,
	set_default_shape,

	netlogo_web
];


export default logicBlocks;

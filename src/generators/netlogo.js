import { Generator } from "blockly";

export const netlogoGenerator = new Generator('NetLogo');


netlogoGenerator.scrub_ = function (block, code, thisOnly) {
	const nextBlock =
		block.nextConnection && block.nextConnection.targetBlock();
	if (nextBlock && !thisOnly) {
		return code + '\n' + netlogoGenerator.blockToCode(nextBlock);
	}
	return code;
};


const { forBlock } = netlogoGenerator;


["clear_all", "reset_ticks", "die"].forEach(type =>
	forBlock[type] = () => type.replace("_", "-")
);

forBlock["create_breeds"] = function (block, generator) {
	const breed = block.getFieldValue("BREED");
	const number = block.getFieldValue("NUMBER") ?? 0;
	const setup = generator.statementToCode(block, 'SETUP');

	let code = `create-${breed} ${number}`;
	if (setup) {
		code += ` [\n${setup}\n]`;
	}

	return code;
}

forBlock["ask_agent_set"] = function (block, generator) {
	const agentSet = block.getFieldValue("AGENT_SET");
	const commands = generator.statementToCode(block, 'COMMANDS');
	return `ask ${agentSet} [\n${commands}\n]`
}

// if_block with operator condition handling
forBlock["if_block"] = function (block, generator) {
    const condition = generator.valueToCode(block, "CONDITION", 0); // Get condition dynamically
    const commands = generator.statementToCode(block, 'DO'); // Get commands to run if the condition is true

    return `if (${condition}) [\n${commands}\n]`;
};

// if_else_block with operator condition handling
forBlock["if_else_block"] = function (block, generator) {
    const condition = generator.valueToCode(block, "CONDITION", 0); // Get condition dynamically
    const commands = generator.statementToCode(block, 'DO_IF'); // Get commands for 'if' part
    const elseCommands = generator.statementToCode(block, 'DO_ELSE'); // Get commands for 'else' part

    return `ifelse (${condition}) [\n${commands}\n] [\n${elseCommands}\n]`;
};

// // Operator blocks
// forBlock["operator_equals"] = function (block, generator) {
//     const argument0 = generator.valueToCode(block, 'A', 0) || '0';
//     const argument1 = generator.valueToCode(block, 'B', 0) || '0';
//     return [`(${argument0} = ${argument1})`, 0];
// };

// forBlock["operator_not_equals"] = function (block, generator) {
//     const argument0 = generator.valueToCode(block, 'A', 0) || '0';
//     const argument1 = generator.valueToCode(block, 'B', 0) || '0';
//     return [`(${argument0} != ${argument1})`, 0];
// };

// forBlock["operator_and"] = function (block, generator) {
//     const argument0 = generator.valueToCode(block, 'A', 0) || 'false';
//     const argument1 = generator.valueToCode(block, 'B', 0) || 'false';
//     return [`(${argument0} and ${argument1})`, 0];
// };

// forBlock["operator_or"] = function (block, generator) {
//     const argument0 = generator.valueToCode(block, 'A', 0) || 'false';
//     const argument1 = generator.valueToCode(block, 'B', 0) || 'false';
//     return [`(${argument0} or ${argument1})`, 0];
// };
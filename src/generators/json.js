import * as Blockly from 'blockly';

export const jsonGenerator = new Blockly.Generator('JSON');

// Setup block
jsonGenerator.forBlock["setup_block"] = function(block) {
    return "to setup\nend\n";
};

// Go block
jsonGenerator.forBlock["go_block"] = function(block) {
    return "to go\nend\n";
};

// Ask block
jsonGenerator.forBlock["ask_block"] = function(block) {
    const agent = block.getFieldValue("AGENT");
    const statements = jsonGenerator.statementToCode(block, "DO");
    return `ask ${agent} [\n${statements}\n]\n`;
};

// If block
jsonGenerator.forBlock["if_block"] = function(block) {
    const condition = block.getFieldValue("CONDITION");
    const statements = jsonGenerator.statementToCode(block, "DO");
    return `if ${condition} [\n${statements}\n]\n`;
};

// Move block
jsonGenerator.forBlock["move_block"] = function(block) {
    const direction = block.getFieldValue("DIRECTION").toLowerCase();
    const steps = block.getFieldValue("STEPS");
    return `${direction} ${steps}\n`;
};


/* The `netlogoGenerator.scrub_` function is used to recursively generate code for NetLogo blocks. It
takes in a block, the current code, and a flag `thisOnly` which indicates whether to generate code
only for the current block or for subsequent blocks as well. */
netlogoGenerator.scrub_ = function (block, code, thisOnly) {
	const nextBlock =
		block.nextConnection && block.nextConnection.targetBlock();
	if (nextBlock && !thisOnly) {
		return code + '\n' + netlogoGenerator.blockToCode(nextBlock);
	}
	return code;
};

// "clear_all", "reset_ticks", "die"
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

// "ask_agent_set"
forBlock["ask_agent_set"] = function (block, generator) {
	const agentSet = block.getFieldValue("AGENT_SET");
	const commands = generator.statementToCode(block, 'COMMANDS');
	return `ask ${agentSet} [\n${commands}\n]`
}

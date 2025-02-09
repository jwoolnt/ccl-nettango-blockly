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

// clear commands
["clear_all", "reset_ticks", "die"].forEach(type =>
	forBlock[type] = () => type.replace("_", "-")
);

// create_breeds
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
// ask_agent_set
forBlock["ask_agent_set"] = function (block, generator) {
	const agentSet = block.getFieldValue("AGENT_SET");
	const commands = generator.statementToCode(block, 'COMMANDS');
	return `ask ${agentSet} [\n${commands}\n]`
}

// ==========`Control` blocks=========
// setup_block
forBlock["setup_block"] = () => "setup";

// go_block
forBlock["go_block"] = () => "go";

// if_block
forBlock["if_block"] = function (block, generator) {
	const condition = block.getFieldValue("CONDITION");
	const commands = generator.statementToCode(block, 'DO');
	return `if ${condition} [${commands}]`
}

// if_else_block
forBlock["if_else_block"] = function (block, generator) {
	const condition = block.getFieldValue("CONDITION");
	const commands = generator.statementToCode(block, 'DO_IF');
	const elseCommands = generator.statementToCode(block, 'DO_ELSE');
	return `ifelse ${condition} [${commands}] [${elseCommands}]`
}
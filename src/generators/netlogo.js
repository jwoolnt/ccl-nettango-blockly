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

forBlock["ask_agent_set"] = function (block, generator) {
	const agentSet = block.getFieldValue("AGENT_SET");
	const commands = generator.statementToCode(block, 'COMMANDS');
	return `ask ${agentSet} [\n${commands}\n]`
}

// ==========`Control` blocks=========
// if_block
forBlock["if_block"] = function (block, generator) {
	const condition = block.getFieldValue("CONDITION");
	const commands = generator.statementToCode(block, 'DO');
	return `if ${condition} [\n${commands}\n]`
}

// if_else_block
forBlock["if_else_block"] = function (block, generator) {
	const condition = block.getFieldValue("CONDITION");
	const commands = generator.statementToCode(block, 'DO_IF');
	const elseCommands = generator.statementToCode(block, 'DO_ELSE');
	return `ifelse ${condition} [\n${commands}\n] [\n${elseCommands}\n]`
}

// ==========`Operators` blocks=========
// Helper function for binary operators
function generateBinaryOperator(block, generator, operator, order) {
    const a = generator.valueToCode(block, "A", generator.ORDER_ATOMIC) || "0";
    const b = generator.valueToCode(block, "B", generator.ORDER_ATOMIC) || "0";
    return [`(${a} ${operator} ${b})`, order];
}

// Helper function for unary operators
function generateUnaryOperator(block, generator, operator, order) {
    const a = generator.valueToCode(block, "A", generator.ORDER_ATOMIC) || "false";
    return [`(${operator} ${a})`, order];
}


forBlock["operator_equals"] = function (block, generator) {
    return generateBinaryOperator(block, generator, "=", generator.ORDER_RELATIONAL);
};

forBlock["operator_not_equals"] = function (block, generator) {
    return generateBinaryOperator(block, generator, "!=", generator.ORDER_RELATIONAL);
};

forBlock["operator_greater_than"] = function (block, generator) {
    return generateBinaryOperator(block, generator, ">", generator.ORDER_RELATIONAL);
};

forBlock["operator_less_than"] = function (block, generator) {
    return generateBinaryOperator(block, generator, "<", generator.ORDER_RELATIONAL);
};

// =========`Logical Operators`=========
forBlock["operator_and"] = function (block, generator) {
    return generateBinaryOperator(block, generator, "and", generator.ORDER_LOGICAL_AND);
};

forBlock["operator_or"] = function (block, generator) {
    return generateBinaryOperator(block, generator, "or", generator.ORDER_LOGICAL_OR);
};

forBlock["operator_not"] = function (block, generator) {
    return generateUnaryOperator(block, generator, "not", generator.ORDER_LOGICAL_NOT);
};

// === `Arithmetic Operators` ===
forBlock["operator_add"] = function (block, generator) {
    return generateBinaryOperator(block, generator, "+", generator.ORDER_ADDITIVE);
};

forBlock["operator_subtract"] = function (block, generator) {
    return generateBinaryOperator(block, generator, "-", generator.ORDER_ADDITIVE);
};

forBlock["operator_multiply"] = function (block, generator) {
    return generateBinaryOperator(block, generator, "*", generator.ORDER_MULTIPLICATIVE);
};

forBlock["operator_divide"] = function (block, generator) {
    return generateBinaryOperator(block, generator, "/", generator.ORDER_MULTIPLICATIVE);
};

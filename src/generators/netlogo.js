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

    return `if ${condition} [\n${commands}\n]`;
};

// if_else_block with operator condition handling
forBlock["if_else_block"] = function (block, generator) {
    const condition = generator.valueToCode(block, "CONDITION", 0); // Get condition dynamically
    const commands = generator.statementToCode(block, 'DO_IF'); // Get commands for 'if' part
    const elseCommands = generator.statementToCode(block, 'DO_ELSE'); // Get commands for 'else' part

    return `ifelse ${condition} [\n${commands}\n] [\n${elseCommands}\n]`;
};

// Operator blocks
function generateComparisonBlock(operator) {
    return function (block, generator) {
        const argument0 = block.getFieldValue('A') || '0';
        const argument1 = block.getFieldValue('B') || '0';
        return [`(${argument0} ${operator} ${argument1})`, 6]; // 6 is the precedence level for comparison
    };
}

forBlock["operator_equals"] = generateComparisonBlock("==");
forBlock["operator_not_equals"] = generateComparisonBlock("!=");
forBlock["operator_greater_than"] = generateComparisonBlock(">");
forBlock["operator_less_than"] = generateComparisonBlock("<");
forBlock["operator_add"] = generateComparisonBlock("+");
forBlock["operator_subtract"] = generateComparisonBlock("-");
forBlock["operator_multiply"] = generateComparisonBlock("*");
forBlock["operator_divide"] = generateComparisonBlock("/");

// Logical operator blocks
function generateLogicalOperator(block, generator, operator) {
    const argument0 = generator.valueToCode(block, 'A', 0) || 'false';

    if (operator === 'not') {
        return [`not ${argument0}`, 6];
    }

    const argument1 = generator.valueToCode(block, 'B', 0) || 'false';
    return [`(${argument0} ${operator} ${argument1})`, 6];
}

// Logical operators
forBlock["operator_and"] = function (block, generator) {
    return generateLogicalOperator(block, generator, 'and');
};

forBlock["operator_or"] = function (block, generator) {
    return generateLogicalOperator(block, generator, 'or');
};

forBlock["operator_not"] = function (block, generator) {
    return generateLogicalOperator(block, generator, 'not');
};

// Random number block
forBlock["operator_random"] = function (block, generator) {
    const from = block.getFieldValue('FROM') || '0';
    const to = block.getFieldValue('TO') || '10';
    return [`random(${from}, ${to})`, 6]; 
};

// Color block
forBlock["set_color"] = function (block, generator) {
	const property = block.getFieldValue("PROPERTY");
	const value = block.getFieldValue("VALUE");
	return `set ${property} ${value}\n`;
}

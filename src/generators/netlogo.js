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

// ==========`Operators` blocks=========
// helper function to create operator blocks dynamically
function createOperatorBlock(operatorType) {
    return { kind: 'block', type: operatorType };
}

// list of all operator blocks (comparison, logical, and arithmetic)
const operatorTypes = [
    // Comparison Operators
    'operator_equals',
    'operator_not_equals',
    'operator_greater_than',
    'operator_less_than',
    
    // Logical Operators
    'operator_and',
    'operator_or',
    'operator_not',

    // Arithmetic Operators
    'operator_add',
    'operator_subtract',
    'operator_multiply',
    'operator_divide'
];

// generate all operator blocks
const operators = operatorTypes.map(createOperatorBlock);

// helper function to generate the corresponding code for each operator
function createOperatorGenerationCode(operatorType) {
    return function (block, generator) {
        const a = generator.valueToCode(block, 'A', 0) || "0"; // First operand
        const b = generator.valueToCode(block, 'B', 0) || "0"; // Second operand
        
        switch (operatorType) {
            // Arithmetic Operators
            case 'operator_add':
                return `(${a} + ${b})`;
            case 'operator_subtract':
                return `(${a} - ${b})`;
            case 'operator_multiply':
                return `(${a} * ${b})`;
            case 'operator_divide':
                return `(${a} / ${b})`;
            
            // Comparison Operators
            case 'operator_equals':
                return `(${a} == ${b})`;
            case 'operator_not_equals':
                return `(${a} != ${b})`; // Return as string
            case 'operator_greater_than':
                return `(${a} > ${b})`;
            case 'operator_less_than':
                return `(${a} < ${b})`;
            
            // Logical Operators
            case 'operator_and':
                return `(${a} && ${b})`;
            case 'operator_or':
                return `(${a} || ${b})`;
            case 'operator_not':
                return `(!${a})`;
            
            default:
                throw new Error(`Unknown operator type: ${operatorType}`);
        }
    };
}

// generate dynamically for all operators
operators.forEach(type => {
    forBlock[type] = createOperatorGenerationCode(type);
});

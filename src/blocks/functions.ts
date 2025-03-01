import { Block, Generator } from "blockly";


type BlockFunction = (block: Block, generator: Generator) => [string, number] | string | null;


const blockFunctions: Record<string, BlockFunction> = {
    clear_all: () => "clear-all",
    reset_ticks: () => "reset-ticks",
    die: () => "die",
    create_breeds: function (block, generator) {
        const breed = block.getFieldValue("BREED");
        const number = block.getFieldValue("NUMBER") ?? 0;
        const setup = generator.statementToCode(block, 'SETUP');

        let code = `create-${breed} ${number}`;
        if (setup) {
            code += ` [\n${setup}\n]`;
        }

        return code;
    },
    to: function (block, generator) {
        const name = block.getFieldValue("NAME");
        const code = generator.statementToCode(block, "CODE") ?? "";
        return name ? `to ${name}\n${code}\nend` : "";
    },
    setup: function (block, generator) {
        const code = generator.statementToCode(block, "CODE") ?? "";
        return `to setup\n${code}\nend`;
    },
    go: function (block, generator) {
        const code = generator.statementToCode(block, "CODE") ?? "";
        return `to go\n${code}\nend`;
    },
    ask: function (block, generator) {
        const agentSet = block.getFieldValue("AGENT_SET");
        const commands = generator.statementToCode(block, 'COMMANDS');
        return `ask ${agentSet} [\n${commands}\n]`
    },
    if: function (block, generator) {
        const condition = generator.valueToCode(block, "CONDITION", 0); // Get condition dynamically
        const commands = generator.statementToCode(block, 'DO'); // Get commands to run if the condition is true

        return `if ${condition} [\n${commands}\n]`;
    },
    ifelse: function (block, generator) {
        const condition = generator.valueToCode(block, "CONDITION", 0); // Get condition dynamically
        const commands = generator.statementToCode(block, 'DO_IF'); // Get commands for 'if' part
        const elseCommands = generator.statementToCode(block, 'DO_ELSE'); // Get commands for 'else' part

        return `ifelse ${condition} [\n${commands}\n] [\n${elseCommands}\n]`;
    },
    operator_equals: generateComparisonBlock("=="),
    operator_not_equals: generateComparisonBlock("!="),
    operator_greater_than: generateComparisonBlock(">"),
    operator_less_than: generateComparisonBlock("<"),
    operator_add: generateComparisonBlock("+"),
    operator_subtract: generateComparisonBlock("-"),
    operator_multiply: generateComparisonBlock("*"),
    operator_divide: generateComparisonBlock("/"),
    operator_and: generateLogicalOperator('and'),
    operator_or: generateLogicalOperator('or'),
    operator_not: generateLogicalOperator('not'),
    operator_random: function (block) {
        const from = block.getFieldValue('FROM') || '0';
        const to = block.getFieldValue('TO') || '10';
        return [`random(${from}, ${to})`, 6];
    },
    set_turtle_color: function (block) {
        const color = block.getFieldValue("VALUE");
        return `set color ${color}\n`;
    },
    set_patch_color: function (block) {
        const color = block.getFieldValue("VALUE");
        return `set pcolor ${color}\n`;
    },
    one_of: function (block, generator) {
        const list = generator.valueToCode(block, "LIST", 0);
        return `one-of ${list}`;
    }
}

export default blockFunctions;


function generateComparisonBlock(operator: string): BlockFunction {
    return function (block) {
        const argument0 = block.getFieldValue('A') || '0';
        const argument1 = block.getFieldValue('B') || '0';
        return [`(${argument0} ${operator} ${argument1})`, 6]; // 6 is the precedence level for comparison
    };
}

function generateLogicalOperator(operator: string): BlockFunction {
    return function (block, generator) {
        const argument0 = generator.valueToCode(block, 'A', 0) || 'false';

        if (operator === 'not') {
            return [`not ${argument0}`, 6];
        }

        const argument1 = generator.valueToCode(block, 'B', 0) || 'false';
        return [`(${argument0} ${operator} ${argument1})`, 6];
    }
}

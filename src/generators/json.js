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
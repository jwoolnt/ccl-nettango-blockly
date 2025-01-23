import * as Blockly from 'blockly';
export const jsonGenerator = new Blockly.Generator('JSON');

// 
// value blocks generator (e.g. null, math_number, text, logic_boolean)
// 
// return an array containing the value as a string and the precedence.
// use "getFieldValue" finds the field with the specified name and returns its value.
// 

// null
jsonGenerator.forBlock['logic_null'] = function(block) {
    return ['null', Order.ATOMIC];
};
// string
jsonGenerator.forBlock['text'] = function(block) {
    const textValue = block.getFieldValue('TEXT');
    const code = `"${textValue}"`;
    return [code, Order.ATOMIC];
};
// math number
jsonGenerator.forBlock['math_number'] = function(block) {
    const code = String(block.getFieldValue('NUM'));
    return [code, Order.ATOMIC];
};
// logic boolean
jsonGenerator.forBlock['logic_boolean'] = function(block) {
    const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
    return [code, Order.ATOMIC];
};

// 
// member block generator
//
// the member block has a text input field and a value input
// use the function getFieldValue, and introduce the function valueToCode
// # valueToCode does three things:
// Finds the blocks connected to the named value input (the second argument)
// Generates the code for that block
// Returns the code as a string
//

jsonGenerator.forBlock['member'] = function(block, generator) {
    const name = block.getFieldValue('MEMBER_NAME'); // field value
    const value = generator.valueToCode(
        block, 'MEMBER_VALUE', Order.ATOMIC);  // input value
    const code = `"${name}": ${value}`; // build code string
    return code;
};

// 
// array block generator
//

jsonGenerator.forBlock['lists_create_with'] = function(block, generator) {
    const values = [];
    for (let i = 0; i < block.itemCount_; i++) {
        const valueCode = generator.valueToCode(block, 'ADD' + i, Order.ATOMIC); // the code skips empty inputs by checking if valueCode is null.
        // to include empty inputs, use the string 'null' as value, check documentation
        if (valueCode) {
            values.push(valueCode); 
        }
    }
    const valueString = values.join(',\n');
    const indentedValueString =
        generator.prefixLines(valueString, generator.INDENT);
    const codeString = '[\n' + indentedValueString + '\n]';
    return [codeString, Order.ATOMIC];
};

// 
// object block generator
//
jsonGenerator.forBlock['object'] = function(block, generator) {
    const statementMembers =
        generator.statementToCode(block, 'MEMBERS');
    const code = '{\n' + statementMembers + '\n}';
    return [code, Order.ATOMIC];
};

// 
// generating a stack
//
jsonGenerator.scrub_ = function(block, code, thisOnly) {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly) {
        return code + ',\n' + jsonGenerator.blockToCode(nextBlock);
    }
    return code;
};


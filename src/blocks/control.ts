import { common } from 'blockly/core';
import { defineControlBlock } from './define';

const controlBlocks = [
    {
        ...defineControlBlock(
            "if_block",
            "if %1 then",
            "Executes the statements if the condition is true."
        ),
        args0: [
            { type: "input_value", name: "CONDITION", check: "Boolean" }
        ],
        message1: "%1",
        args1: [
            { type: "input_statement", name: "DO" }
        ]
    },
    {
        ...defineControlBlock(
            "if_else_block",
            "if %1 then",
            "Executes one set of statements if the condition is true, otherwise executes another."
        ),
        args0: [
            { type: "input_value", name: "CONDITION", check: "Boolean" }
        ],
        message1: "%1",
        args1: [
            { type: "input_statement", name: "DO_IF" }
        ],
        message2: "else %1",
        args2: [
            { type: "input_statement", name: "DO_ELSE" }
        ]
    }
];

export default common.createBlockDefinitionsFromJsonArray(controlBlocks);

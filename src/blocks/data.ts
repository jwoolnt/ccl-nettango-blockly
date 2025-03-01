import { common } from 'blockly/core';

const array_block = {
    type: "array_block",
    message0: "create list %1 %2 %3",
    args0: [
        {
            type: "input_value",
            name: "ELEMENT1",
            check: "String",
        },
        {
            type: "input_value",
            name: "ELEMENT2",
            check: "String",
        },
        {
            type: "input_value",
            name: "ELEMENT3",
            check: "String",
        },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "logic_blocks",
    tooltip: "Creates an array with three elements.",
    helpUrl: "",
};

// Variable block definitions for different data types
const variable_blocks = [
    {
        type: "number_variable",
        message0: "number %1",
        args0: [
            {
                type: "field_number",
                name: "VALUE",
                value: 0,
            },
        ],
        output: "String",
        style: "math_blocks",
        tooltip: "A number input.",
        helpUrl: "",
    },
    {
        type: "string_variable",
        message0: "string %1",
        args0: [
            {
                type: "field_input",
                name: "VALUE",
                text: " ",
            },
        ],
        output: "String",
        style: "text_blocks",
        tooltip: "A string input.",
        helpUrl: "",
    },
];

export default common.createBlockDefinitionsFromJsonArray([
    array_block,
    ...variable_blocks,
]);

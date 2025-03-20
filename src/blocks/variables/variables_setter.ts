import { common } from "blockly/core";
import { defineControlBlock } from "../define";

const variableBlocks = [
    {
        ...defineControlBlock(
            "variables_set",
            "set %1 to %2",
            "Sets a variable to a specified value."
        ),
        args0: [
            {
                type: "field_variable",
                name: "VAR",
                variable: "myVar"
            },
            {
                type: "input_value",
                name: "VALUE"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 330
    }
];

export default common.createBlockDefinitionsFromJsonArray(variableBlocks);

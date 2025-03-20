import { common } from "blockly/core";
import { defineControlBlock } from "../define";

const variableGetterBlock = [
    {
        ...defineControlBlock(
            "variables_get",
            "%1",
            "Gets the value of a variable."
        ),
        args0: [
            {
                type: "field_variable",
                name: "VAR",
                variable: "myVar"
            }
        ],
        output: null,
        colour: 330
    }
];

export default common.createBlockDefinitionsFromJsonArray(variableGetterBlock);

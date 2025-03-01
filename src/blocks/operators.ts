import { common } from "blockly/core";
import { defineOperatorBlock, createOperatorArgs } from './define';

const operators = [
    {
        type: "operator_add",
        message: "%1 + %2",
        output: "Number",
        tooltip: "Adds two numbers",
        args: createOperatorArgs([
            { name: "A", type: "number" },
            { name: "B", type: "number" }
        ])
    },
    {
        type: "operator_multiply",
        message: "%1 × %2",
        output: "Number",
        tooltip: "Multiplies two numbers",
        args: createOperatorArgs([
            { name: "A", type: "number" },
            { name: "B", type: "number" }

        ])
    },
    {
        type: "operator_subtract",
        message: "%1 - %2",
        output: "Number",
        tooltip: "Subtracts two numbers",
        args: createOperatorArgs([
            { name: "A", type: "number" },
            { name: "B", type: "number" }

        ])
    },
    {
        type: "operator_divide",
        message: "%1 ÷ %2",
        output: "Number",
        tooltip: "Divides two numbers",
        args: createOperatorArgs([
            { name: "A", type: "number" },
            { name: "B", type: "number" }

        ])
    },
    {
        type: "operator_random",
        message: "pick random %1 to %2",
        output: "Number",
        tooltip: "Returns a random number between two values", 
        args: createOperatorArgs([
            { name: "FROM", type: "number" }, 
            { name: "TO", type: "number" }
        ])
    },
    {
        type: "operator_greater_than",
        message: "%1 > %2",
        output: "Boolean",
        tooltip: "Checks if the first value is greater than the second.",
        args: createOperatorArgs([
            { name: "A", type: "number" },
            { name: "B", type: "number" }

        ])
    },
    {
        type: "operator_less_than",
        message: "%1 < %2",
        output: "Boolean",
        tooltip: "Checks if the first value is less than the second.",
        args: createOperatorArgs([
            { name: "A", type: "number" },
            { name: "B", type: "number" }

        ])
    },
    {
        type: "operator_equals",
        message: "%1 == %2",
        output: "Boolean",
        tooltip: "Checks if two values are equal.",
        args: createOperatorArgs([
            { name: "A", type: "text" },
            { name: "B", type: "text" }
        ])
    },
    {
        type: "operator_not_equals",
        message: "%1 != %2",
        output: "Boolean",
        tooltip: "Checks if two values are not equal.",
        args: createOperatorArgs([
            { name: "A", type: "text" },
            { name: "B", type: "text" }
        ])
    },
    {
        type: "operator_and",
        message: "%1 and %2",
        output: "Boolean",
        tooltip: "Returns true if both conditions are true.",
        args: createOperatorArgs([
            { name: "A", type: "boolean" },
            { name: "B", type: "boolean" }
        ])
    },
    {
        type: "operator_or",
        message: "%1 or %2",
        output: "Boolean",
        tooltip: "Returns true if at least one condition is true.",
        args: createOperatorArgs([
            { name: "A", type: "boolean" },
            { name: "B", type: "boolean" }
        ])
    },
    {
        type: "operator_not",
        message: "not %1",
        output: "Boolean",
        tooltip: "Returns true if the condition is false.",
        args: createOperatorArgs([
            { name: "A", type: "boolean" }
        ])
    }
];

const blockDefinitions = operators.map(op => ({
    ...defineOperatorBlock(op.type, op.message, op.output, op.tooltip),
    args0: op.args
}));

export default common.createBlockDefinitionsFromJsonArray(blockDefinitions);
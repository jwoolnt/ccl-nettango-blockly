import { common } from "blockly/core";

const operators = [
  {
    type: "operator_add",
    message0: "%1 + %2",
    args0: [
      { type: "field_number", name: "A", value: 0 }, // Use field_number for user input
      { type: "field_number", name: "B", value: 0 }, // Use field_number for user input
    ],
    inputsInline: true,
    output: "Number",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL, // Set output shape to hexagonal
    style: "math_blocks",
    tooltip: "Adds two numbers",
    helpUrl: "",
  },
  {
    type: "operator_subtract",
    message0: "%1 - %2",
    args0: [
      { type: "field_number", name: "A", value: 0 },
      { type: "field_number", name: "B", value: 0 },
    ],
    inputsInline: true,
    output: "Number",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "math_blocks",
    tooltip: "Subtracts two numbers",
    helpUrl: "",
  },
  {
    type: "operator_multiply",
    message0: "%1 × %2",
    args0: [
      { type: "field_number", name: "A", value: 0 },
      { type: "field_number", name: "B", value: 0 },
    ],
    inputsInline: true,
    output: "Number",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "math_blocks",
    tooltip: "Multiplies two numbers",
    helpUrl: "",
  },
  {
    type: "operator_divide",
    message0: "%1 ÷ %2",
    args0: [
      { type: "field_number", name: "A", value: 0 },
      { type: "field_number", name: "B", value: 0 },
    ],
    inputsInline: true,
    output: "Number",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "math_blocks",
    tooltip: "Divides two numbers",
    helpUrl: "",
  },
  {
    type: "operator_random",
    message0: "pick random %1 to %2",
    args0: [
      { type: "field_number", name: "FROM", value: 0 },
      { type: "field_number", name: "TO", value: 10 },
    ],
    inputsInline: true,
    output: "Number",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "math_blocks",
    tooltip: "Returns a random number between two values",
    helpUrl: "",
  },
  {
    type: "operator_greater_than",
    message0: "%1 > %2",
    args0: [
      { type: "field_number", name: "A", value: 0 },
      { type: "field_number", name: "B", value: 0 },
    ],
    inputsInline: true,
    output: "Boolean",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "logic_blocks",
    tooltip: "Checks if the first value is greater than the second.",
    helpUrl: "",
  },
  {
    type: "operator_less_than",
    message0: "%1 < %2",
    args0: [
      { type: "field_number", name: "A", value: 0 },
      { type: "field_number", name: "B", value: 0 },
    ],
    inputsInline: true,
    output: "Boolean",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "logic_blocks",
    tooltip: "Checks if the first value is less than the second.",
    helpUrl: "",
  },
  {
    type: "operator_equals",
    message0: "%1 = %2",
    args0: [
      { type: "field_input", name: "A", text: "" }, // Use field_input for user text input
      { type: "field_input", name: "B", text: "" }, // Use field_input for user text input
    ],
    inputsInline: true,
    output: "Boolean",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "logic_blocks",
    tooltip: "Checks if two values are equal.",
    helpUrl: "",
  },
  {
    type: "operator_not_equals",
    message0: "%1 != %2",
    args0: [
      { type: "field_input", name: "A", text: "" },
      { type: "field_input", name: "B", text: "" },
    ],
    inputsInline: true,
    output: "Boolean",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "logic_blocks",
    tooltip: "Checks if two values are not equal.",
    helpUrl: "",
  },
  {
    type: "operator_and",
    message0: "%1 and %2",
    args0: [
      { type: "input_value", name: "A", check: "Boolean" },
      { type: "input_value", name: "B", check: "Boolean" },
    ],
    inputsInline: true,
    output: "Boolean",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "logic_blocks",
    tooltip: "Returns true if both conditions are true.",
    helpUrl: "",
  },
  {
    type: "operator_or",
    message0: "%1 or %2",
    args0: [
      { type: "input_value", name: "A", check: "Boolean" },
      { type: "input_value", name: "B", check: "Boolean" },
    ],
    inputsInline: true,
    output: "Boolean",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "logic_blocks",
    tooltip: "Returns true if at least one condition is true.",
    helpUrl: "",
  },
  {
    type: "operator_not",
    message0: "not %1",
    args0: [{ type: "input_value", name: "A", check: "Boolean" }],
    inputsInline: true,
    output: "Boolean",
    outputShape: Blockly.OUTPUT_SHAPE_HEXAGONAL,
    style: "logic_blocks",
    tooltip: "Returns true if the condition is false.",
    helpUrl: "",
  },
];

export default common.createBlockDefinitionsFromJsonArray(operators);

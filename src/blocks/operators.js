import { common } from "blockly/core";

const operators = [
  {
    type: "operator_equals",
    message0: "%1 = %2",
    args0: [
      { type: "input_value", name: "A" },
      { type: "input_value", name: "B" },
    ],
    inputsInline: true,
    output: "Boolean",
    tooltip: "Checks if two values are equal in NetLogo.",
    helpUrl: "",
  },
  {
    type: "operator_not_equals",
    message0: "%1 != %2",
    args0: [
      { type: "input_value", name: "A" },
      { type: "input_value", name: "B" },
    ],
    inputsInline: true,
    output: "Boolean",
    tooltip: "Checks if two values are not equal in NetLogo.",
    helpUrl: "",
  },
  {
    type: "operator_greater_than",
    message0: "%1 > %2",
    args0: [
      { type: "input_value", name: "A" },
      { type: "input_value", name: "B" },
    ],
    inputsInline: true,
    output: "Boolean",
    tooltip: "Checks if the first value is greater than the second in NetLogo.",
    helpUrl: "",
  },
  {
    type: "operator_less_than",
    message0: "%1 < %2",
    args0: [
      { type: "input_value", name: "A" },
      { type: "input_value", name: "B" },
    ],
    inputsInline: true,
    output: "Boolean",
    tooltip: "Checks if the first value is less than the second in NetLogo.",
    helpUrl: "",
  },
  {
    type: "operator_and",
    message0: "%1 and %2",
    args0: [
      { type: "input_value", name: "A" },
      { type: "input_value", name: "B" },
    ],
    inputsInline: true,
    output: "Boolean",
    tooltip: "Returns true if both conditions are true in NetLogo.",
    helpUrl: "",
  },
  {
    type: "operator_or",
    message0: "%1 or %2",
    args0: [
      { type: "input_value", name: "A" },
      { type: "input_value", name: "B" },
    ],
    inputsInline: true,
    output: "Boolean",
    tooltip: "Returns true if at least one condition is true in NetLogo.",
    helpUrl: "",
  },
  {
    type: "operator_not",
    message0: "not %1",
    args0: [{ type: "input_value", name: "A" }],
    inputsInline: true,
    output: "Boolean",
    tooltip: "Returns true if the condition is false in NetLogo.",
    helpUrl: "",
  },
  {
    type: "operator_add",
    message0: "%1 + %2",
    args0: [
      { type: "input_value", name: "A", check: "Number" },
      { type: "input_value", name: "B", check: "Number" },
    ],
    inputsInline: true,
    output: "Number",
    tooltip: "Adds two numbers",
    helpUrl: "",
  },
  {
    type: "operator_subtract",
    message0: "%1 - %2",
    args0: [
      { type: "input_value", name: "A", check: "Number" },
      { type: "input_value", name: "B", check: "Number" },
    ],
    inputsInline: true,
    output: "Number",
    tooltip: "Subtracts two numbers",
    helpUrl: "",
  },
  {
    type: "operator_multiply",
    message0: "%1 × %2",
    args0: [
      { type: "input_value", name: "A", check: "Number" },
      { type: "input_value", name: "B", check: "Number" },
    ],
    inputsInline: true,
    output: "Number",
    tooltip: "Multiplies two numbers",
    helpUrl: "",
  },
  {
    type: "operator_divide",
    message0: "%1 ÷ %2",
    args0: [
      { type: "input_value", name: "A", check: "Number" },
      { type: "input_value", name: "B", check: "Number" },
    ],
    inputsInline: true,
    output: "Number",
    tooltip: "Divides two numbers",
    helpUrl: "",
  },
];

export default common.createBlockDefinitionsFromJsonArray(operators);

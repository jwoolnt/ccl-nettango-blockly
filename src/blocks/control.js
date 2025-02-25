import { common } from 'blockly/core';

const if_block = {
  type: "if_block",
  message0: "if %1 then",
  args0: [
    {
      type: "input_value",
      name: "CONDITION",
      check: "Boolean", // only Boolean blocks fit
    },
  ],
  message1: "%1", // This keeps the "do" part properly aligned
  args1: [
    {
      type: "input_statement",
      name: "DO",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  style: "logic_blocks", // specify logic blocks
  tooltip: "Executes the statements if the condition is true.",
  helpUrl: "",
};

const if_else_block = {
  type: "if_else_block",
  message0: "if %1 then",
  args0: [
    {
      type: "input_value",
      name: "CONDITION",
      check: "Boolean",
    },
  ],
  message1: "%1",
  args1: [
    {
      type: "input_statement",
      name: "DO_IF",
    },
  ],
  message2: "else %1",
  args2: [
    {
      type: "input_statement",
      name: "DO_ELSE",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  style: "logic_blocks",
  tooltip: "Executes one set of statements if the condition is true, otherwise executes another.",
  helpUrl: "",
};

export default common.createBlockDefinitionsFromJsonArray([
  if_block,
  if_else_block,
]);

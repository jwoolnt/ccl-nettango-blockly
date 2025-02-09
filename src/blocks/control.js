import { common } from 'blockly/core';

const if_block = {
    type: "if_block",
    message0: "if %1",
    args0: [
      {
        type: "input_value", // Allow expressions, not just text
        name: "CONDITION",
      },
    ],
    message1: "do %1",
    args1: [
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    tooltip: "Defines a conditional statement in NetLogo.",
    helpUrl: "",
  };
  
  const if_else_block = {
    type: "if_else_block",
    message0: "if %1",
    args0: [
      {
        type: "input_value",
        name: "CONDITION",
      },
    ],
    message1: "do %1",
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
    tooltip: "Defines an if/else conditional statement in NetLogo.",
    helpUrl: "",
  };

export default common.createBlockDefinitionsFromJsonArray([
  if_block,
  if_else_block,
]);

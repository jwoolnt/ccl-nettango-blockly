import { common } from 'blockly/core';

const setup_block = {
  type: "setup_block",
  message0: "setup",
  previousStatement: null,
  nextStatement: null,
  tooltip: "Defines the setup procedure in NetLogo.",
  helpUrl: "",
};

const go_block = {
  type: "go_block",
  message0: "go",
  previousStatement: null,
  nextStatement: null,
  tooltip: "Defines the go procedure in NetLogo.",
  helpUrl: "",
};

const ask_block = {
  type: "ask_block",
  message0: "ask %1 [ %2 ]",
  args0: [
    {
      type: "field_input",
      name: "AGENT",
      text: "turtles",
    },
    {
      type: "input_statement",
      name: "DO",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  tooltip: "Ask agents to perform a set of actions.",
  helpUrl: "",
};

const if_block = {
  type: "if_block",
  message0: "if %1 [ %2 ]",
  args0: [
    {
      type: "field_input",
      name: "CONDITION",
      text: "condition",
    },
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
    message0: "if %1 [ %2 ] else [ %3 ]",
    args0: [
      {
        type: "field_input",
        name: "CONDITION",
        text: "condition",
      },
      {
        type: "input_statement",
        name: "DO_IF",
      },
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
  setup_block,
  go_block,
  ask_block,
  if_block,
  if_else_block,
]);

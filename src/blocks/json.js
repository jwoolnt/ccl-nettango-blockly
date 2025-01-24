import * as Blockly from 'blockly';
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
      type: "setup_block",
      message0: "setup",
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: "Defines the setup procedure in NetLogo.",
      helpUrl: "",
  },
  {
      type: "go_block",
      message0: "go",
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: "Defines the go procedure in NetLogo.",
      helpUrl: "",
  },
  {
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
      colour: 160,
      tooltip: "Ask agents to perform a set of actions.",
      helpUrl: "",
  },
  {
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
      colour: 210,
      tooltip: "Defines a conditional statement in NetLogo.",
      helpUrl: "",
  },
  {
      type: "move_block",
      message0: "move %1 by %2 steps",
      args0: [
          {
              type: "field_dropdown",
              name: "DIRECTION",
              options: [
                  ["forward", "FORWARD"],
                  ["backward", "BACKWARD"],
              ],
          },
          {
              type: "field_number",
              name: "STEPS",
              value: 1,
              min: 1,
          },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 120,
      tooltip: "Moves agents forward or backward by a specified number of steps.",
      helpUrl: "",
  },
]);
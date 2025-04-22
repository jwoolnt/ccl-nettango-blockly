
import * as Blockly from "blockly/core";
import { BlockDefinition } from "./definition/types";
import { createStatementBlock } from "./definition/utilities";
import { VariableRegistry } from "./ui/variable_registry";

// Register the extension to dynamically update variable options
Blockly.Extensions.register("dynamic_variable_dropdown", function(this: Blockly.Block) {
  const block = this;

  const updateDropdown = () => {
    const scope = block.getFieldValue("SCOPE") || "global";  
    const scopedVars = VariableRegistry.getAllVariables(scope);

    const options: Blockly.MenuOption[] = scopedVars.map(v => [v.name, v.name]);
    if (options.length === 0) {
      options.push(["<none>", ""]);
    }

    const dropdown = block.getField("VAR_NAME") as Blockly.FieldDropdown;
    if (dropdown) {
      dropdown.getOptions = () => options;
      dropdown.setValue(options[0]?.[1] ?? "");
    }
  };

  updateDropdown();

  block.setOnChange(function(event: Blockly.Events.Abstract) {
    if (event.type === Blockly.Events.BLOCK_CHANGE &&
        'element' in event && event.element === "field" &&
        'name' in event && event.name === "SCOPE") {
      updateDropdown();
    }
  });
});

// Add a mutation observer or onchange handler
Blockly.Extensions.register("register_scope_variables", function (this: Blockly.Block) {
  const block = this;

  const updateRegistry = () => {
    const scope = block.getFieldValue("SCOPE") || "globals";
    const rawScope = scope.replace("-own", "").replace("s", "");

    const vars: string[] = [];
    let currentBlock = block.getInputTargetBlock("VAR_BLOCKS");

    while (currentBlock) {
      const name = currentBlock.getFieldValue("VAR_NAME");
      if (name) {
        vars.push(name);
        VariableRegistry.registerVariable(name, rawScope);
      }
      currentBlock = currentBlock.getNextBlock();
    }
  };

  // Run once when block is created
  updateRegistry();

  block.setOnChange((event) => {
    if (
      event.type === Blockly.Events.BLOCK_MOVE ||
      event.type === Blockly.Events.BLOCK_CREATE ||
      event.type === Blockly.Events.BLOCK_CHANGE
    ) {
      updateRegistry();
    }
  });
});


// 
const setVariableBlock: BlockDefinition = createStatementBlock("set_variable", {
  message0: "set %1 %2 to %3",
  args0: [
    {
      type: "field_dropdown",
      name: "SCOPE",
      options: [
        ["global", "global"],
        ["turtle", "turtles-own"],
        ["patch", "patches-own"],
        ["link", "links-own"]
      ]
    },
    {
      type: "field_dropdown",
      name: "VAR_NAME",
      options: () => [["<none>", ""]]
    },
    {
      type: "input_value",
      name: "VALUE"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  tooltip: "Set a variable by scope",
  helpUrl: "",
  extensions: ["dynamic_variable_dropdown", "register_scope_variables"],

  for: (block, generator) => {
    const scope = block.getFieldValue("SCOPE") || "global";
    const variableName = block.getFieldValue("VAR_NAME") || "";
    const value = generator.valueToCode(block, "VALUE", 0) || "";

    return `${scope} ${variableName} ${value}`;
  }
});
const getVariableBlock = createStatementBlock("get_variable", {
  message0: "%1 %2",
  args0: [
    {
      type: "field_dropdown",
      name: "SCOPE",
      options: [
        ["global", "global"],
        ["turtle", "turtle"],
        ["patch", "patch"],
        ["link", "link"]
      ]
    },
    {
      type: "field_dropdown",
      name: "VAR_NAME",
      options: () => [["<none>", ""]]
    }
  ],
  output: null,
  tooltip: "Get a variable by scope",
  extensions: ["dynamic_variable_dropdown"],
  for: (block, generator) => {
    const scope = block.getFieldValue("SCOPE") || "global";
    const variableName = block.getFieldValue("VAR_NAME") || null;
    return `${variableName}`;
  }
});

// Define a block for setting multiple variables by scope
const setScopedVariablesBlock: BlockDefinition = createStatementBlock("declare_variables_by_scope", {
  message0: "set %1 [ %2 ] do %3",
  args0: [
    {
      type: "field_dropdown",
      name: "SCOPE",
      options: [
        ["globals", "globals"],
        ["turtles", "turtles-own"],
        ["patches", "patches-own"],
        ["links", "links-own"]
      ]
    },
    {
      type: "input_statement",
      name: "VAR_BLOCKS"
    },
    {
      type: "input_statement",
      name: "DO"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  tooltip: "Declare multiple variables using variable blocks",
  extensions: [],
  for: (block, generator) => {
    const scope = block.getFieldValue("SCOPE") || "globals";
    const rawScope = scope.replace("-own", "").replace("s", ""); // global, turtle, patch, link

    // Parse child get_variable blocks
    const vars: string[] = [];
    let currentBlock = block.getInputTargetBlock("VAR_BLOCKS");

    while (currentBlock) {
      const name = currentBlock.getFieldValue("VAR_NAME");
      if (name) {
        vars.push(name);
        VariableRegistry.registerVariable(name, rawScope);
      }
      currentBlock = currentBlock.getNextBlock();
    }

    const innerCode = generator.statementToCode(block, "DO") || "";

    const declLine = `${scope} [ ${vars.join(" ")} ]\n`;

    return `${declLine}${innerCode}`;
  }
});

// Export the blocks
const variableBlocks: BlockDefinition[] = [
  setVariableBlock,
  getVariableBlock,
  setScopedVariablesBlock
];

export default variableBlocks;
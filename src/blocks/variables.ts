
import * as Blockly from "blockly/core";
import { BlockDefinition } from "./definition/types";
import { createStatementBlock } from "./definition/utilities";
import { VariableRegistry } from "./ui/variable_registry";

// Register the extension to dynamically update variable options
Blockly.Extensions.register("dynamic_variable_dropdown", function(this: Blockly.Block) {
  const block = this;

  const updateDropdown = () => {
    let scope = block.getFieldValue("SCOPE") || "global";  
    // scope = scope.replace("-own", "").replace("s", ""); // Normalize scope for registry

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
    if (event.type === Blockly.Events.BLOCK_CHANGE) {
      // Cast to the correct event type
      const changeEvent = event as Blockly.Events.BlockChange;
      
      // Now check if this change event is for the SCOPE field
      if (changeEvent.element === "field" && changeEvent.name === "SCOPE") {
        updateDropdown();
      }
    }
  });

});

// Define a block for setting a variable by scope
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
        ["link", "link"]
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
  extensions: ["dynamic_variable_dropdown"],

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

// Export the blocks
const variableBlocks: BlockDefinition[] = [
  setVariableBlock,
  getVariableBlock,
];

export default variableBlocks;
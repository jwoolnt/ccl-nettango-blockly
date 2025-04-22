
import * as Blockly from "blockly/core";
import { BlockDefinition } from "./definition/types";
import { createStatementBlock } from "./definition/utilities";
import { VariableRegistry } from "./ui/variable_registry";

// Register the extension to dynamically update variable options
Blockly.Extensions.register("dynamic_variable_dropdown", function(this: Blockly.Block) {
  const block = this;

  const updateDropdown = () => {
    // Get all variables from the registry
    const allVars = VariableRegistry.getAllVariables();
  
    // Filter to variables used in this dropdown
    const options: Blockly.MenuOption[] = allVars.map(v => [v.name, v.name] as [string, string]);
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

// Define the set_variable block
const setVariableBlock: BlockDefinition = createStatementBlock("set_variable", {
    message0: "set %1 to %2",
    args0: [
      {
        type: "field_dropdown",
        name: "VAR_NAME",
        options: () => {
          // Initially setting default options
          return [["<none>", ""]];
        }
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
    extensions: ["dynamic_variable_dropdown"],  // Dynamically update the variable list
    for: (block, generator) => {
      const variableName = block.getFieldValue("VAR_NAME") || null;
      const value = generator.valueToCode(block, "VALUE", 0) || null;
      return `set ${variableName} ${value}`; 
    }
  }
);

const getVariableBlock = createStatementBlock("get_variable", {
    message0: "get %1",
    args0: [
        {
            type: "field_dropdown",
            name: "VAR_NAME",
            options: () => {
                // Initially setting default options
                return [["<none>", ""]];
            }
        }
    ],
    output: null,
    tooltip: "Get a variable by scope",
    helpUrl: "",
    extensions: ["dynamic_variable_dropdown"],  // Dynamically update the variable list
    for: (block, generator) => {
        const variableName = block.getFieldValue("VAR_NAME") || null;
        return `${variableName}`;
    }
});


// Export the blocks
const variableBlocks: BlockDefinition[] = [
  setVariableBlock,
  getVariableBlock
];

export default variableBlocks;
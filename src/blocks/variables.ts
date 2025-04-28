import * as Blockly from "blockly/core";
import { BlockDefinition } from "./definition/types";
import { createStatementBlock } from "./definition/utilities";
import { VariableRegistry, NetLogoScope } from "./ui/variable_registry";
import { openCustomVariableModal } from "./ui/variable_model";

// Register the extension to dynamically update variable options
Blockly.Extensions.register("dynamic_variable_dropdown", function(this: Blockly.Block) {
  const block = this;

  const updateDropdown = () => {
    const scope = block.getFieldValue("SCOPE") || "global";  
    const scopedVars = VariableRegistry.getAllVariables(scope);
    const options: Blockly.MenuOption[] = scopedVars.map(v => [v.name, v.name]);
  
    // Add an option to create a new variable (will open the modal)
    options.push(["+ Create new variable...", "CREATE_NEW"]);
  
    if (options.length === 1) {
      // If only the "Create new" option exists, add a placeholder
      options.unshift(["<none>", ""]);
    }
  
    const dropdown = block.getField("VAR_NAME") as Blockly.FieldDropdown;
    
    if (dropdown) {
      dropdown.getOptions = () => options;
      
      // Only set default value if there are actual variables
      if (scopedVars.length > 0) {
        dropdown.setValue(options[0]?.[1] ?? "");
      }
    }
  };  

  updateDropdown();

  block.setOnChange(function(event: Blockly.Events.Abstract) {
    if (event.type === Blockly.Events.BLOCK_CHANGE) {
      // Cast to the correct event type
      const changeEvent = event as Blockly.Events.BlockChange;
      
      // Check if this is a field change
      if (changeEvent.element === "field") {
        // If the scope changed, update the variable dropdown
        if (changeEvent.name === "SCOPE") {
          updateDropdown();
        }
        
        // If user selected "Create new variable"
        if (changeEvent.name === "VAR_NAME" && changeEvent.newValue === "CREATE_NEW") {
          // Open the variable modal
          openCustomVariableModal();
          
          // Set back to previous value or empty to prevent showing "Create new variable" as selected
          const dropdown = block.getField("VAR_NAME") as Blockly.FieldDropdown;
          dropdown.setValue(changeEvent.oldValue || "");
          
          // The modal will handle variable creation and the dropdown will be updated next time it's clicked
        }
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
        ["turtle", "turtle"],
        ["patch", "patch"],
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
    const variableName = block.getFieldValue("VAR_NAME") || "";
    const value = generator.valueToCode(block, "VALUE", 0) || "0";

    return `set ${variableName} ${value}`;
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
    const variableName = block.getFieldValue("VAR_NAME") || "";
    return variableName;
  }
});

// Export the blocks
const variableBlocks: BlockDefinition[] = [
  setVariableBlock,
  getVariableBlock,
];

export default variableBlocks;
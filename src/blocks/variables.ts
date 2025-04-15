import * as Blockly from "blockly/core";
import { Block, common } from "blockly/core";
import { BlockDefinition } from "./definition/types";
import { createStatementBlock } from "./definition/utilities";

import { VariableRegistry } from "./ui/variable_registry";

// Register the extension
Blockly.Extensions.register("dynamic_variable_dropdown", function () {
  const scopeField = this.getField("SCOPE");
  const oldVarField = this.getField("VAR_NAME");

  if (!scopeField || !oldVarField || !(oldVarField instanceof Blockly.FieldDropdown)) return;

  const scope = scopeField.getValue();

  const availableVars: [string, string][] = VariableRegistry.getVariablesByScope(scope).map(
    (v) => [v.name, v.name]
  );

  const newMenuGenerator: Blockly.MenuGeneratorFunction = () =>
    availableVars.length ? availableVars : [["<none>", ""]];

  // Create a new dropdown and replace the old one
  const newDropdown = new Blockly.FieldDropdown(newMenuGenerator);

  // Remove old and append new (simulated update)
  this.removeInput("VAR_NAME", true); // true = no error if not found
  this.appendDummyInput("VAR_NAME").appendField(newDropdown, "VAR_NAME");
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
    // extensions: ["dynamic_variable_dropdown"]  // Dynamically update the variable list
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
    // extensions: ["dynamic_variable_dropdown"]  // Dynamically update the variable list
});

export default [
    setVariableBlock,
    getVariableBlock
].map((block) => {
    block.type = block.type.replace(/_/g, "-");
    return block;
}
) as BlockDefinition[];
// Register the blocks
common.defineBlocks({
    set_variable: setVariableBlock,
    get_variable: getVariableBlock
});


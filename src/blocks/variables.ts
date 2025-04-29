import * as Blockly from "blockly/core";
import { createStatementBlock } from "./definition/utilities";
import { VariableRegistry, NetLogoScope } from "./ui/variable_registry";
import { openCustomVariableModal } from "./ui/variable_modal";

/**
 * Function: generates options for a dropdown
 * param: scope to get variables for
 * return: array of options for the dropdown
 */
function generateVariableOptions(scope: string): Blockly.MenuOption[] {
    try {
        // Get variables for the given scope
        const scopedVars = VariableRegistry.getVariablesByScope(scope as NetLogoScope) || [];
        const options: Blockly.MenuOption[] = scopedVars.map(v => [v.name, v.name]);
        
        // Add an option to create a new variable
        options.push(["+ Create new variable...", "CREATE_NEW"]);
        
        if (options.length === 1) {
            options.unshift(["<none>", ""]);
        }
        
        return options;
    } catch (err) {
        console.error("Error generating variable options:", err);
        return [["<error>", ""]];
    }
}

/**
 * Function: generates scope options including custom breeds
 * return: An array of options for the scope dropdown
 */
function generateScopeOptions(): Blockly.MenuOption[] {
    try {
        // Start with the default scopes
        const options = [
            ["global", "global"],
            ["turtle", "turtle"],
            ["patch", "patch"],
            ["link", "link"]
        ];
        
        // Add custom breed scopes
        const customScopes = VariableRegistry.getCustomScopes() || [];
        customScopes.forEach(scope => {
            options.push([scope, scope]);
        });
        
        return options as [string, string][];
    } catch (err) {
        console.error("Error generating scope options:", err);
        return [
            ["global", "global"],
            ["turtle", "turtle"],
            ["patch", "patch"],
            ["link", "link"]
        ];
    }
}

// Register the extension to dynamically update variable options
Blockly.Extensions.register("dynamic_variable_dropdown", function(this) {
    const block = this;
    
    // Keep track of field update operations to prevent infinite loops
    let isUpdating = false;
    
    const updateDropdown = () => {
        if (isUpdating) return;
        isUpdating = true;
        
        try {
            const scope = block.getFieldValue("SCOPE") || "global";
            const options = generateVariableOptions(scope);
            
            const dropdown = block.getField("VAR_NAME") as Blockly.FieldDropdown;
            if (dropdown) {
                // Store the current value
                const currentValue = dropdown.getValue() || "";
                
                // Update the dropdown options
                dropdown.getOptions = () => options;
                
                // Try to preserve the current value if it's still valid
                const validValues = options.map(opt => opt[1]);
                if (validValues.includes(currentValue)) {
                    dropdown.setValue(currentValue);
                } else {
                    dropdown.setValue(options[0]?.[1] ?? "");
                }
                
                // Force a redraw of the dropdown
                if (dropdown.forceRerender) {
                    dropdown.forceRerender();
                }
            }
        } catch (err) {
            console.error("Error updating variable dropdown:", err);
        } finally {
            isUpdating = false;
        }
    };
    
    // Update the scope dropdown to include custom breeds
    const updateScopeDropdown = () => {
        if (isUpdating) return;
        isUpdating = true;
        
        try {
            const dropdown = block.getField("SCOPE");
            
            if (dropdown) {
                // Store the current value
                const currentValue = dropdown.getValue() || "global";
                
                // Update the dropdown options
                (dropdown as Blockly.FieldDropdown).getOptions = generateScopeOptions;
                
                // Try to preserve the current value
                dropdown.setValue(currentValue);
                
                // Force a redraw of the dropdown
                if ((dropdown as any).forceRerender) {
                    (dropdown as any).forceRerender();
                }
                
                // Update the variable dropdown to match the current scope
                updateDropdown();
            }
        } catch (err) {
            console.error("Error updating scope dropdown:", err);
        } finally {
            isUpdating = false;
        }
    };
    
    // Initialize dropdowns
    try {
        updateScopeDropdown();
        updateDropdown();
    } catch (err) {
        console.error("Error initializing dropdowns:", err);
    }
    
    // Throttle function to prevent excessive updates
    let updateTimeout: any = null;
    const throttledUpdate = () => {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        updateTimeout = setTimeout(() => {
            try {
                updateScopeDropdown();
                updateDropdown();
            } catch (err) {
                console.error("Error in throttled update:", err);
            }
        }, 100);
    };
    
    // Set up change listener with error handling
    block.setOnChange(function(event) {
        try {
            // Handle block change events
            if (event.type === Blockly.Events.BLOCK_CHANGE) {
                // Check if this is a field change
                if ((event as Blockly.Events.BlockChange).element === "field") {
                    // If the scope changed, update the variable dropdown
                    if ((event as Blockly.Events.BlockChange).name === "SCOPE") {
                        updateDropdown();
                    }
                    
                    // If user selected "Create new variable"
                    if ((event as Blockly.Events.BlockChange).name === "VAR_NAME" && 
                        (event as Blockly.Events.BlockChange).newValue === "CREATE_NEW") {
                        // Open the variable modal
                        try {
                            openCustomVariableModal();
                        } catch (err) {
                            console.error("Error opening variable modal:", err);
                        }
                        
                        // Set back to previous value or empty to prevent showing "Create new variable" as selected
                        const dropdown = block.getField("VAR_NAME");
                        if (dropdown) {
                            dropdown.setValue((event as Blockly.Events.BlockChange).oldValue || "");
                        }
                    }
                }
            }
            
            // Handle workspace changes that might affect breeds
            if (event.type === Blockly.Events.FINISHED_LOADING) {
                throttledUpdate();
            }
        } catch (err) {
            console.error("Error in block change handler:", err);
        }
    });
});

// Define a block for setting a variable by scope
const setVariableBlock = createStatementBlock("set_variable", {
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
                // Custom breeds will be added dynamically
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
        try {
            const variableName = block.getFieldValue("VAR_NAME") || "";
            const value = generator.valueToCode(block, "VALUE", 0) || "0";
            
            return `set ${variableName} ${value}`;
        } catch (err) {
            console.error("Error generating code for set_variable:", err);
            return "# Error generating code";
        }
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
                // Custom breeds will be added dynamically
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
        try {
            const variableName = block.getFieldValue("VAR_NAME") || "";
            return variableName;
        } catch (err) {
            console.error("Error generating code for get_variable:", err);
            return "# Error generating code";
        }
    }
});

// Export the blocks
const variableBlocks = [
    setVariableBlock,
    getVariableBlock,
];

export default variableBlocks;
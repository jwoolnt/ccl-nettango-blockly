import { Generator } from "blockly";
import { forBlocks } from "../blocks";
import { VariableRegistry } from "../blocks/ui/variable_registry";
import { getBreeds } from "../data/breeds";

// Declare the extension to the Generator type
declare module "blockly" {
    interface Generator {
        generateVariableDeclarations?: () => string;
    }
}

// Create the generator
const netlogoGenerator = new Generator('NetLogo');

// Assign the code generation function
netlogoGenerator.forBlock = forBlocks;

// Add the variable declarations function
netlogoGenerator.generateVariableDeclarations = function () {
    let declarationCode = '';

    // Always include globals
    const globalVars = VariableRegistry.getAllVariables('global');
    declarationCode += 'globals [' + globalVars.map(v => v.name).join(' ') + ']\n';

    // Map built-in agent types to NetLogo declarations
    const scopeToDeclaration = {
        'turtle': 'turtles-own',
        'patch': 'patches-own',
        'link': 'links-own'
    };

    Object.entries(scopeToDeclaration).forEach(([scope, declaration]) => {
        const vars = VariableRegistry.getAllVariables(scope);
        if (vars.length > 0) {
            declarationCode += `${declaration} [${vars.map(v => v.name).join(' ')}]\n`;
        }
    });

    // Now handle custom breeds
    const breeds = getBreeds();
    for (const [plural, singular] of breeds) {
        if (plural !== "turtles" && plural !== "links") { 
            declarationCode += `breed [ ${plural} ${singular} ]\n`;

            // Optionally: if breed-specific variables, generate
            const breedVars = VariableRegistry.getAllVariables(plural);
            if (breedVars.length > 0) {
                declarationCode += `${plural}-own [${breedVars.map(v => v.name).join(' ')}]\n`;
            }
        }
    }

    return declarationCode;
};

// Override the original workspaceToCode method to include variable declarations
const originalWorkspaceToCode = netlogoGenerator.workspaceToCode;

netlogoGenerator.workspaceToCode = function (workspace) {
    const variableDeclarations = this.generateVariableDeclarations?.() || '';

    // Get the regular code
    const code = originalWorkspaceToCode.call(this, workspace);

    // Combine them, with a blank line in between if there's code
    return variableDeclarations + (code ? '\n' + code : '');
};

netlogoGenerator.scrub_ = (block, code, thisOnly) => {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();

    if (!thisOnly && nextBlock) {
        return code + '\n' + netlogoGenerator.blockToCode(nextBlock);
    }

    return code;
};

export default netlogoGenerator;
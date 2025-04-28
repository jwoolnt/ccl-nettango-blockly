import { Generator } from "blockly";
import { forBlocks } from "../blocks";
import { VariableRegistry } from "../blocks/ui/variable_registry";

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

    // Always include globals, even if empty
    const globalVars = VariableRegistry.getAllVariables('global');
    declarationCode += 'globals [' + globalVars.map(v => v.name).join(' ') + ']\n';

    // Map internal scope names to NetLogo declarations
    const scopeToDeclaration = {
        'turtle': 'turtles-own',
        'patch': 'patches-own',
        'link': 'links-own'
    };

    // Add declarations for each breed-like scope
    Object.entries(scopeToDeclaration).forEach(([scope, declaration]) => {
        const vars = VariableRegistry.getAllVariables(scope);
        if (vars.length > 0) {
            declarationCode += `${declaration} [${vars.map(v => v.name).join(' ')}]\n`;
        }
    });

    return declarationCode;
};

// Override the original workspaceToCode method to include variable declarations
const originalWorkspaceToCode = netlogoGenerator.workspaceToCode;
netlogoGenerator.workspaceToCode = function (workspace) {
    // TypeScript now knows this function can exist
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
// services/generator.ts
import { Generator } from "blockly";
import { forBlocks } from "../blocks";
import { getAllAgentSets, getVariables, getGlobalVariables } from "../data/context";
import { getTurtleBreeds } from "../data/context";
import { DOMAIN_BLOCKS } from "../blocks/domain";
import { getVariableInitialValues } from "../components/variablesTracker";


const netlogoGenerator = new Generator('NetLogo');

// netlogoGenerator.forBlock = forBlocks;
netlogoGenerator.forBlock = new Proxy(forBlocks, {
    get(target, prop) {
        if (typeof prop !== "string") return undefined;

        // Check main blocks first
        if (target[prop]) return target[prop];

        // Check domain blocks
        for (const { blocks } of Object.values(DOMAIN_BLOCKS)) {
            const block = blocks.find(b => typeof b !== 'function' && b.type === prop);
            if (block && typeof block !== 'function' && block.for) {
                return block.for;
            }
        }

        return undefined;
    },

    set(target, prop, value) {
        if (typeof prop === "string") target[prop] = value;
        return true;
    }
});

netlogoGenerator.workspaceToCode = (workspace) => {
    let code = "";

    if (workspace) {
        workspace.getTopBlocks(true).forEach(block => {
            if (block.type === "procedures_defnoreturn") {
                code += netlogoGenerator.blockToCode(block);
            }
        });
    }

    return code;
}

// // Function to generate variable initialization code
// export function generateVariableInitialization(): string {
//   const variableValues = getVariableInitialValues();

//   if (variableValues.size === 0) return '';

//   let code = '  ; Variables initialized from UI controls\n';
//   for (const [name, value] of variableValues.entries()) {
//     if (typeof value === 'number') {
//       code += `  set ${name} ${value}\n`;
//     } else if (typeof value === 'boolean') {
//       code += `  set ${name} ${value ? 'true' : 'false'}\n`;
//     }
//   }

//   return code;
// }

// netlogoGenerator.workspaceToCode = (workspace) => {
//     let code = "";

//     if (workspace) {
//         workspace.getTopBlocks(true).forEach(block => {
//             if (block.type === "procedures_defnoreturn") {
//                 let procedureCode = netlogoGenerator.blockToCode(block);
                
//                 // If this is the setup procedure, inject variable initialization
//                 if (block.getFieldValue && block.getFieldValue('NAME') === 'setup') {
//                     const initCode = generateVariableInitialization();
//                     if (initCode) {
//                         // Insert initialization right after "to setup" line
//                         procedureCode = procedureCode.replace(
//                             /to setup\s*\n/,
//                             `to setup\n${initCode}`
//                         );
//                     }
//                 }
                
//                 code += procedureCode;
//             }
//         });
//     }

//     return code;
// }

netlogoGenerator.scrub_ = (block, code, thisOnly) => {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();

    if (!thisOnly && nextBlock) {
        return code + '\n' + netlogoGenerator.blockToCode(nextBlock);
    }

    return code;
};

export function generateCodePrefix() {
    let prefix = "";

    const UI_VARIABLES = getVariables("ui")?.join(" ");
    if (UI_VARIABLES) {
        prefix += `; ui [ ${UI_VARIABLES} ]\n\n`;
    }

    const GLOBAL_VARIABLES = getGlobalVariables().join(" ");
    if (GLOBAL_VARIABLES) {
        prefix += `globals [ ${GLOBAL_VARIABLES} ]\n\n`;
    }

    const TURTLE_BREEDS = getTurtleBreeds().map(
        ({ pluralName, singularName }) => `breed [${pluralName} ${singularName}]`
    ).join("\n");
    if (TURTLE_BREEDS) {
        prefix += `${TURTLE_BREEDS}\n\n`;
    }
    // TODO: prefix code for link breeds

    let breedVariableCode = "";
    for (const TYPE of getAllAgentSets()) {
        let breedVariables = getVariables(TYPE);
        if (breedVariables?.length) {
            breedVariableCode += `${TYPE}-own [ ${breedVariables.join(" ")} ]\n`;
        }
    }
    if (breedVariableCode) {
        prefix += `${breedVariableCode}\n`;
    }

    return prefix;
}

export default netlogoGenerator;
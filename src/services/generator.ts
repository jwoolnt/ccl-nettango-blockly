import { Generator } from "blockly";
import { forBlocks } from "../blocks";
import { getBreedVariables, getGlobals } from "../data/variables";
import { getTurtleBreeds } from "../data/breeds";


const netlogoGenerator = new Generator('NetLogo');

netlogoGenerator.forBlock = forBlocks;

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

    const GLOBAL_VARIABLES = getGlobals(false).join(" ");
    if (GLOBAL_VARIABLES) {
        prefix += `globals [ ${GLOBAL_VARIABLES} ]\n\n`;
    }

    const TURTLE_BREEDS = getTurtleBreeds(false).map(
        ([plural, singular]) => `breed [${plural} ${singular}]`
    ).join("\n");
    if (TURTLE_BREEDS) {
        prefix += `${TURTLE_BREEDS}\n\n`;
    }

    let breed_variable_code = "";
    const BREED_VARIABLES = getBreedVariables(false);
    for (const BREED in BREED_VARIABLES) {
        breed_variable_code += `${BREED}-own [ ${BREED_VARIABLES[BREED].join(" ")} ]\n\n`;
    }
    if (breed_variable_code) {
        prefix += `${breed_variable_code}\n\n`;
    }

    // TODO: prefix code for links

    return prefix ? prefix + "\n" : "";
}


export default netlogoGenerator;

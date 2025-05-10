import { Generator } from "blockly";
import { forBlocks } from "../blocks";
import { getGlobals } from "../data/globals";
import { getTurtleBreeds } from "../data/breeds";


const netlogoGenerator = new Generator('NetLogo');

netlogoGenerator.forBlock = forBlocks;

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
    if (TURTLE_BREEDS.length) {
        prefix += `${TURTLE_BREEDS}\n\n`;
    }

    // TODO: prefix code for links

    return prefix;
}


export default netlogoGenerator;

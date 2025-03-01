import { Generator } from "blockly";
import blockFunctions from "../blocks/functions";


const netlogoGenerator = new Generator('NetLogo');

netlogoGenerator.forBlock = blockFunctions;

netlogoGenerator.scrub_ = (block, code, thisOnly) => {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();

    if (!thisOnly && nextBlock) {
        return code + '\n' + netlogoGenerator.blockToCode(nextBlock);
    }

    return code;
};


export default netlogoGenerator;

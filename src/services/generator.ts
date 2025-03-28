import { Generator } from "blockly";
import { forBlocks } from "../blocks";


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


export default netlogoGenerator;

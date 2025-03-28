import { common } from 'blockly/core';
import { BlockDefinition, BlockFunction } from './definition/types';
import turtleBlocks from "./turtles";


const allBlocks: BlockDefinition[] = [
	...turtleBlocks
]

const activeBlocks = common.createBlockDefinitionsFromJsonArray(allBlocks);

export const forBlocks: Record<string, BlockFunction> = {};
allBlocks.forEach(blockDefinition => forBlocks[blockDefinition.type] = blockDefinition.for)


export default activeBlocks;

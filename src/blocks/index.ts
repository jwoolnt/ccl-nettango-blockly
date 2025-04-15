import { common } from 'blockly/core';
import { BlockDefinition, BlockFunction } from './definition/types';
import observerBlocks from './observer';
import turtleBlocks from "./turtles";
import logicBlocks from "./logic";
import mathBlocks from "./math";
import stringBlocks from "./strings";
import agentsetBlocks from "./agentset";
import setVariableBlock from './variables';


const allBlocks: BlockDefinition[] = [
	...observerBlocks,
	...turtleBlocks,
	...logicBlocks,
	...mathBlocks,
	...stringBlocks,
	...agentsetBlocks,
	...setVariableBlock,
]

const activeBlocks = common.createBlockDefinitionsFromJsonArray(allBlocks);

export const forBlocks: Record<string, BlockFunction> = {};
allBlocks.forEach(blockDefinition => forBlocks[blockDefinition.type] = blockDefinition.for)


export default activeBlocks;

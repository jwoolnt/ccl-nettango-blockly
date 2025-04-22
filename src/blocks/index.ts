import { common } from 'blockly/core';
import { BlockDefinition, BlockFunction } from './definition/types';
import observerBlocks from './observer';
import turtleBlocks from "./turtles";
import logicBlocks from "./logic";
import mathBlocks from "./math";
import operatorBlocks from "./operators";
import stringBlocks from "./strings";
import agentsetBlocks from "./agentset";
import variables from './variables';
import listBlocks from './list';
import colorBlocks from './colors';

const allBlocks: BlockDefinition[] = [
	...observerBlocks,
	...turtleBlocks,
	...logicBlocks,
	...operatorBlocks,
	...mathBlocks,
	...stringBlocks,
	...agentsetBlocks,
	...variables,
	...listBlocks,
	...colorBlocks,
]

const activeBlocks = common.createBlockDefinitionsFromJsonArray(allBlocks);

export const forBlocks: Record<string, BlockFunction> = {};
allBlocks.forEach(blockDefinition => forBlocks[blockDefinition.type] = blockDefinition.for)


export default activeBlocks;

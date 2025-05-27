import { common } from 'blockly/core';
import { BlockDefinition, BlockFunction } from './types';
import observerBlocks from './observer';
import turtleBlocks from "./turtles";
import logicBlocks from "./logic";
import mathBlocks from "./math";
import stringBlocks from "./strings";
import agentsetBlocks from "./agentset";
import colorBlocks from "./colors";
import listBlocks from "./lists";

const allBlocks: BlockDefinition[] = [
	...observerBlocks,
	...turtleBlocks,
	...logicBlocks,
	...mathBlocks,
	...stringBlocks,
	...agentsetBlocks,
	...colorBlocks,
	...listBlocks
]

const activeBlocks = common.createBlockDefinitionsFromJsonArray(
	allBlocks.filter(blockDefinition => !(blockDefinition instanceof Function))
);

export const forBlocks: Record<string, BlockFunction> = {};
allBlocks.forEach(blockDefinition => {
	if (blockDefinition instanceof Function) {
		forBlocks[blockDefinition.name] = blockDefinition;
		console.log(blockDefinition.name);
	} else {
		forBlocks[blockDefinition.type] = blockDefinition.for;
	}
})

export default activeBlocks;

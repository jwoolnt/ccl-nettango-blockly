import { common } from 'blockly/core';
import { BlockDefinition, BlockFunction } from './definition/types';
import observer from './observer';
import turtle from "./turtles";
import logic from "./logic";
import math from "./math";
import operator from "./operators";
import string from "./strings";
import agentset from "./agentset";
import list from './list';
import color from './colors';
import variables from './variables';
import procedure from './procedure';

const allBlocks: BlockDefinition[] = [
	...observer,
	...turtle,
	...logic,
	...operator,
	...math,
	...string,
	...agentset,
	...variables,
	...list,
	...color,
	...procedure,
]

const activeBlocks = common.createBlockDefinitionsFromJsonArray(allBlocks);

export const forBlocks: Record<string, BlockFunction> = {};
allBlocks.forEach(blockDefinition => forBlocks[blockDefinition.type] = blockDefinition.for)


export default activeBlocks;

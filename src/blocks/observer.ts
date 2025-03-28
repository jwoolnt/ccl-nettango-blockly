import { BlockDefinition } from "./definition/types";
import { createBasicBlock } from "./definition/utilities";


const clear_all: BlockDefinition = createBasicBlock("clear_all");

const reset_ticks: BlockDefinition = createBasicBlock("reset_ticks");


const observerBlocks: BlockDefinition[] = [
	clear_all,
	reset_ticks
];


export default observerBlocks;

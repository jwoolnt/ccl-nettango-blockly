import { BlockDefinition } from "./types";
import { createStatementBlock } from "./utilities";


const clear_all: BlockDefinition = createStatementBlock("clear_all");

const reset_ticks: BlockDefinition = createStatementBlock("reset_ticks");


const observerBlocks: BlockDefinition[] = [
	clear_all,
	reset_ticks
];


export default observerBlocks;

import { BlockDefinition } from "./types";
import { createStatementBlock } from "./utilities";


const clear_all: BlockDefinition = createStatementBlock("clear_all");

const reset_ticks: BlockDefinition = createStatementBlock("reset_ticks");

const tick: BlockDefinition = createStatementBlock("tick");

// display labels
const display_labels: BlockDefinition = createStatementBlock("display_labels", {
	message0: "display labels",
	colour: "#795548",
	for: () => "display-labels"
});

const observerBlocks: BlockDefinition[] = [
	clear_all,
	reset_ticks,
	tick,
	display_labels
];


export default observerBlocks;

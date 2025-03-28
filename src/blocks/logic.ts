import { getAgentSets } from "../data/breeds";
import { BlockDefinition } from "./definition/types";
import { createBasicBlock, dynamicOptions } from "./definition/utilities";


const ask_agent_set = createBasicBlock("ask_agent_set", {
	message0: "ask %1\n %2",
	args0: [{
		type: "field_dropdown",
		name: "AGENT_SET",
		options: dynamicOptions(getAgentSets)
	}, {
		type: "input_statement",
		name: "COMMANDS"
	}],
	for: function (block, generator) {
		const agentSet = block.getFieldValue("AGENT_SET");
		const commands = generator.statementToCode(block, 'COMMANDS');
		return `ask ${agentSet} [\n${commands}\n]`
	}
});


const logicBlocks: BlockDefinition[] = [
	ask_agent_set
];


export default logicBlocks;

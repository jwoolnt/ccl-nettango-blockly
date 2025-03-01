import { common } from 'blockly/core';
import { agentSets, breedPlurals, defineBasicBlock } from '../define';


const create_breeds = {
	type: "create_breeds",
	message0: "create-%1 %2\n %3",
	args0: [{
		type: "field_dropdown",
		name: "BREED",
		options: () => breedPlurals.map(
			(breedPlural) => [breedPlural, breedPlural]
		)
	}, {
		type: "input_value",
		name: "NUMBER",
		check: "Number"
	}, {
		type: "input_statement",
		name: "SETUP"
	}],
	previousStatement: null,
	nextStatement: null
}

const ask_agent_set = {
	type: "ask_agent_set",
	message0: "ask %1\n %2",
	args0: [{
		type: "field_dropdown",
		name: "AGENT_SET",
		options: () => agentSets.map(
			(agentSet) => [agentSet, agentSet]
		)
	}, {
		type: "input_statement",
		name: "COMMANDS"
	}],
	previousStatement: null,
	nextStatement: null
}

export default common.createBlockDefinitionsFromJsonArray([
	create_breeds,
	ask_agent_set,
	defineBasicBlock("die")
]);

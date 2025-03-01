import { common } from 'blockly/core';
import { agentSets, breedPlurals, defineBasicBlock } from './define';

interface BlockDefinition {
	type: string;
	message0: string;
	args0: Array<any>;
	previousStatement: string | null;
	nextStatement: string | null;
}

const create_breeds: BlockDefinition = {
	type: "create_breeds",
	message0: "create-%1 %2\n %3",
	args0: [
		{
			type: "field_dropdown",
			name: "BREED",
			options: (): [string, string][] => breedPlurals.map(
				(breedPlural: string) => [breedPlural, breedPlural]
			)
		},
		{
			type: "input_value",
			name: "NUMBER",
			check: "Number"
		},
		{
			type: "input_statement",
			name: "SETUP"
		}
	],
	previousStatement: null,
	nextStatement: null
};

const ask_agent_set: BlockDefinition = {
	type: "ask_agent_set",
	message0: "ask %1\n %2",
	args0: [
		{
			type: "field_dropdown",
			name: "AGENT_SET",
			options: (): [string, string][] => agentSets.map(
				(agentSet: string) => [agentSet, agentSet]
			)
		},
		{
			type: "input_statement",
			name: "COMMANDS"
		}
	],
	previousStatement: null,
	nextStatement: null
};

export default common.createBlockDefinitionsFromJsonArray([
	create_breeds,
	ask_agent_set,
	defineBasicBlock("die")
]);
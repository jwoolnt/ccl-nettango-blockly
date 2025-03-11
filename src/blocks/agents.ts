import { common } from 'blockly/core';
import { getAgentSets, getBreeds, getBreedPlurals } from "../data/breeds";
import { dynamicOptions } from './utilities';


const create_breeds = {
	type: "create_breeds",
	message0: "create-%1 %2\n %3",
	args0: [{
		type: "field_dropdown",
		name: "BREED",
		options: dynamicOptions(getBreedPlurals(getBreeds()))
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
		options: dynamicOptions(getBreedPlurals(getAgentSets()))
	}, {
		type: "input_statement",
		name: "COMMANDS"
	}],
	previousStatement: null,
	nextStatement: null
}

const die = {
	type: "die",
	message0: "die"
}

export default common.createBlockDefinitionsFromJsonArray([
	create_breeds,
	ask_agent_set,
	die
]);

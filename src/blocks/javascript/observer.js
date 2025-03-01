import { common } from 'blockly/core';
import { defineBasicBlocks } from '../define';


const to = {
	type: "to",
	message0: "to %1\n %2",
	args0: [{
		type: "input_value",
		name: "NAME",
		check: "String"
	}, {
		type: "input_statement",
		name: "CODE"
	}]
}

const setup = {
	type: "setup",
	message0: "to setup\n %1",
	args0: [{
		type: "input_statement",
		name: "CODE"
	}]
}

const go = {
	type: "go",
	message0: "to go\n %1",
	args0: [{
		type: "input_statement",
		name: "CODE"
	}]
}

export default common.createBlockDefinitionsFromJsonArray(
	[...defineBasicBlocks(
		"clear_all",
		"reset_ticks"
	), to, setup, go]
);

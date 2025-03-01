import { common } from 'blockly/core';


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

const clear_all = {
	type: "clear_all",
	message0: "clear-all"
}

const reset_ticks = {
	type: "reset_ticks",
	message0: "reset-ticks"
}

export default common.createBlockDefinitionsFromJsonArray(
	[clear_all, reset_ticks, to, setup, go]
);

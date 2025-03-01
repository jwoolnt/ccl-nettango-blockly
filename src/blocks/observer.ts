import { common } from 'blockly/core';
import { defineBasicBlocks } from './define';

interface observerDefinition {
	type: string;
	message0: string;
	args0: Array<{
		type: string;
		name: string;
		check?: string;
	}>;
}

const to: observerDefinition = {
	type: "to",
	message0: "to %1\n %2",
	args0: [
		{
			type: "input_value",
			name: "NAME",
			check: "String"
		},
		{
			type: "input_statement",
			name: "CODE"
		}
	]
};

const setup: observerDefinition = {
	type: "setup",
	message0: "to setup\n %1",
	args0: [
		{
			type: "input_statement",
			name: "CODE"
		}
	]
};

const go: observerDefinition = {
	type: "go",
	message0: "to go\n %1",
	args0: [
		{
			type: "input_statement",
			name: "CODE"
		}
	]
};

export default common.createBlockDefinitionsFromJsonArray([
	...defineBasicBlocks("clear_all", "reset_ticks"),
	to,
	setup,
	go
]);

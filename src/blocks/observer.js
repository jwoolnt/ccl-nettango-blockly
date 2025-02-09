import { common } from 'blockly/core';
import { defineBasicBlocks } from './define';

export default common.createBlockDefinitionsFromJsonArray(
	defineBasicBlocks(
		"clear_all",
		"reset_ticks"
	)
);

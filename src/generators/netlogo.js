/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';

export const netlogoGenerator = new Blockly.Generator('NetLogo');

netlogoGenerator.scrub_ = function (block, code, thisOnly) {
	const nextBlock =
		block.nextConnection && block.nextConnection.targetBlock();
	if (nextBlock && !thisOnly) {
		return code + ',\n' + netlogoGenerator.blockToCode(nextBlock);
	}
	return code;
};

const { forBlock } = netlogoGenerator;

forBlock['test'] = function (block) {
	return `"test${Math.random() * 100}"`;
};

forBlock['big_test'] = function (block, generator) {
	const statement = generator.statementToCode(block, 'inside');
	return `big [\n${statement}\n] test`;
};

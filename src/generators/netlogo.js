/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';

export const netlogoGenerator = new Blockly.Generator('NetLogo');
const { forBlock } = netlogoGenerator;

forBlock['test'] = function (block) {
	return "\"test\"";
};

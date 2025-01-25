/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const test = {
  type: 'test',
  message0: 'Test Block',
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: 'This is a test Block.',
  helpUrl: '',
};

const big_test = {
  type: 'big_test',
  message0: 'Big Test Block %1',
  args0: [
    {
      "type": "input_statement",
      "name": "inside"
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: 'This is a big test Block.',
  helpUrl: '',
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  test, big_test
]);

/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/

export const toolbox = {
  kind: 'categoryToolbox',
  contents: [{
    kind: 'category',
    name: 'Observer',
    contents: [{
      kind: 'block',
      type: 'clear_all',
    }, {
      kind: 'block',
      type: 'reset_ticks',
    }],
  }, {
    kind: 'category',
    name: 'Agent',
    contents: [{
      kind: 'block',
      type: 'create_breeds',
    }, {
      kind: 'block',
      type: 'ask_agent_set',
    }, {
      kind: 'block',
      type: 'die',
    }],
  },
  {
    kind: 'category',
    name: 'Control',
    contents: [{
      kind: 'block',
      type: 'if_block',
    }, 
    { 
      kind: 'block',
      type: 'if_else_block',
    }],
  },
  {
    kind: 'category',
    name: 'Operators',
    "contents": [
    {
      "kind": "block",
      "type": "operator_equals"
    },
    {
      "kind": "block",
      "type": "operator_not_equals"
    },
    {
      "kind": "block",
      "type": "operator_and"
    },
    {
      "kind": "block",
      "type": "operator_or"
    },
    {
      "kind": "block",
      "type": "operator_not"
    },
    {
      "kind": "block",
      "type": "operator_add"
    },
    {
      "kind": "block",
      "type": "operator_subtract"
    },
    {
      "kind": "block",
      "type": "operator_multiply"
    },
    {
      "kind": "block",
      "type": "operator_divide"
    },
    {
      "kind": "block",
      "type": "operator_random"
    },
    {
      "kind": "block",
      "type": "operator_greater_than"
    },
    {
      "kind": "block",
      "type": "operator_less_than"
    },
  ],

  }
],
};